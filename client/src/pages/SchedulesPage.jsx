import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CalendarDays, 
  FileText, 
  Download, 
  Trash2, 
  UploadCloud, 
  File, 
  Image as ImageIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';

function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
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

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert("✅ Rol publicado correctamente");
        setTitle('');
        setFile(null);
        document.getElementById('scheduleInput').value = ""; // Limpiar input
        fetchSchedules();
      } else {
        alert("Error al subir");
      }
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar este rol mensual permanentemente?")) return;
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchedules(schedules.filter(s => s.id !== id)); // Optimistic UI
      }
    } catch (err) { console.error(err); }
  };

  const isImage = (url) => url.match(/\.(jpeg|jpg|gif|png)$/i);

  return (
    <div className="min-h-screen bg-surface font-sans p-6 lg:p-10">
      
      {/* 1. HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-4 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-orange-100 p-2 rounded-xl text-orange-600">
                <CalendarDays className="w-8 h-8" />
              </span>
              Roles y Actividades
            </h1>
            <p className="text-gray-500 ml-1 mt-1">Consulta los cronogramas y avisos mensuales.</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. ÁREA DE SUBIDA (Columna Izquierda o Superior en móvil) */}
        {isAdmin && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary-500" />
                Publicar Nuevo Rol
              </h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Menú de Marzo" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                  />
                </div>
                
                <div className="relative group">
                  <input 
                    id="scheduleInput"
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${file ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 group-hover:border-primary-400'}`}>
                    {file ? (
                      <>
                        <FileText className="w-8 h-8 text-primary-600 mb-2" />
                        <span className="text-sm font-medium text-primary-700 text-center break-all">{file.name}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-primary-500 transition-colors" />
                        <span className="text-sm text-gray-500 font-medium">Click para elegir archivo</span>
                        <span className="text-xs text-gray-400 mt-1">PDF o Imágenes</span>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                >
                  {uploading ? 'Subiendo...' : 'Publicar Documento'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. LISTA DE DOCUMENTOS (Columna Derecha) */}
        <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
          {schedules.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-gray-500">No hay documentos publicados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((item, index) => {
                const isImg = isImage(item.file_url);
                const date = new Date(item.created_at);
                
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow relative group"
                  >
                    {/* Fecha Lateral */}
                    <div className="hidden sm:flex flex-col items-center justify-center bg-gray-50 rounded-xl w-20 h-20 shrink-0 text-gray-500 border border-gray-100">
                      <span className="text-xs font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-2xl font-bold text-gray-800">{date.getDate()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-400 mb-4 sm:hidden">
                            {date.toLocaleDateString()}
                          </p>
                        </div>
                        
                        {/* Botón Borrar (Admin) */}
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Eliminar documento"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Contenido (Preview) */}
                      {isImg ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-64 sm:max-h-80 group/img">
                          <img 
                            src={item.file_url} 
                            alt={item.title} 
                            className="w-full h-full object-contain mx-auto"
                          />
                          <a 
                            href={item.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                          >
                            <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" /> Ver Pantalla Completa
                            </span>
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
                          <File className="w-8 h-8 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">Documento PDF</p>
                            <p className="text-xs opacity-70">Click para visualizar o descargar</p>
                          </div>
                          <a 
                            href={item.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors shadow-sm"
                          >
                            Abrir
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SchedulesPage;