import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Users, ArrowRight, GraduationCap, Baby } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const handleParentLogin = () => {
    localStorage.setItem('user', JSON.stringify({ username: 'Padre de Familia', role: 'parent' }));
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden w-full max-w-[100vw] font-sans">
      
      {/* FONDOS (Blobs): Ahora son seguros para móvil */}
      <div className="absolute -top-24 -right-24 md:-top-[20%] md:-right-[10%] w-64 h-64 md:w-[600px] md:h-[600px] bg-primary-100 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 md:-bottom-[20%] md:-left-[10%] w-64 h-64 md:w-[500px] md:h-[500px] bg-accent-100 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-4xl relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8 md:mb-12 mt-4">
          <motion.div variants={itemVariants} className="inline-block p-1 bg-white rounded-full shadow-xl mb-6">
            <img src="/img/logo.png" alt="UCPT Kids" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
            Bienvenido a <span className="text-primary-600">UCPT Kids</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto">
            La plataforma de gestión escolar más divertida y segura.
          </motion.p>
        </div>

        {/* GRID */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 pb-8">
          
          {/* PROFESORES */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-primary-900/5 border border-gray-100 flex flex-col items-center text-center hover:border-primary-200 transition-colors">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 md:mb-6">
              <GraduationCap className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Soy Profesor</h3>
            <p className="text-gray-500 mb-6 md:mb-8 text-sm">Accede al panel administrativo.</p>
            <div className="w-full space-y-3">
              <Link to="/login" className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95 text-sm md:text-base">
                <LogIn className="w-5 h-5" /> Iniciar Sesión
              </Link>
              <Link to="/register" className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 hover:border-primary-200 hover:text-primary-600 py-3 rounded-xl font-bold transition-colors text-sm md:text-base">
                <UserPlus className="w-5 h-5" /> Crear Cuenta
              </Link>
            </div>
          </div>

          {/* PADRES */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-accent-900/5 border border-gray-100 flex flex-col items-center text-center hover:border-accent-200 transition-colors relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full">Acceso Rápido</div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-500 mb-4 md:mb-6">
              <Baby className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Soy Familia</h3>
            <p className="text-gray-500 mb-6 md:mb-8 text-sm">Consulta actividades y avisos.</p>
            <div className="w-full mt-auto">
              <button onClick={handleParentLogin} className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-accent-500/20 text-sm md:text-base">
                <Users className="w-5 h-5" /> Entrar
              </button>
            </div>
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.div variants={itemVariants} className="mt-4 md:mt-12 text-center pb-6">
          <p className="text-gray-400 text-xs md:text-sm">© 2024 UCPT Kids.</p>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default LandingPage;