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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      <div className="pop-in" style={{ maxWidth: '400px', width: '90%', padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <img src="/img/logo.png" alt="Logo" style={{ width: '80px', marginBottom: '10px', borderRadius: '50%' }} />
        <h2 style={{ color: '#4ECDC4', marginBottom: '20px' }}>📝 Nuevo Profesor</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Elige un Usuario" 
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="password" placeholder="Elige una Contraseña" 
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" style={{ padding: '15px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Solicitar Acceso
          </button>
        </form>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
          ⬅ Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;