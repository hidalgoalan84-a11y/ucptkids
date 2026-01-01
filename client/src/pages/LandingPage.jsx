import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleParentLogin = () => {
    // Creamos una sesión de "Padre" (rol limitado)
    localStorage.setItem('user', JSON.stringify({ username: 'Padre de Familia', role: 'parent' }));
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <img src="/img/logo.png" alt="UCPT Kids" className="pop-in" style={{ maxWidth: '200px', marginBottom: '20px', borderRadius: '50%' }} />
      <h1 className="slide-up" style={{ fontSize: '3.5rem', color: '#FF6B6B', marginBottom: '10px', animationDelay: '0.1s' }}>UCPT Kids</h1>
      <p className="slide-up" style={{ fontSize: '1.5rem', color: '#4ECDC4', marginBottom: '40px', animationDelay: '0.2s' }}>Gestión Escolar Divertida y Segura</p>
      
      <div className="fade-in" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.4s' }}>
        <Link to="/login" style={btnStyle('#FF6B6B')}>🔐 Iniciar Sesión</Link>
        <Link to="/register" style={btnStyle('#4ECDC4')}>📝 Registrarme como Profe</Link>
        <button onClick={handleParentLogin} style={{ ...btnStyle('#FFD93D'), border: 'none', cursor: 'pointer', color: '#555' }}>👪 Soy Padre/Madre</button>
      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '15px 40px',
  borderRadius: '30px',
  textDecoration: 'none',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  display: 'inline-block'
});

export default LandingPage;