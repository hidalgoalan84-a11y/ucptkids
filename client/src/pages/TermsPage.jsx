import { Link } from 'react-router-dom';

function TermsPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', 
      padding: '40px', 
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' 
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        background: 'white', 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
      }}>
        <h1 style={{ color: '#FF6B6B', textAlign: 'center', marginBottom: '30px' }}>📜 Términos y Condiciones</h1>
        
        <div style={{ color: '#555', lineHeight: '1.6' }}>
          <h3 style={{ color: '#4ECDC4' }}>1. Privacidad de Menores</h3>
          <p>
            La seguridad y privacidad de los niños es nuestra máxima prioridad. Queda <strong>estrictamente prohibido</strong> descargar, capturar o compartir fotografías, videos o información personal de los menores alojados en esta plataforma en redes sociales personales (Facebook, Instagram, WhatsApp, etc.) o cualquier otro medio público. El incumplimiento de esta norma conllevará la suspensión inmediata de la cuenta y las acciones legales pertinentes.
          </p>

          <h3 style={{ color: '#4ECDC4' }}>2. Uso del Sistema</h3>
          <p>
            Esta plataforma es una herramienta de gestión escolar interna exclusiva para el personal autorizado de "UCPT Kids". Su uso está limitado a actividades relacionadas con la administración académica, seguimiento de alumnos y comunicación institucional. Cualquier uso indebido o con fines ajenos a la institución está prohibido.
          </p>

          <h3 style={{ color: '#4ECDC4' }}>3. Responsabilidad de Acceso</h3>
          <p>
            Los profesores y administradores son responsables de mantener la confidencialidad de sus credenciales de acceso (usuario y contraseña). No deben compartir sus cuentas con terceros. Cualquier actividad realizada desde su cuenta será responsabilidad del titular de la misma.
          </p>

          <h3 style={{ color: '#4ECDC4' }}>4. Propiedad Intelectual</h3>
          <p>
            Todo el software, diseño, logotipos y contenido de esta aplicación son propiedad intelectual del proyecto <strong>"Una Casa Para Todos"</strong>. Está prohibida su reproducción total o parcial sin autorización previa.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
            ⬅ Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
