import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Loader2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AttendanceTaker() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fecha actual formateada bonita
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  useEffect(() => {
    // Cargar alumnos del grupo
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        // Parseamos groupId a int por seguridad
        const groupStudents = data.filter(s => s.grupo_id === parseInt(groupId));
        setStudents(groupStudents);
        
        // Inicializar todos como "presente" (true) por defecto
        const initialStatus = {};
        groupStudents.forEach(s => initialStatus[s.id] = true);
        setAttendance(initialStatus);
      })
      .catch(err => console.error(err));
  }, [groupId]);

  const toggleAttendance = (studentId) => {
    // Vibración suave en móviles si el navegador lo soporta (Haptic Feedback)
    if (navigator.vibrate) navigator.vibrate(50);

    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const records = Object.keys(attendance).map(studentId => ({
      studentId: parseInt(studentId),
      status: attendance[studentId] ? 'present' : 'absent'
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, records })
      });
      
      if (res.ok) {
        // Pequeño delay para que el usuario vea que terminó
        setTimeout(() => {
            alert("✅ Asistencia guardada correctamente");
            navigate(`/group/${groupId}`);
        }, 500);
      } else {
        alert("Error al guardar asistencia");
        setIsSubmitting(false);
      }
    } catch (err) { 
        console.error(err);
        setIsSubmitting(false);
    }
  };

  // Calcular presentes para el resumen
  const presentCount = Object.values(attendance).filter(status => status).length;

  return (
    <div className="min-h-screen bg-surface font-sans pb-24"> {/* Padding bottom para el botón flotante */}
      
      {/* 1. HEADER FIJO */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <button 
                onClick={() => navigate(`/group/${groupId}`)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Pasar Lista</h1>
            <div className="w-6"></div> {/* Espaciador para centrar título */}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span className="capitalize">{today}</span>
          </div>
        </div>
      </div>

      {/* 2. LISTA DE ALUMNOS (Cards Interactivas) */}
      <div className="max-w-3xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {students.map(student => {
          const isPresent = attendance[student.id];
          
          return (
            <motion.div 
              key={student.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleAttendance(student.id)}
              className={`
                relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex items-center gap-4 select-none
                ${isPresent 
                  ? 'bg-white border-green-400 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 opacity-80'
                }
              `}
            >
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={student.foto_perfil || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${student.nombre_completo}`} 
                  alt={student.nombre_completo}
                  className={`w-14 h-14 rounded-full object-cover transition-all ${!isPresent && 'grayscale'}`}
                />
                {/* Indicador de estado sobre el avatar */}
                <div className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white ${isPresent ? 'bg-green-500' : 'bg-red-400'}`}>
                    {isPresent ? <CheckCircle2 className="w-3 h-3 text-white" /> : <XCircle className="w-3 h-3 text-white" />}
                </div>
              </div>

              {/* Info Alumno */}
              <div className="flex-1">
                <h3 className={`font-bold text-lg leading-tight ${isPresent ? 'text-gray-800' : 'text-gray-500 line-through'}`}>
                  {student.nombre_completo}
                </h3>
                <p className={`text-xs font-bold mt-1 ${isPresent ? 'text-green-600' : 'text-red-500'}`}>
                  {isPresent ? 'PRESENTE' : 'AUSENTE'}
                </p>
              </div>

              {/* Check visual grande a la derecha */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                ${isPresent ? 'bg-green-100 border-green-500 text-green-600' : 'border-gray-300 text-gray-300'}
              `}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. BARRA DE ACCIÓN FLOTANTE (Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          
          {/* Resumen */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="font-bold text-gray-700">
              {presentCount} / {students.length} <span className="text-gray-400 font-normal">Presentes</span>
            </span>
          </div>

          <button 
            onClick={() => navigate(`/group/${groupId}`)}
            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70"
          >
            {isSubmitting ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Guardando...
                </>
            ) : (
                <>
                    <Save className="w-5 h-5" /> Guardar Asistencia ({presentCount})
                </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

export default AttendanceTaker;