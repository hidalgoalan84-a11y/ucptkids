import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
// Si no hay usuario en localStorage, redirige al Login.
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      {/* Contenedor principal con Tailwind: Altura mínima 100vh para que el footer baje */}
      <div className="flex flex-col min-h-screen bg-surface">
        
        {/* El contenido crece para llenar el espacio (flex-1) */}
        <div className="flex-1">
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

            {/* Redirección para rutas desconocidas (404) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer siempre al final */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;