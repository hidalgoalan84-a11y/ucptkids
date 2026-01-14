import { Link } from 'react-router-dom';
import { Instagram, FileText } from 'lucide-react'; // Usamos iconos bonitos de la librería que ya tienes

function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-gray-200 py-6 mt-auto overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        
        {/* Enlaces Sociales y Legales */}
        <div className="flex flex-wrap justify-center gap-6 items-center">
          
          {/* Botón Instagram */}
          <a 
            href="https://www.instagram.com/unacasaparatodostexcoco?igsh=d2s3Y3lnZm1ycWc4" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pink-600 font-bold hover:text-pink-700 transition-colors"
          >
            <Instagram size={20} />
            <span>Instagram</span>
          </a>

          {/* Botón Términos */}
          <Link 
            to="/terms" 
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            <FileText size={20} />
            <span>Términos y Condiciones</span>
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm mt-2">
          © 2025 UCPT Kids - Una Casa Para Todos
        </p>
      
      </div>
    </footer>
  );
}

export default Footer;