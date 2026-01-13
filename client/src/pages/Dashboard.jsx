import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Settings, 
  Calendar, 
  Camera, 
  Users, 
  Clock, 
  ChevronRight,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Error cargando grupos:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Componente de Navegación (Link del menú)
  const NavItem = ({ to, icon: Icon, label, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
          ${isActive 
            ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden font-sans">
      
      {/* 1. SIDEBAR (Navegación Lateral) */}
      <aside className={`
        fixed z-40 lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-100 p-1">
               <img src="/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight">UCPT<br/><span className="text-primary-600">Kids</span></h1>
            </div>
            {/* Botón cerrar menú en móvil */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menú Principal */}
          <nav className="space-y-2 flex-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Inicio" />
            <NavItem to="/schedules" icon={Calendar} label="Roles del Mes" />
            <NavItem to="/activities" icon={Camera} label="Galería" />
            {user.role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-2">Administración</p>
                <NavItem to="/admin-panel" icon={Settings} label="Panel Admin" />
              </div>
            )}
          </nav>

          {/* Perfil Usuario (Bottom) */}
          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold text-lg">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role === 'teacher' ? 'Profesor' : user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para móvil cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto h-screen relative w-full">
        {/* Header Móvil */}
        <div className="lg:hidden bg-white p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img src="/img/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-gray-700">UCPT Kids</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 bg-gray-50 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          
          {/* Header de la Página */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-500 mt-1">Bienvenido de nuevo, selecciona un grupo para comenzar.</p>
          </motion.div>

          {/* Stats Rápidos (Ejemplo Estático) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Grupos Activos</p>
                <h3 className="text-2xl font-bold text-gray-800">{groups.length}</h3>
              </div>
            </div>
            {/* Puedes agregar más stats reales aquí si los tienes en el backend */}
          </div>

          {/* Grid de Grupos */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Mis Grupos</h2>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-gray-500">No hay grupos asignados todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/group/${group.id}`}
                    className="block bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
                  >
                    {/* Decoración de borde lateral de color aleatorio */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                      ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'][index % 4]
                    }`}></div>

                    <div className="flex justify-between items-start mb-4 pl-3">
                      <div className={`p-3 rounded-xl ${
                        ['bg-blue-50 text-blue-500', 'bg-green-50 text-green-500', 'bg-purple-50 text-purple-500', 'bg-pink-50 text-pink-500'][index % 4]
                      }`}>
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="bg-gray-100 p-2 rounded-full text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="pl-3">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{group.nombre}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{group.horario || 'Sin horario'}</span>
                      </div>
                      
                      {group.profesor && (
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {group.profesor.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-600">Prof. {group.profesor}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;