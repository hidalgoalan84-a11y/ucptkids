import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function GroupPage() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Permisos: Solo admin y teacher pueden editar
  const canEdit = user.role === 'admin' || user.role === 'teacher';

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        // Filtramos en el cliente para no romper la API existente
        const groupStudents = data.filter(s => s.grupo_id === parseInt(id));
        setStudents(groupStudents);
      })
      .catch(err => console.error(err));

    // Cargar profesores asignados al grupo
    fetchTeachers();

    // Si es admin, cargar lista de todos los teachers para el select
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
    console.log('eliminar', studentId);
    // Lógica temporalmente deshabilitada para asegurar compilación
  };

  return (
    <div className="page-container" style={{ padding: '40px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', minHeight: '100vh' }}>
      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#888' }}>⬅ Volver</Link>
        <h1>Detalle del Grupo</h1>
      </div>

      {/* SECCIÓN DE PROFESORES ENCARGADOS */}
      <div style={{ background: '#E0F7FA', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '2px solid #B2EBF2' }}>
        <h2 style={{ marginTop: 0, color: '#006064', textAlign: 'center' }}>🍎 Profesores Encargados</h2>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {teachers.length === 0 && <p style={{ color: '#666' }}>No hay profesores asignados aún.</p>}
          {teachers.map(t => (
            <div key={t.id} style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>{t.username}</span>
              {user.role === 'admin' && (
                <button onClick={() => handleRemoveTeacher(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
              )}
            </div>
          ))}
        </div>

        {/* Formulario solo para Admin */}
        {user.role === 'admin' && (
          <form onSubmit={handleAssignTeacher} style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="">-- Asignar Profesor --</option>
              {availableTeachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
            </select>
            <button type="submit" style={{ background: '#00BCD4', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Asignar</button>
          </form>
        )}
      </div>

      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1>Lista de Alumnos</h1>
        
        {/* RENDERIZADO CONDICIONAL POR ROL */}
        {canEdit && (
          <div className="header-flex" style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/group/${id}/attendance`} style={{ background: '#FF9800', color: 'white', padding: '10px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
            📝 Pasar Lista
          </Link>
          <Link to="/add-student" style={{ background: '#4ECDC4', color: 'white', padding: '10px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
            + Nuevo Alumno
          </Link>
          </div>
        )}
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {students.map(student => (
          <div key={student.id} style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <img 
              src={student.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
              alt="avatar" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
            />
            <h3 style={{ margin: '5px 0', color: '#555' }}>{student.nombre_completo}</h3>
            <p style={{ color: '#999' }}>{student.edad} años</p>
            
            {canEdit && (
               <button onClick={() => handleDelete(student.id)} style={{ marginTop: '10px', background: '#FF6B6B', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                 Eliminar
               </button>
            )}
          </div>
        ))}
      </div>
      
      {students.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>No hay alumnos en este grupo.</p>}
    </div>
  );
}

export default GroupPage;