import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LogIn, Users, Calendar, Image as ImageIcon, CheckSquare, Menu, X, LogOut } from 'lucide-react';

// --- COMPONENTE: RUTA PROTEGIDA ---
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// --- COMPONENTE: LAYOUT (LA SOLUCIÓN AL RESPONSIVE) ---
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const menuItems = [
    { icon: Users, label: 'Grupos', path: '/groups' },
    { icon: CheckSquare, label: 'Asistencia', path: '/attendance' },
    { icon: ImageIcon, label: 'Galería', path: '/gallery' },
    { icon: Calendar, label: 'Roles', path: '/schedules' },
  ];

  // Si es Admin, mostramos panel de usuarios
  if (user?.role === 'admin') {
    menuItems.push({ icon: Users, label: 'Usuarios', path: '/admin/users' });
  }

  return (
    <div className="flex min-h-screen bg-surface w-full overflow-hidden">
      {/* 1. SIDEBAR (Escritorio: Visible | Móvil: Oculto) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-primary-600">UCPT Kids</h1>
          <p className="text-sm text-gray-400">Panel Docente</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path 
                  ? 'bg-primary-50 text-primary-600 font-bold' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full">
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </aside>

      {/* 2. MENÚ MÓVIL (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-primary-600">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-50"
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 w-full mt-4">
                <LogOut size={20} />
                Salir
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="flex-1 md:ml-64 w-full flex flex-col min-h-screen">
        {/* Barra Superior Móvil */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center md:hidden sticky top-0 z-10">
          <h1 className="font-bold text-primary-600">UCPT Kids</h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        {/* El contenido de la página */}
        <div className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- PÁGINAS (Placeholders Simplificados para que compile) ---
// Puedes reemplazar estos contenidos con tus componentes reales si los tenías separados
const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría tu lógica real de fetch al backend
    if(formData.username === 'admin' && formData.password === 'admin') {
        localStorage.setItem('user', JSON.stringify({ username: 'Admin', role: 'admin' }));
        window.location.href = '/groups';
    } else {
        alert("Demo: Usa user: admin, pass: admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary-600 mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Usuario" 
            className="w-full p-3 border border-gray-200 rounded-xl"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border border-gray-200 rounded-xl"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-primary-600 text-white p-3 rounded-xl font-bold hover:bg-primary-700">Entrar</button>
        </form>
      </div>
    </div>
  );
};

const DashboardPlaceholder = ({ title }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">Contenido de demostración para {title}.</p>
    </div>
);

// --- APP PRINCIPAL ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas con el Layout Nuevo */}
        <Route path="/groups" element={<ProtectedRoute><Layout><DashboardPlaceholder title="Grupos" /></Layout></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Layout><DashboardPlaceholder title="Asistencia" /></Layout></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><Layout><DashboardPlaceholder title="Galería" /></Layout></ProtectedRoute>} />
        <Route path="/schedules" element={<ProtectedRoute><Layout><DashboardPlaceholder title="Roles" /></Layout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Layout><DashboardPlaceholder title="Admin Usuarios" /></Layout></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Routes>
    </Router>
  );
}

export default App;