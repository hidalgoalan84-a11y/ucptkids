import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el usuario y su ROL en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      <div className="pop-in" style={{ maxWidth: '400px', width: '90%', padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <img src="/img/logo.png" alt="Logo" style={{ width: '100px', marginBottom: '10px', borderRadius: '50%' }} />
        <h2 style={{ color: '#FF6B6B', marginBottom: '20px' }}>🔐 Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#4ECDC4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
          ⬅ Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default LoginPage;