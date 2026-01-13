import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Server, 
  KeyRound, 
  Copyright, 
  FileCheck 
} from 'lucide-react';

function TermsPage() {
  return (
    <div className="min-h-screen bg-surface font-sans p-6 lg:p-12">
      
      {/* Botón de Regreso Superior */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Encabezado */}
        <div className="bg-primary-50 p-10 text-center border-b border-primary-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600 shadow-sm">
            <FileCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Términos y Condiciones</h1>
          <p className="text-gray-500">Reglamento de uso para la plataforma UCPT Kids</p>
        </div>

        {/* Contenido */}
        <div className="p-8 lg:p-12 space-y-10">

          {/* 1. Privacidad (DESTACADO) */}
          <section className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl text-red-600 shadow-sm shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-3">1. Privacidad de Menores</h3>
                <div className="text-red-700/90 leading-relaxed space-y-2">
                  <p>
                    La seguridad y privacidad de los niños es nuestra máxima prioridad. Queda <strong className="font-extrabold text-red-800 underline decoration-red-300">estrictamente prohibido</strong> descargar, capturar o compartir fotografías, videos o información personal de los menores alojados en esta plataforma en redes sociales personales (Facebook, Instagram, WhatsApp, etc.) o cualquier otro medio público.
                  </p>
                  <p className="text-sm font-semibold bg-red-100/50 p-3 rounded-lg border border-red-200 inline-block">
                    ⚠️ El incumplimiento de esta norma conllevará la suspensión inmediata de la cuenta y las acciones legales pertinentes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Uso del Sistema */}
          <section className="flex gap-5 md:gap-8">
            <div className="hidden md:flex p-3 bg-blue-50 rounded-2xl text-blue-600 shrink-0 h-fit">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="md:hidden text-blue-600"><Server className="w-5 h-5"/></span>
                2. Uso del Sistema
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Esta plataforma es una herramienta de gestión escolar interna exclusiva para el personal autorizado de "UCPT Kids". Su uso está limitado a actividades relacionadas con la administración académica, seguimiento de alumnos y comunicación institucional. Cualquier uso indebido o con fines ajenos a la institución está prohibido.
              </p>
            </div>
          </section>

          {/* 3. Responsabilidad de Acceso */}
          <section className="flex gap-5 md:gap-8">
            <div className="hidden md:flex p-3 bg-purple-50 rounded-2xl text-purple-600 shrink-0 h-fit">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="md:hidden text-purple-600"><KeyRound className="w-5 h-5"/></span>
                3. Responsabilidad de Acceso
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Los profesores y administradores son responsables de mantener la confidencialidad de sus credenciales de acceso (usuario y contraseña). No deben compartir sus cuentas con terceros. Cualquier actividad realizada desde su cuenta será responsabilidad del titular de la misma.
              </p>
            </div>
          </section>

          {/* 4. Propiedad Intelectual */}
          <section className="flex gap-5 md:gap-8">
            <div className="hidden md:flex p-3 bg-orange-50 rounded-2xl text-orange-600 shrink-0 h-fit">
              <Copyright className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="md:hidden text-orange-600"><Copyright className="w-5 h-5"/></span>
                4. Propiedad Intelectual
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Todo el software, diseño, logotipos y contenido de esta aplicación son propiedad intelectual del proyecto <strong>"Una Casa Para Todos"</strong>. Está prohibida su reproducción total o parcial sin autorización previa.
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-gray-400 text-xs">
            Al acceder a la plataforma UCPT Kids, aceptas cumplir con estos lineamientos de forma obligatoria.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;