import { useState } from 'react';

// ============================================================================
// DATOS DE TESTIMONIOS
// ============================================================================
const TESTIMONIOS = [
  {
    id: 1,
    nombre: 'Valentina Kirschbaum',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Encontrar AYMA fue un cambio total. Me explicaron cada detalle y optimizaron mi cobertura.',
    producto: 'Auto + Hogar',
  },
  {
    id: 2,
    nombre: 'Martín Ostrowski',
    ubicacion: 'Funes',
    rating: 5,
    texto: 'Tuve un accidente y AYMA se encargó de todo. En menos de una semana tenía todo resuelto.',
    producto: 'Seguro Auto',
  },
  {
    id: 3,
    nombre: 'Luciano Bettanin',
    ubicacion: 'Pérez',
    rating: 5,
    texto: 'Contraté ART y RC para mi taller. El asesoramiento fue muy completo.',
    producto: 'ART + RC',
  },
  {
    id: 4,
    nombre: 'Agustina Wernicke',
    ubicacion: 'Fisherton',
    rating: 5,
    texto: 'Excelente atención. Me ayudaron a encontrar el mejor seguro para mi comercio.',
    producto: 'Integral Comercio',
  },
  {
    id: 5,
    nombre: 'Federico Stransky',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Llevamos 5 años con AYMA para toda la flota. Siempre responden rápido.',
    producto: 'Flota + ART',
  },
  {
    id: 6,
    nombre: 'Carolina Zuberbühler',
    ubicacion: 'Roldán',
    rating: 5,
    texto: 'Me ahorraron un 35% en el seguro del auto sin perder cobertura.',
    producto: 'Seguro Auto',
  },
  {
    id: 7,
    nombre: 'Gonzalo Leibovich',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Cuando tuve el siniestro en casa, me acompañaron en todo el proceso.',
    producto: 'Hogar',
  },
  {
    id: 8,
    nombre: 'Sofía Kratochvil',
    ubicacion: 'Funes',
    rating: 5,
    texto: 'Profesionales de verdad. Te asesoran para que elijas lo mejor para vos.',
    producto: 'Vida + Hogar',
  },
  {
    id: 9,
    nombre: 'Nicolás Echeverría',
    ubicacion: 'Rosario',
    rating: 5,
    texto: 'Rápidos, eficientes y siempre disponibles. La mejor experiencia.',
    producto: 'Auto',
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
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-[#00B67A]' : 'text-gray-300'}`}
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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
          {testimonio.nombre.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-900 text-sm truncate">{testimonio.nombre}</span>
            <svg className="w-3.5 h-3.5 text-[#00B67A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{testimonio.ubicacion}</span>
            <StarRating rating={testimonio.rating} />
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed flex-1">{testimonio.texto}</p>
      
      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full self-start mt-2">
        {testimonio.producto}
      </span>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function TrustpilotSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = TESTIMONIOS.length - itemsPerView;

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    if (window.gtag) {
      window.gtag('event', 'testimonial_arrow_click', {
        direction: 'prev',
        current_index: currentIndex
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    if (window.gtag) {
      window.gtag('event', 'testimonial_arrow_click', {
        direction: 'next',
        current_index: currentIndex
      });
    }
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header compacto */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">4.9</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <a 
              href="https://www.trustpilot.com/review/aymaseguros.com.ar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-sm">+400 reseñas en</span>
              <img 
                src="/logos/trustpilot-logo.svg" 
                alt="Trustpilot" 
                className="h-5"
              />
            </a>
          </div>

          {/* Flechas de navegación */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Siguiente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carrusel */}
        <div className="overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView + 1.33)}%)` }}
          >
            {TESTIMONIOS.map((testimonio) => (
              <div 
                key={testimonio.id} 
                className="flex-shrink-0"
                style={{ width: `calc((100% - 2rem) / 3)` }}
              >
                <TestimonialCard testimonio={testimonio} />
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                if (window.gtag) {
                  window.gtag('event', 'testimonial_dot_click', { index: idx });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
