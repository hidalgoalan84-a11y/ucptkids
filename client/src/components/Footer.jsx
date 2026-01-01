import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center',
      borderTop: '1px solid #e9ecef',
      marginTop: 'auto', // Esto empuja el footer al fondo si hay poco contenido
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
    }}>
      <div className="footer-content" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <a 
          href="https://www.instagram.com/unacasaparatodostexcoco?igsh=d2s3Y3lnZm1ycWc4" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#E1306C', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          📸 Instagram
        </a>
        <Link to="/terms" style={{ color: '#007bff', textDecoration: 'none' }}>
          📜 Términos y Condiciones
        </Link>
      </div>
      <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>
        © 2025 UCPT Kids - Una Casa Para Todos
      </p>
    </footer>
  );
}

export default Footer;
