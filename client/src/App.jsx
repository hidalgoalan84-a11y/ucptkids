import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Páginas Públicas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TermsPage from './pages/TermsPage';

// Páginas Privadas (Requieren Login)
import Dashboard from './pages/Dashboard';
import GroupPage from './pages/GroupPage';
import AddStudent from './pages/AddStudent';
import AdminPanel from './pages/AdminPanel';
import SchedulesPage from './pages/SchedulesPage';
import AttendanceTaker from './pages/AttendanceTaker';
import AdminAttendance from './pages/AdminAttendance';
import ActivitiesGallery from './pages/ActivitiesGallery';

// Componentes Globales
import Footer from './components/Footer';

// 🔒 COMPONENTE DE SEGURIDAD
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    // 📱 FIX CRÍTICO PARA MÓVILES: Inyectar meta viewport si falta o es incorrecto
    // Esto obliga al navegador a usar la escala 1:1 real y evita que se vea "lejos" o pequeño.
    let meta = document.querySelector("meta[name='viewport']");
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }, []);

  return (
    <Router>
      {/* 🚨 CORRECCIÓN FINAL DE PANTALLA:
          w-full: Ancho 100%
          max-w-[100vw]: Ancho máximo = ancho de la pantalla (viewport width)
          overflow-x-hidden: CORTA cualquier cosa que se salga.
      */}
      <div className="flex flex-col min-h-screen bg-surface w-full max-w-[100vw] overflow-x-hidden">
        
        <div className="flex-1 w-full">
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* --- RUTAS PRIVADAS (Protegidas) --- */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            
            <Route path="/group/:id" element={
              <ProtectedRoute><GroupPage /></ProtectedRoute>
            } />
            
            <Route path="/add-student" element={
              <ProtectedRoute><AddStudent /></ProtectedRoute>
            } />
            
            <Route path="/group/:groupId/attendance" element={
              <ProtectedRoute><AttendanceTaker /></ProtectedRoute>
            } />

            <Route path="/activities" element={
              <ProtectedRoute><ActivitiesGallery /></ProtectedRoute>
            } />

            <Route path="/schedules" element={
              <ProtectedRoute><SchedulesPage /></ProtectedRoute>
            } />

            {/* Rutas de Admin */}
            <Route path="/admin-panel" element={
              <ProtectedRoute><AdminPanel /></ProtectedRoute>
            } />
            
            <Route path="/admin/attendance" element={
              <ProtectedRoute><AdminAttendance /></ProtectedRoute>
            } />

            {/* Redirección 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;