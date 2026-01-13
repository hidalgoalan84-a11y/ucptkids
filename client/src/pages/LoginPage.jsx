import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, ArrowLeft, Loader2 } from 'lucide-react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulamos un pequeño delay para que se vea la animación de carga (opcional, puedes quitarlo)
      // await new Promise(resolve => setTimeout(resolve, 800)); 

      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el usuario y su ROL en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface font-sans">
      
      {/* SECCIÓN IZQUIERDA: Banner Visual (Decorativo) */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent-500 relative overflow-hidden items-center justify-center p-12">
        {/* Fondo con imagen y superposición */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-multiply"></div>
        
        {/* Círculos decorativos animados */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-40"
        />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-400 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 max-w-md text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4">¡Hola de nuevo! 👋</h1>
            <p className="text-lg text-white/90">
              Nos alegra verte. Accede al panel para gestionar las actividades y reportes del día.
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        
        {/* Botón flotante para volver (Mobile friendly) */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img 
              src="/img/logo.png" 
              alt="UCPT Kids Logo" 
              className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg object-cover"
            />
            <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2">Ingresa tus credenciales de acceso</p>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100"
            >
              <div className="w-1 h-8 bg-red-500 rounded-full mr-2"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all text-gray-800"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Verificando...
                </>
              ) : (
                <>
                  Entrar al Sistema <LogIn className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              ¿Eres nuevo aquí?{' '}
              <Link to="/register" className="text-accent-500 font-bold hover:text-accent-600 hover:underline transition-colors">
                Regístrate como profesor
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;