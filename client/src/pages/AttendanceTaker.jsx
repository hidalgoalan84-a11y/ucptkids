import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AttendanceTaker() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    // Cargar alumnos del grupo
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        const groupStudents = data.filter(s => s.grupo_id === parseInt(groupId));
        setStudents(groupStudents);
        // Inicializar todos como "presente" (true) por defecto
        const initialStatus = {};
        groupStudents.forEach(s => initialStatus[s.id] = true);
        setAttendance(initialStatus);
      })
      .catch(err => console.error(err));
  }, [groupId]);

  const handleCheckboxChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = async () => {
    const records = Object.keys(attendance).map(studentId => ({
      studentId: parseInt(studentId),
      status: attendance[studentId] ? 'present' : 'absent'
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, records })
      });
      
      if (res.ok) {
        alert("✅ Asistencia guardada correctamente");
        navigate(`/group/${groupId}`);
      } else {
        alert("Error al guardar asistencia");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-container" style={{ padding: '40px', fontFamily: '"Comic Sans MS", sans-serif', background: 'linear-gradient(135deg, #E0F7FA 0%, #E1F5FE 100%)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#0288D1', textAlign: 'center' }}>📝 Pasar Lista</h1>
        <p style={{ textAlign: 'center', color: '#666' }}>Fecha: {new Date().toLocaleDateString()}</p>
        
        <div style={{ marginTop: '20px' }}>
          {students.map(student => (
            <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#555' }}>{student.nombre_completo}</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={attendance[student.id] || false} 
                  onChange={() => handleCheckboxChange(student.id)}
                  style={{ width: '20px', height: '20px', accentColor: '#4CAF50' }}
                />
                <span style={{ color: attendance[student.id] ? 'green' : 'red' }}>{attendance[student.id] ? 'Presente' : 'Ausente'}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="header-flex" style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <button onClick={handleSubmit} className="btn-animate" style={{ flex: 1, padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Asistencia</button>
          <button onClick={() => navigate(`/group/${groupId}`)} className="btn-animate" style={{ flex: 1, padding: '15px', background: '#FF5252', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceTaker;