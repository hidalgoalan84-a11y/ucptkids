import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  Save, 
  X, 
  ArrowLeft, 
  Loader2 
} from 'lucide-react';

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    edad: '',
    grupo_id: '',
    foto_perfil: ''
  });
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cargar los grupos disponibles para el selector
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Error cargando grupos", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Iniciamos carga

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Podríamos usar un Toast aquí en el futuro en lugar de alert
        alert('✅ Alumno agregado correctamente'); 
        navigate('/dashboard');
      } else {
        alert('❌ Error al agregar alumno');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setIsLoading(false); // Terminamos carga siempre
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-lg">
        
        {/* Botón de regreso discreto */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 font-medium text-sm pl-2"
        >
          <ArrowLeft className="w-4 h-4" /> Cancelar y volver
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          
          {/* Header del Formulario */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600 shadow-sm">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Alumno</h2>
            <p className="text-gray-500 text-sm mt-1">Completa la ficha de inscripción</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Campo: Nombre Completo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input 
                  type="text" 
                  name="nombre_completo" 
                  required 
                  onChange={handleChange} 
                  placeholder="Ej: Sofía Martínez" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Grid: Edad y Grupo (2 columnas) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Edad</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <input 
                    type="number" 
                    name="edad" 
                    required 
                    onChange={handleChange} 
                    placeholder="Ej: 4" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Grupo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <select 
                    name="grupo_id" 
                    onChange={handleChange} 
                    required 
                    defaultValue=""
                    className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer text-gray-700"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.nombre}</option>
                    ))}
                  </select>
                  {/* Flechita personalizada del select */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Campo: URL Foto */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">URL Foto (Opcional)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <input 
                  type="text" 
                  name="foto_perfil" 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Botones de Acción */}
            <div className="pt-6 flex gap-3">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Guardar Ficha
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;