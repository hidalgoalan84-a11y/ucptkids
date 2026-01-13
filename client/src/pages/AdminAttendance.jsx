import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CalendarDays, 
  Users, 
  User, 
  CheckCircle2, 
  XCircle, 
  ShieldBan,
  FileBarChart2 
} from 'lucide-react';

function AdminAttendance() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') return;
    
    fetch('/api/attendance/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Error cargando historial:", err));
  }, []);

  // Vista de Acceso Denegado Profesional
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <ShieldBan className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-500 mb-8">
            No tienes los permisos necesarios para ver esta página. Contacta al administrador si crees que es un error.
          </p>
          <Link to="/dashboard" className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans p-6 lg:p-10">
      
      {/* 1. HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link 
          to="/admin-panel" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-4 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Panel
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-purple-100 p-2 rounded-xl text-purple-600">
                <FileBarChart2 className="w-8 h-8" />
              </span>
              Historial de Asistencia
            </h1>
            <p className="text-gray-500 ml-1 mt-1">Registro completo de entradas y faltas.</p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sistema Actualizado
          </div>
        </div>
      </div>

      {/* 2. TABLA DE DATOS */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Filtros o Cabecera de tabla (Visual) */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Registros Recientes</h3>
          <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
            {history.length} Registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Grupo</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Alumno</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
                      <p>No hay registros de asistencia disponibles.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  const isPresent = record.status === 'present';
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                      
                      {/* Fecha con icono */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 text-gray-700 font-medium">
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-white group-hover:text-primary-500 transition-colors">
                            <CalendarDays className="w-4 h-4" />
                          </div>
                          {new Date(record.date).toLocaleDateString('es-ES', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </div>
                      </td>

                      {/* Grupo */}
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-300" />
                          {record.group_name}
                        </div>
                      </td>

                      {/* Alumno */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 font-medium text-gray-800">
                          <User className="w-4 h-4 text-primary-300" />
                          {record.student_name}
                        </div>
                      </td>

                      {/* Estado (Badge) */}
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isPresent 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Presente
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Ausente
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer simple de la tabla */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Mostrando últimos movimientos</p>
        </div>

      </div>
    </div>
  );
}

export default AdminAttendance;