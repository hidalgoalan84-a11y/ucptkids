import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Importamos los estilos globales de formularios
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GroupPage from './pages/GroupPage';
import AddStudent from './pages/AddStudent';
import AdminPanel from './pages/AdminPanel';
import SchedulesPage from './pages/SchedulesPage';
import TermsPage from './pages/TermsPage';
import Footer from './components/Footer';
import AttendanceTaker from './pages/AttendanceTaker';
import AdminAttendance from './pages/AdminAttendance';
import ActivitiesGallery from './pages/ActivitiesGallery';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Nueva Landing Page como inicio */}
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/group/:id" element={<GroupPage />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/group/:groupId/attendance" element={<AttendanceTaker />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/activities" element={<ActivitiesGallery />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
