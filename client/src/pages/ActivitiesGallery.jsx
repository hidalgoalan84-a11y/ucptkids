import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ActivitiesGallery() {
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Lectura segura del usuario (evita pantalla blanca si localStorage falla)
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error("Error leyendo usuario:", e);
  }
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        console.error("Error al cargar actividades:", data);
        setActivities([]);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo");

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert("Actividad subida correctamente");
        setDescription('');
        setFile(null);
        fetchActivities();
      } else {
        alert("Error al subir");
      }
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  return (
    <div className="page-container" style={{ padding: '40px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#555' }}>⬅ Volver al Dashboard</Link>
          <h1 style={{ color: '#00695C' }}>📸 Galería Semanal</h1>
        </div>

        {/* FORMULARIO DE SUBIDA (SOLO ADMIN) */}
        {isAdmin && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
          <h3 style={{ marginTop: 0, color: '#00796B', textAlign: 'center' }}>Subir Nueva Actividad</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
              <input 
                type="text" 
                placeholder="Descripción (Ej: Clase de Arte)" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
              />
              <input 
                type="file" 
                accept="image/*,video/*"
                onChange={e => setFile(e.target.files[0])}
                style={{ padding: '10px' }}
              />
              <button type="submit" disabled={uploading} className="btn-animate" style={{ background: '#009688', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                {uploading ? 'Subiendo...' : 'Publicar'}
              </button>
            </form>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px', textAlign: 'center' }}>* El contenido se borrará automáticamente después de 7 días.</p>
          </div>
        )}

        {/* GRID DE GALERÍA */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {Array.isArray(activities) && activities.map((item, index) => (
            <div key={item.id} className="card-hover fade-in" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', animationDelay: `${index * 0.1}s` }}>
              {item.file_type === 'video' 
                ? <video src={item.file_url} controls style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                : <img src={item.file_url} alt={item.description} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              }
              <div style={{ padding: '15px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#444' }}>{item.description || 'Sin descripción'}</p>
                <small style={{ color: '#888' }}>{new Date(item.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>No hay actividades recientes.</p>}
      </div>
    </div>
  );
}

export default ActivitiesGallery;