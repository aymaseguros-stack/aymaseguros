// ============================================================================
// DATOS DE TESTIMONIOS
// ============================================================================
const TESTIMONIOS = [
  {
    id: 1,
    nombre: 'María González',
    ubicacion: 'Rosario',
    rating: 5,
    fecha: '2024-11-15',
    texto: 'Después de años con aseguradoras impersonales, encontrar AYMA fue un cambio total. Me explicaron cada detalle y optimizaron mi cobertura.',
    producto: 'Auto + Hogar',
    verificado: true
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    ubicacion: 'Funes',
    rating: 5,
    fecha: '2024-10-28',
    texto: 'Tuve un accidente y estaba preocupado. AYMA se encargó de todo con la aseguradora. En menos de una semana tenía todo resuelto.',
    producto: 'Seguro Auto',
    verificado: true
  },
  {
    id: 3,
    nombre: 'Roberto Fernández',
    ubicacion: 'Pérez',
    rating: 5,
    fecha: '2024-09-22',
    texto: 'Contraté ART y RC para mi taller. El asesoramiento fue muy completo, me explicaron todos los requisitos legales.',
    producto: 'ART + RC',
    verificado: true
  }
];

// ============================================================================
// COMPONENTES
// ============================================================================
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[#00B67A]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonio }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
            {testimonio.nombre.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-900 text-sm">{testimonio.nombre}</span>
              {testimonio.verificado && (
                <svg className="w-3.5 h-3.5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-500">{testimonio.ubicacion}</span>
          </div>
        </div>
        <StarRating rating={testimonio.rating} />
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{testimonio.texto}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {new Date(testimonio.fecha).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}
        </span>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {testimonio.producto}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function TrustpilotSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header con Trustpilot */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl font-bold text-gray-900">4.9</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Trustpilot branding - CLICKEABLE */}
          <a 
            href="https://www.trustpilot.com/review/aymaseguros.com.ar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="text-sm">Excelente en</span>
            <img 
              src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" 
              alt="Trustpilot" 
              className="h-5"
            />
          </a>
          
          <p className="text-gray-500 text-sm mt-2">
            Más de 400 reseñas verificadas · 17 años de experiencia
          </p>
        </div>

        {/* Testimonios Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIOS.map((testimonio) => (
            <TestimonialCard key={testimonio.id} testimonio={testimonio} />
          ))}
        </div>

      </div>
    </section>
  );
}
