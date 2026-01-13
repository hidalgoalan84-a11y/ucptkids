import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ShieldCheck, ArrowRight, Loader2, BookOpen } from 'lucide-react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica en cliente
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'teacher' }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface font-sans">
      
      {/* SECCIÓN IZQUIERDA: Banner Visual (Oculto en móvil, visible en Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center text-white p-12">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-accent-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary-400 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Comienza a gestionar tu aula hoy.</h1>
            <p className="text-primary-100 text-lg leading-relaxed">
              Únete a UCPT Kids y lleva el control de asistencia, actividades y reportes de la manera más sencilla y profesional.
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario (Visible siempre) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl lg:shadow-none border border-gray-100 lg:border-none"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
            <p className="text-gray-500">Ingresa tus datos para registrarte como profesor</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100"
            >
              <span className="font-bold">Error:</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Usuario */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Ej. proferoberto"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Input Confirmar Contraseña */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Confirmar Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Registrando...
                </>
              ) : (
                <>
                  Crear Cuenta <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer del Form */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors">
                Inicia Sesión aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;