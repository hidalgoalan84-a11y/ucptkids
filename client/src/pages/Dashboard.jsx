import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Error cargando grupos:", err));
  }, []);

  // Colores pastel para las tarjetas
  const colors = ['#FFD1DC', '#B0E0E6', '#FFFACD', '#E0F7FA'];

  return (
    <div className="page-container" style={{ padding: '40px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', minHeight: '100vh' }}>
      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/img/logo.png" alt="Logo" style={{ height: '60px', borderRadius: '50%' }} />
          <h1 style={{ color: '#555', margin: 0 }}>Hola, {user.username}</h1>
        </div>
        <div className="header-flex" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.role === 'admin' && (
            <Link to="/admin-panel" style={{ textDecoration: 'none', background: '#333', color: 'white', padding: '10px 20px', borderRadius: '20px' }}>
              ⚙️ Panel Admin
            </Link>
          )}
          <Link to="/schedules" style={{ textDecoration: 'none', background: '#FF6B6B', color: 'white', padding: '10px 20px', borderRadius: '20px' }}>
              📅 Roles del Mes
          </Link>
          <Link to="/activities" style={{ textDecoration: 'none', background: '#009688', color: 'white', padding: '10px 20px', borderRadius: '20px' }}>
              📸 Galería
          </Link>
          <button onClick={handleLogout} style={{ background: '#556270', color: 'white', padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              🚪 Salir
          </button>
        </div>
      </div>
      
      <h2 style={{ textAlign: 'center', color: '#888', margin: '30px 0' }}>Selecciona un Grupo</h2>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        {groups.map((group, index) => (
          <Link 
            to={`/group/${group.id}`} 
            key={group.id} 
            className="card-hover slide-up"
            style={{ 
              textDecoration: 'none', 
              color: '#555',
              backgroundColor: colors[index % colors.length], 
              borderRadius: '20px', 
              padding: '40px', 
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s',
              cursor: 'pointer',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎓</div>
            <h2 style={{ margin: 0 }}>{group.nombre}</h2>
            {group.profesor && <p style={{ fontWeight: 'bold', color: '#555' }}>Prof: {group.profesor}</p>}
            <p>{group.horario}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;