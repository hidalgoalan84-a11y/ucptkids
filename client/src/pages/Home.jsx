import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Smile, 
  CalendarClock, 
  Camera, 
  ShieldCheck 
} from 'lucide-react';

function Home() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-surface font-sans overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="max-w-7xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/img/logo.png" alt="UCPT Kids Logo" className="w-10 h-10 rounded-full shadow-sm" />
          <span className="text-xl font-bold text-gray-800 tracking-tight">UCPT <span className="text-primary-600">Kids</span></span>
        </div>
        
        {/* Botón funcional original mantenido */}
        <Link 
          to="/admin" 
          className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          Soy Profesor (Entrar) 🔐
        </Link>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Bienvenidos a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              UCPT Kids
            </span> 🎈
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
            El lugar más divertido para aprender.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Mantenemos el enlace principal funcional apuntando a /admin como en tu original */}
            <Link 
              to="/admin" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl"
            >
              Comenzar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Plataforma Segura</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Fácil de usar</span>
          </motion.div>
        </motion.div>

        {/* Columna Derecha: Imagen Mejorada */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80" 
            alt="Niños felices aprendiendo" 
            className="rounded-3xl shadow-2xl rotate-3 border-4 border-white w-full max-w-md mx-auto object-cover"
          />

          <div className="absolute bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce hover:animate-none">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold">Estado</p>
              <p className="text-gray-800 font-bold text-lg">Aprendiendo 🚀</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 3. FEATURES SECTION (Información visual extra, no funcional) */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={CalendarClock}
              color="bg-blue-100 text-blue-600"
              title="Gestión de Horarios"
              desc="Organiza las clases y actividades de manera eficiente."
            />
            <FeatureCard 
              icon={Camera}
              color="bg-pink-100 text-pink-600"
              title="Galería de Fotos"
              desc="Captura y comparte los mejores momentos del día."
            />
            <FeatureCard 
              icon={ShieldCheck}
              color="bg-orange-100 text-orange-600"
              title="Acceso Seguro"
              desc="Plataforma exclusiva para personal autorizado."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente auxiliar visual
function FeatureCard({ icon: Icon, color, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

export default Home;