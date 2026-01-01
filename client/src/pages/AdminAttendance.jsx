import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminAttendance() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') return;
    fetch('/api/attendance/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  if (user.role !== 'admin') return <div style={{ padding: '40px', textAlign: 'center' }}>⛔ Acceso Denegado</div>;

  return (
    <div className="page-container" style={{ padding: '40px', fontFamily: '"Comic Sans MS", sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <div className="centered-view" style={{ maxWidth: '900px' }}>
        <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#555' }}>📊 Historial de Asistencia</h1>
            <Link to="/admin-panel" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>⬅ Volver al Panel</Link>
        </div>
        
        <div className="table-responsive" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Fecha</th>
                <th style={{ padding: '10px' }}>Grupo</th>
                <th style={{ padding: '10px' }}>Alumno</th>
                <th style={{ padding: '10px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px' }}>{new Date(record.date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px' }}>{record.group_name}</td>
                  <td style={{ padding: '10px' }}>{record.student_name}</td>
                  <td style={{ padding: '10px', color: record.status === 'present' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {record.status === 'present' ? 'Presente' : 'Ausente'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No hay registros recientes.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;