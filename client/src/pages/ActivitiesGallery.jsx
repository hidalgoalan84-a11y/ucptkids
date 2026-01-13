import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Clock, 
  Camera 
} from 'lucide-react';
import { motion } from 'framer-motion';

function ActivitiesGallery() {
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Lectura segura del usuario
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error("Error leyendo usuario:", e);
  }
  
  // Permitimos subir fotos a admins y profesores
  const canUpload = user.role === 'admin' || user.role === 'teacher';

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
        setDescription('');
        setFile(null);
        // Resetear input file visualmente es un truco, aquí simplificamos
        document.getElementById('fileInput').value = ""; 
        fetchActivities();
      } else {
        alert("Error al subir");
      }
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar esta actividad permanentemente?")) return;
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActivities(activities.filter(a => a.id !== id)); // Actualización optimista
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-surface font-sans p-6 lg:p-10">
      
      {/* 1. HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-2 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="bg-pink-100 p-2 rounded-xl text-pink-600">
              <Camera className="w-8 h-8" />
            </span>
            Galería de Momentos
          </h1>
          <p className="text-gray-500 ml-1 mt-1">
            Los recuerdos se borran automáticamente cada 7 días para tu privacidad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* 2. ÁREA DE SUBIDA (Solo Staff) */}
        {canUpload && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary-500" />
              Compartir Nuevo Momento
            </h3>
            
            <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="¿Qué están haciendo hoy? (Ej: Clase de pintura)" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full h-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
              
              <div className="relative">
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*,video/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed rounded-xl transition-colors h-full ${file ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-600'}`}>
                  {file ? (
                    <span className="font-bold truncate max-w-[200px]">{file.name}</span>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5" /> <span>Elegir Foto/Video</span>
                    </>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={uploading || !file}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 whitespace-nowrap"
              >
                {uploading ? 'Subiendo...' : 'Publicar Ahora'}
              </button>
            </form>
          </motion.div>
        )}

        {/* 3. GRID DE GALERÍA (Masonry Style) */}
        {activities.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Aún no hay fotos</h3>
            <p className="text-gray-500 mt-2">¡Sé el primero en capturar un momento mágico!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activities.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-72"
              >
                {/* Contenido Multimedia */}
                {item.file_type === 'video' ? (
                  <div className="w-full h-full relative bg-black">
                    <video src={item.file_url} controls className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full pointer-events-none">
                      <Video className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.file_url} 
                    alt={item.description} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                )}

                {/* Overlay de información (Siempre visible en móvil, hover en desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-lg leading-tight mb-1">
                    {item.description || 'Momento UCPT'}
                  </p>
                  <div className="flex justify-between items-center text-white/80 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    
                    {/* Botón Borrar (Solo Admin/Staff) */}
                    {canUpload && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="bg-white/20 hover:bg-red-500 hover:text-white p-2 rounded-full backdrop-blur-sm transition-colors text-white"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivitiesGallery;