import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      setSchedules(data);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Falta título o archivo");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        body: formData // No lleva Content-Type header manual, el navegador lo pone
      });
      if (res.ok) {
        alert("Rol subido correctamente");
        setTitle('');
        setFile(null);
        // Resetear input file visualmente es un poco más complejo en React puro, 
        // pero recargando la lista basta por ahora.
        fetchSchedules();
      } else {
        alert("Error al subir");
      }
    } catch (err) { console.error(err); }
  };

  const isImage = (url) => url.match(/\.(jpeg|jpg|gif|png)$/i);

  return (
    <div style={{ padding: '40px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#888' }}>⬅ Volver al Dashboard</Link>
        <h1 style={{ color: '#FF6B6B' }}>📅 Roles y Actividades Mensuales</h1>
      </div>

      {/* FORMULARIO SOLO PARA ADMIN */}
      {isAdmin && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
          <h3 style={{ marginTop: 0 }}>Subir Nuevo Rol</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Título (Ej: Roles Marzo)" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
            />
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={e => setFile(e.target.files[0])}
              style={{ padding: '10px' }}
            />
            <button type="submit" style={{ background: '#4ECDC4', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Subir Archivo
            </button>
          </form>
        </div>
      )}

      {/* LISTA DE ROLES */}
      <div style={{ display: 'grid', gap: '30px' }}>
        {schedules.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No hay roles publicados aún.</p>}
        
        {schedules.map(item => (
          <div key={item.id} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#555', marginTop: 0 }}>{item.title}</h2>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Publicado el: {new Date(item.created_at).toLocaleDateString()}</p>
            
            <div style={{ marginTop: '15px' }}>
              {isImage(item.file_url) ? (
                <img 
                  src={item.file_url} 
                  alt={item.title} 
                  style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '10px', border: '1px solid #eee' }} 
                />
              ) : (
                <a 
                  href={item.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', background: '#FFD93D', color: '#555', padding: '15px 30px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  📄 Ver Documento PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulesPage;
