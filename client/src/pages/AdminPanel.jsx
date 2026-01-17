import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  School, 
  UserPlus, 
  CheckCircle, 
  Trash2, 
  ShieldAlert,
  ClipboardList,
  PlusCircle,
  GraduationCap,
  Megaphone, 
  Send       
} from 'lucide-react';
import { motion } from 'framer-motion';

function AdminPanel() {
  // --- ESTADOS ---
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  // Estado para formularios
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: '', horario: '', profesor: '' });
  const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: '', edad: '', grupo_id: '' });
  
  // Estado para Anuncios
  const [announcement, setAnnouncement] = useState({ title: '', message: '' });

  useEffect(() => {
    cargarGrupos();
    cargarAlumnos();
    cargarPendientes();
    cargarTeachers();
  }, []);

  // --- CARGA DE DATOS ---
  const cargarGrupos = async () => {
    try {
      const respuesta = await fetch('/api/groups');
      const datos = await respuesta.json();
      if (Array.isArray(datos)) setGrupos(datos);
    } catch (e) { console.error(e); }
  };

  const cargarAlumnos = async () => {
    try {
      const respuesta = await fetch('/api/students');
      const datos = await respuesta.json();
      if (Array.isArray(datos)) setAlumnos(datos);
    } catch (e) { console.error(e); }
  };

  const cargarPendientes = async () => {
    try {
      const res = await fetch('/api/users/pending');
      const data = await res.json();
      if (Array.isArray(data)) setPendingUsers(data);
    } catch (e) { console.error(e); }
  };

  const cargarTeachers = async () => {
    try {
      const res = await fetch('/api/users/teachers');
      const data = await res.json();
      if (Array.isArray(data)) setTeachers(data);
    } catch (e) { console.error(e); }
  };

  // --- ACCIONES USUARIOS ---
  const aprobarUsuario = async (id) => {
    await fetch(`/api/users/approve/${id}`, { method: 'POST' });
    alert("Usuario aprobado. Ahora es Teacher.");
    cargarPendientes();
    cargarTeachers();
  };

  const eliminarUsuario = async (id, tipo) => {
    if (!confirm("⚠️ ¿Estás seguro de eliminar este usuario?")) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (tipo === 'pending') cargarPendientes();
      if (tipo === 'teacher') cargarTeachers();
    } else {
      alert("Error al eliminar");
    }
  };

  // --- ACCIONES DATOS ---
  const handleDelete = async (id) => {
    if (!confirm("⚠️ ¿Eliminar alumno?")) return;
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (res.ok) cargarAlumnos();
  };

  const eliminarGrupo = async (id) => {
    if (!confirm("⚠️ ¿Eliminar grupo y sus alumnos?")) return;
    const res = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
    if (res.ok) cargarGrupos();
  };

  const crearGrupo = async (e) => {
    e.preventDefault();
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoGrupo)
    });
    setNuevoGrupo({ nombre: '', horario: '', profesor: '' });
    cargarGrupos();
    alert("¡Grupo creado!");
  };

  // --- CREAR ALUMNO CON AVATAR MÁGICO ---
  const crearAlumno = async (e) => {
    e.preventDefault();
    if(!nuevoAlumno.grupo_id) return alert("Selecciona un grupo primero");

    // Generamos el link del avatar basado en el nombre
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nuevoAlumno.nombre}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_completo: nuevoAlumno.nombre,
        edad: nuevoAlumno.edad,
        grupo_id: nuevoAlumno.grupo_id,
        foto_perfil: avatarUrl // Guardamos el avatar generado
      })
    });
    setNuevoAlumno({ nombre: '', edad: '', grupo_id: '' });
    cargarAlumnos();
    alert("¡Alumno registrado con Avatar!");
  };

  // --- LÓGICA DE ANUNCIOS (MEGÁFONO) ---
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement)
      });
      
      if (response.ok) {
        alert('¡Aviso publicado! (El anterior fue eliminado)');
        setAnnouncement({ title: '', message: '' });
      }
    } catch (error) {
      console.error(error);
      alert('Error al publicar');
    }
  };

  const handleDeleteAnnouncement = async () => {
    if(!confirm("¿Borrar el aviso actual?")) return;
    await fetch('/api/announcement', { method: 'DELETE' });
    alert("Aviso eliminado.");
  };

  // --- UI COMPONENTS ---
  const SectionTitle = ({ icon: Icon, title, count, color }) => (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon className={`w-6 h-6 text-${color.split('-')[1]}-500`} />
      </div>
      <h2 className="text-xl font-bold text-gray-800">
        {title} 
        {count !== undefined && <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-500">{count}</span>}
      </h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface font-sans p-6 lg:p-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-2 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona usuarios, grupos y alumnos.</p>
        </div>
        
        <Link 
          to="/admin/attendance" 
          className="flex items-center gap-2 bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 px-6 py-3 rounded-xl font-bold shadow-sm transition-all"
        >
          <ClipboardList className="w-5 h-5" />
          Historial de Asistencia
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA (2/3) */}
        <div className="xl:col-span-2 space-y-8">

          {/* 1. SECCIÓN DE PUBLICAR AVISO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <Megaphone />
              <h2 className="text-xl font-bold">Publicar Aviso General</h2>
            </div>
            
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <input 
                type="text" 
                placeholder="Título (Ej: Suspensión de clases)" 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
                value={announcement.title}
                onChange={e => setAnnouncement({...announcement, title: e.target.value})}
                required
              />
              <textarea 
                placeholder="Escribe el mensaje aquí..." 
                className="w-full p-3 border rounded-xl h-24 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                value={announcement.message}
                onChange={e => setAnnouncement({...announcement, message: e.target.value})}
                required
              />
              
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors">
                  <Send size={18} /> Publicar Aviso
                </button>
                <button type="button" onClick={handleDeleteAnnouncement} className="bg-red-50 text-red-600 px-4 rounded-lg hover:bg-red-100 border border-red-200 transition-colors" title="Borrar aviso vigente">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Nota: Al publicar, se borrará automáticamente cualquier aviso anterior.</p>
            </form>
          </div>
          
          {/* 2. SOLICITUDES DE ACCESO */}
          {pendingUsers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Solicitudes Pendientes
                </h3>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{pendingUsers.length} nuevas</span>
              </div>
              <div className="grid gap-3">
                {pendingUsers.map(u => (
                  <div key={u.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">?</div>
                      <div>
                        <p className="font-bold text-gray-800">{u.username}</p>
                        <p className="text-xs text-gray-500">Solicita acceso como profesor</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => aprobarUsuario(u.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => eliminarUsuario(u.id, 'pending')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. LISTA DE PROFESORES */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <SectionTitle icon={GraduationCap} title="Equipo Docente" count={teachers.length} color="bg-blue-100" />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="py-3 font-medium">Profesor</th>
                    <th className="py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(t => (
                    <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {t.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700">{t.username}</span>
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={() => eliminarUsuario(t.id, 'teacher')} className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {teachers.length === 0 && (
                    <tr><td colSpan="2" className="py-4 text-center text-gray-400 text-sm">No hay profesores activos</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. LISTA DE ALUMNOS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <SectionTitle icon={Users} title="Directorio de Alumnos" count={alumnos.length} color="bg-green-100" />
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="py-3 font-medium">Alumno</th>
                    <th className="py-3 font-medium">Edad</th>
                    <th className="py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map(a => (
                    <tr key={a.id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                      <td className="py-3 flex items-center gap-3">
                        {/* Avatar Pequeño en la tabla */}
                        <img 
                          src={a.foto_perfil || 'https://via.placeholder.com/40'} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full bg-gray-100"
                        />
                        <span className="font-medium text-gray-700">{a.nombre_completo}</span>
                      </td>
                      <td className="py-3 text-gray-500 text-sm">{a.edad} años</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {alumnos.length === 0 && (
                    <tr><td colSpan="3" className="py-4 text-center text-gray-400 text-sm">No hay alumnos registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA (1/3) */}
        <div className="space-y-8">
          
          {/* CREAR GRUPO */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100">
            <SectionTitle icon={School} title="Nuevo Salón" color="bg-purple-100" />
            <form onSubmit={crearGrupo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Grupo</label>
                <input 
                  type="text" 
                  placeholder="Ej: Maternal A" 
                  value={nuevoGrupo.nombre}
                  onChange={e => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horario</label>
                <input 
                  type="text" 
                  placeholder="Ej: 8:00 - 13:00" 
                  value={nuevoGrupo.horario}
                  onChange={e => setNuevoGrupo({...nuevoGrupo, horario: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" /> Crear Grupo
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Salones Existentes</p>
              <div className="space-y-2">
                {grupos.map(g => (
                  <div key={g.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg group">
                    <span className="text-gray-600">{g.nombre}</span>
                    <button onClick={() => eliminarGrupo(g.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Eliminar Grupo">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CREAR ALUMNO (CON VISTA PREVIA) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-pink-500/5 border border-pink-100">
            <SectionTitle icon={UserPlus} title="Inscribir Alumno" color="bg-pink-100" />
            
            {/* VISTA PREVIA AVATAR */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${nuevoAlumno.nombre || 'placeholder'}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                  alt="Avatar Preview" 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-50 transition-all duration-300"
                />
                {!nuevoAlumno.nombre && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full backdrop-blur-[1px]">
                    <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">Nombre...</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={crearAlumno} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="Ej: Juanito Pérez" 
                  value={nuevoAlumno.nombre}
                  onChange={e => setNuevoAlumno({...nuevoAlumno, nombre: e.target.value})}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Edad</label>
                  <input 
                    type="number" 
                    placeholder="Años" 
                    value={nuevoAlumno.edad}
                    onChange={e => setNuevoAlumno({...nuevoAlumno, edad: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Asignar a</label>
                  <select 
                    value={nuevoAlumno.grupo_id} 
                    onChange={e => setNuevoAlumno({...nuevoAlumno, grupo_id: e.target.value})}
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  >
                    <option value="">Grupo...</option>
                    {grupos.map(g => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Inscribir
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;