import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Agregué confirmación de contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden 😕');
      return;
    }

    try {

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'teacher' }), // Por defecto crea maestros (teacher)
      });

      const data = await response.json();

      if (response.ok) {
        // Si el registro es exitoso, redirigimos al login
        navigate('/login');
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'linear-gradient(135deg, #E0F2F1 0%, #80CBC4 100%)', // Un verde un poco más claro
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '20px', boxSizing: 'border-box'
    }}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, type: "spring" }}
        
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '15px', fontSize: '3rem' }}>📝</div>
        
        <h2 style={{ color: '#00695C', margin: '0 0 10px 0', fontSize: '1.8rem', fontWeight: '800' }}>
          Nuevo Profesor
        </h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
          Únete a UCPT Kids para gestionar tu clase
        </p>
        
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            style={{ 
              background: '#FFEBEE', color: '#D32F2F', padding: '10px', 
              borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #FFCDD2'
            }}>
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input
            type="text"
            placeholder="Elige un Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '15px', borderRadius: '12px', border: '2px solid #E0E0E0',
              fontSize: '1rem', background: '#FAFAFA', outline: 'none', transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#26A69A'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '15px', borderRadius: '12px', border: '2px solid #E0E0E0',
              fontSize: '1rem', background: '#FAFAFA', outline: 'none', transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#26A69A'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />

          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              padding: '15px', borderRadius: '12px', border: '2px solid #E0E0E0',
              fontSize: '1rem', background: '#FAFAFA', outline: 'none', transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#26A69A'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />

          <motion.button 
            whileTap={{ scale: 0.95 }} 
            type="submit" 
            style={{
              padding: '15px', borderRadius: '12px', border: 'none',
              background: '#26A69A', color: 'white', fontSize: '1.1rem',
              fontWeight: 'bold', cursor: 'pointer', marginTop: '10px',
              boxShadow: '0 4px 14px rgba(38, 166, 154, 0.4)'
            }}
          >
            Registrarme
          </motion.button>
        </form>

        <div style={{ marginTop: '25px' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>¿Ya tienes cuenta? </span>
          <Link to="/login" style={{ color: '#00796B', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
            Inicia Sesión
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

export default RegisterPage;