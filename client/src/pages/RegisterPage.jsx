import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("¡Registro exitoso! Tu cuenta está pendiente de aprobación por el Admin.");
        navigate('/login');
      } else {
        const data = await res.json();
        alert(data.error || "Error al registrarse");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card pop-in">
        <img src="/img/logo.png" alt="Logo" style={{ width: '80px', marginBottom: '10px', borderRadius: '50%' }} />
        <h2 style={{ color: '#4ECDC4', marginBottom: '20px' }}>📝 Nuevo Profesor</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" placeholder="Elige un Usuario" 
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="password" placeholder="Elige una Contraseña" 
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="btn-animate" style={{ padding: '15px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Solicitar Acceso
          </button>
        </form>
        <button onClick={() => navigate('/')} className="btn-animate" style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
          ⬅ Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;