import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AdminPanel() {
  const [grupos, setGrupos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [teachers, setTeachers] = useState([])
  
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: '', horario: '', profesor: '' })
  const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: '', edad: '', grupo_id: '' })

  useEffect(() => {
    cargarGrupos()
    cargarAlumnos()
    cargarPendientes()
    cargarTeachers()
  }, [])

  const cargarGrupos = async () => {
    const respuesta = await fetch('/api/groups')
    const datos = await respuesta.json()
    setGrupos(datos)
  }

  const cargarAlumnos = async () => {
    const respuesta = await fetch('/api/students')
    const datos = await respuesta.json()
    setAlumnos(datos)
  }

  const cargarPendientes = async () => {
    const res = await fetch('/api/users/pending')
    const data = await res.json()
    setPendingUsers(data)
  }

  const cargarTeachers = async () => {
    const res = await fetch('/api/users/teachers')
    const data = await res.json()
    setTeachers(data)
  }

  const aprobarUsuario = async (id) => {
    await fetch(`/api/users/approve/${id}`, { method: 'POST' })
    alert("Usuario aprobado. Ahora es Teacher.")
    cargarPendientes()
  }

  const eliminarUsuario = async (id, tipo) => {
    if (!confirm("⚠️ ¿Estás seguro de que quieres eliminar a este usuario permanentemente?")) return;

    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (tipo === 'pending') cargarPendientes();
      if (tipo === 'teacher') cargarTeachers();
    } else {
      const data = await res.json();
      alert(data.error || "Error al eliminar");
    }
  }

  const eliminarAlumno = async (id) => {
    if (!confirm("⚠️ ¿Estás seguro de eliminar este alumno?")) return;
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (res.ok) {
      cargarAlumnos();
    } else {
      alert("Error al eliminar alumno");
    }
  }

  const crearGrupo = async (e) => {
    e.preventDefault()
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoGrupo)
    })
    setNuevoGrupo({ nombre: '', horario: '', profesor: '' }) 
    cargarGrupos() 
    alert("¡Grupo creado!")
  }

  const crearAlumno = async (e) => {
    e.preventDefault()
    if(!nuevoAlumno.grupo_id) return alert("Selecciona un grupo primero")

    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_completo: nuevoAlumno.nombre,
        edad: nuevoAlumno.edad,
        grupo_id: nuevoAlumno.grupo_id,
        foto_perfil: 'https://via.placeholder.com/150' 
      })
    })
    setNuevoAlumno({ nombre: '', edad: '', grupo_id: '' })
    cargarAlumnos()
    alert("¡Alumno registrado!")
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#fff'
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '10px'
  }

  const cardStyle = {
    background: 'white', 
    padding: '25px', 
    borderRadius: '15px', 
    marginBottom: '30px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  }

  return (
    <div style={{ padding: '40px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#555', textAlign: 'center', marginBottom: '30px' }}>⚙️ Panel de Profesores</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Link to="/admin/attendance" style={{ background: '#673AB7', color: 'white', padding: '12px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(103, 58, 183, 0.3)' }}>
            📊 Ver Historial de Asistencia
        </Link>
      </div>
      
      {/* SECCIÓN DE MODERACIÓN */}
      <div style={{ background: '#FFF9C4', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '2px solid #FFF59D' }}>
        <h2 style={{ marginTop: 0, color: '#FBC02D' }}>🛡️ Solicitudes de Acceso ({pendingUsers.length})</h2>
        {pendingUsers.length === 0 && <p style={{color: '#777'}}>No hay usuarios pendientes.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pendingUsers.map(u => (
            <li key={u.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: 'white', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>👤 {u.username}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => aprobarUsuario(u.id)} style={{ background: '#4ECDC4', border: 'none', padding: '8px 15px', color: 'white', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
                  ✅ Aprobar
                </button>
                <button onClick={() => eliminarUsuario(u.id, 'pending')} style={{ background: '#FF5252', border: 'none', padding: '8px 15px', color: 'white', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* SECCIÓN DE PROFESORES ACTIVOS */}
      <div style={{ background: '#E0F7FA', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '2px solid #B2EBF2' }}>
        <h2 style={{ marginTop: 0, color: '#0097A7' }}>👨‍🏫 Profesores Activos ({teachers.length})</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {teachers.map(u => (
            <li key={u.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: 'white', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>🎓 {u.username}</span>
              <button onClick={() => eliminarUsuario(u.id, 'teacher')} style={{ background: '#FF5252', border: 'none', padding: '8px 15px', color: 'white', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
                🗑️ Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#4ECDC4' }}>1. Crear Salón</h2>
        <form onSubmit={crearGrupo}>
          <input 
            type="text" placeholder="Nombre (Ej: Maternal A)" 
            value={nuevoGrupo.nombre}
            onChange={e => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
            required
            style={inputStyle}
          />
          <input 
            type="text" placeholder="Horario" 
            value={nuevoGrupo.horario}
            onChange={e => setNuevoGrupo({...nuevoGrupo, horario: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="text" placeholder="Profesor Encargado" 
            value={nuevoGrupo.profesor}
            onChange={e => setNuevoGrupo({...nuevoGrupo, profesor: e.target.value})}
            style={inputStyle}
          />
          <button type="submit" style={{ ...buttonStyle, backgroundColor: '#4ECDC4' }}>Crear Salón</button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#FF6B6B' }}>2. Registrar Alumno</h2>
        <form onSubmit={crearAlumno}>
          <input 
            type="text" placeholder="Nombre Completo" 
            value={nuevoAlumno.nombre}
            onChange={e => setNuevoAlumno({...nuevoAlumno, nombre: e.target.value})}
            required
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" placeholder="Edad" 
              value={nuevoAlumno.edad}
              onChange={e => setNuevoAlumno({...nuevoAlumno, edad: e.target.value})}
              style={{ ...inputStyle, width: '100px' }}
            />
            <select 
              value={nuevoAlumno.grupo_id} 
              onChange={e => setNuevoAlumno({...nuevoAlumno, grupo_id: e.target.value})}
              required
              style={{ ...inputStyle, flex: 1 }}
            >
              <option value="">-- Selecciona un Salón --</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: '#FF6B6B' }}>Registrar Alumno</button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#555' }}>📋 Alumnos Registrados</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {alumnos.map(alumno => (
            <li key={alumno.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
              <span style={{ color: '#555' }}><strong>{alumno.nombre_completo}</strong> ({alumno.edad} años)</span>
              <button onClick={() => eliminarAlumno(alumno.id)} style={{ background: '#FF5252', border: 'none', padding: '5px 10px', color: 'white', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <Link to="/dashboard" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>⬅ Volver al Dashboard</Link>
      </div>
    </div>
  )
}

export default AdminPanel