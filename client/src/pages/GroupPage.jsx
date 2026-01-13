import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  Trash2, 
  Plus, 
  ClipboardList, 
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

function GroupPage() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  
  // Obtenemos usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Permisos: Solo admin y teacher pueden editar
  const canEdit = user.role === 'admin' || user.role === 'teacher';

  useEffect(() => {
    // 1. Cargar alumnos
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        // ParseInt es importante porque params.id viene como string
        const groupStudents = data.filter(s => s.grupo_id === parseInt(id));
        setStudents(groupStudents);
      })
      .catch(err => console.error(err));

    // 2. Cargar profesores asignados
    fetchTeachers();

    // 3. Si es admin, cargar lista de todos los teachers para el select
    if (user.role === 'admin') {
      fetch('/api/users/teachers')
        .then(res => res.json())
        .then(data => setAvailableTeachers(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const fetchTeachers = () => {
    fetch(`/api/groups/${id}/teachers`)
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(err => console.error(err));
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (user.role !== 'admin') return alert("⛔ Acción denegada: Solo el Administrador puede asignar profesores.");
    if (!selectedTeacherId) return;
    
    await fetch(`/api/groups/${id}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedTeacherId })
    });
    
    setSelectedTeacherId('');
    fetchTeachers();
  };

  const handleRemoveTeacher = async (userId) => {
    if (user.role !== 'admin') return alert("⛔ Acción denegada: Solo el Administrador puede quitar profesores.");
    if (!confirm("¿Quitar a este profesor del grupo?")) return;
    
    await fetch(`/api/groups/${id}/teachers/${userId}`, { method: 'DELETE' });
    fetchTeachers();
  };

  const handleDelete = async (studentId) => {
    if (!confirm("¿Estás seguro de eliminar este alumno? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents(students.filter(s => s.id !== studentId));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-surface font-sans p-6 lg:p-10">
      
      {/* 1. NAVEGACIÓN Y TÍTULO */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-4 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-primary-100 p-2 rounded-xl text-primary-600">
                <Users className="w-8 h-8" />
              </span>
              Grupo {id}
            </h1>
            <p className="text-gray-500 ml-1 mt-1">Gestión de alumnos y personal docente</p>
          </div>

          {/* Botones de Acción Principal (Solo si tiene permisos) */}
          {canEdit && (
            <div className="flex gap-3">
              <Link 
                to={`/group/${id}/attendance`} 
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all"
              >
                <ClipboardList className="w-5 h-5" />
                Pasar Lista
              </Link>
              <Link 
                to="/add-student" 
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Nuevo Alumno
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. COLUMNA IZQUIERDA: Staff Docente */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent-500" />
              Profesores
            </h2>
            
            <div className="space-y-3">
              {teachers.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Sin asignaciones</p>
                </div>
              ) : (
                teachers.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-primary-50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold text-xs shrink-0">
                        {t.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700 text-sm truncate">{t.username}</span>
                    </div>
                    
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => handleRemoveTeacher(t.id)} 
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Quitar profesor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Formulario de Asignación (Solo Admin) */}
            {user.role === 'admin' && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Asignar Docente</p>
                <form onSubmit={handleAssignTeacher} className="flex flex-col gap-2">
                  <div className="relative">
                    <select 
                      value={selectedTeacherId} 
                      onChange={e => setSelectedTeacherId(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Seleccionar...</option>
                      {availableTeachers.map(t => (
                        <option key={t.id} value={t.id}>{t.username}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!selectedTeacherId}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirmar
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {/* Card informativa (Decorativa) */}
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-blue-800">
            <div className="flex gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Información</h3>
                <p className="text-xs opacity-80 mt-1">
                  Los cambios en la lista de profesores se reflejan inmediatamente en los permisos de edición.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. COLUMNA DERECHA: Lista de Alumnos (Grid) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Lista de Clase</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                {students.length} Alumnos
              </span>
            </div>

            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Clase vacía</h3>
                <p className="text-gray-500 max-w-sm">
                  Aún no hay alumnos registrados en este grupo. ¡Comienza agregando uno nuevo!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white border border-gray-100 hover:border-primary-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img 
                          src={student.foto_perfil || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + student.nombre_completo} // Placeholder dinámico divertido
                          alt={student.nombre_completo} 
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 text-center mb-1 line-clamp-1 w-full">
                        {student.nombre_completo}
                      </h3>
                      <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        {student.edad} años
                      </p>
                    </div>

                    {/* Acciones flotantes (Solo aparecen en hover para Desktop, siempre visibles si quieres) */}
                    {canEdit && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="bg-white text-red-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg shadow-sm border border-gray-100 transition-colors"
                          title="Eliminar alumno"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default GroupPage;