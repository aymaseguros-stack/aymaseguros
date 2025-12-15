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

// Logo Trustpilot SVG inline
function TrustpilotLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 126 31" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.3 10.7h-8.1v2.3h2.9v8.8h2.4v-8.8h2.9v-2.3zM36.6 14.3c-.5 0-.9.1-1.3.3-.4.2-.6.5-.8.9v-1.1h-2.2v7.5h2.3v-3.8c0-.6.1-1.1.4-1.4.3-.3.6-.5 1.1-.5.2 0 .4 0 .6.1l.3-2.1c-.2 0-.3-.1-.4 0zM44.1 14.4h-2.2v5.8c0 .4-.1.7-.3.9-.2.2-.5.3-.8.3-.3 0-.6-.1-.8-.3-.2-.2-.3-.5-.3-.9v-5.8h-2.3v6.2c0 .8.3 1.4.8 1.9.5.5 1.2.7 2 .7.5 0 .9-.1 1.3-.3.4-.2.7-.5.9-.8v1h2.2v-7.5h-.5zM51.4 15c-.4-.3-.8-.5-1.3-.7-.5-.2-1-.2-1.5-.2-.6 0-1.2.1-1.7.3-.5.2-1 .5-1.4.9-.4.4-.7.8-.9 1.3-.2.5-.3 1.1-.3 1.7s.1 1.2.3 1.7c.2.5.5.9.9 1.3.4.4.8.7 1.4.9.5.2 1.1.3 1.7.3.9 0 1.7-.2 2.3-.6.6-.4 1.1-.9 1.4-1.5l-2-.8c-.1.3-.3.5-.6.7-.3.2-.6.3-.9.3-.5 0-.9-.2-1.2-.5-.3-.3-.5-.7-.5-1.3h5.4v-.6c0-.6-.1-1.1-.3-1.6-.2-.5-.4-.9-.8-1.2zm-4.2 1.9c.1-.4.2-.8.5-1 .3-.3.6-.4 1.1-.4.4 0 .8.1 1 .4.3.3.4.6.5 1h-3.1zM57.3 17.8c0 .4-.1.7-.3.9-.2.2-.5.3-.9.3-.2 0-.5-.1-.6-.2-.2-.1-.2-.3-.2-.6 0-.2.1-.4.2-.5.2-.1.4-.2.6-.3l1.2-.3v.7zm2.2 1.5v-4.5c0-.8-.3-1.4-.9-1.9-.6-.5-1.4-.7-2.4-.7-1.6 0-2.7.6-3.2 1.9l2 .6c.1-.3.3-.5.5-.6.2-.1.5-.2.8-.2.4 0 .7.1.9.3.2.2.3.4.3.7v.2l-1.8.4c-.8.2-1.4.4-1.9.8-.5.4-.7.9-.7 1.6 0 .6.2 1.1.6 1.5.4.4 1 .6 1.8.6.4 0 .9-.1 1.2-.2.4-.2.7-.4.9-.7 0 .2.1.4.1.6h2.2c-.2-.5-.3-1-.3-1.7l-.1.3zM67.6 14.4h-2.2v5.8c0 .4-.1.7-.3.9-.2.2-.5.3-.8.3-.3 0-.6-.1-.8-.3-.2-.2-.3-.5-.3-.9v-5.8h-2.3v6.2c0 .8.3 1.4.8 1.9.5.5 1.2.7 2 .7.5 0 .9-.1 1.3-.3.4-.2.7-.5.9-.8v1h2.2v-7.5l-.5-.2zM72.9 10.7h-2.3v11.2h2.3V10.7zM80.8 15c-.4-.3-.8-.5-1.3-.7-.5-.2-1-.2-1.5-.2-.6 0-1.2.1-1.7.3-.5.2-1 .5-1.4.9-.4.4-.7.8-.9 1.3-.2.5-.3 1.1-.3 1.7s.1 1.2.3 1.7c.2.5.5.9.9 1.3.4.4.8.7 1.4.9.5.2 1.1.3 1.7.3.9 0 1.7-.2 2.3-.6.6-.4 1.1-.9 1.4-1.5l-2-.8c-.1.3-.3.5-.6.7-.3.2-.6.3-.9.3-.5 0-.9-.2-1.2-.5-.3-.3-.5-.7-.5-1.3h5.4v-.6c0-.6-.1-1.1-.3-1.6-.2-.5-.4-.9-.8-1.2zm-4.2 1.9c.1-.4.2-.8.5-1 .3-.3.6-.4 1.1-.4.4 0 .8.1 1 .4.3.3.4.6.5 1h-3.1zM88.8 15c-.4-.3-.8-.5-1.3-.7-.5-.2-1-.2-1.5-.2-.6 0-1.2.1-1.7.3-.5.2-1 .5-1.4.9-.4.4-.7.8-.9 1.3-.2.5-.3 1.1-.3 1.7s.1 1.2.3 1.7c.2.5.5.9.9 1.3.4.4.8.7 1.4.9.5.2 1.1.3 1.7.3.5 0 .9-.1 1.3-.2.4-.1.8-.3 1.1-.6v.7c0 .5-.2.9-.5 1.2-.3.3-.8.4-1.3.4-.4 0-.7-.1-1-.2-.3-.2-.5-.4-.6-.7l-2.1.7c.2.6.6 1.1 1.2 1.5.6.4 1.4.6 2.4.6.7 0 1.3-.1 1.9-.3.5-.2 1-.5 1.3-.8.4-.3.6-.7.8-1.2.2-.5.3-1 .3-1.5v-7.3h-2.2v.8c-.1-.1-.3-.2-.7-.4zm-.3 4c-.2.2-.4.4-.6.5-.3.1-.5.2-.8.2s-.6-.1-.8-.2c-.3-.1-.5-.3-.6-.5-.2-.2-.3-.5-.4-.8-.1-.3-.1-.6-.1-.9 0-.3 0-.6.1-.9.1-.3.2-.6.4-.8.2-.2.4-.4.6-.5.3-.1.5-.2.8-.2s.6.1.8.2c.3.1.5.3.6.5.2.2.3.5.4.8.1.3.1.6.1.9 0 .3 0 .6-.1.9-.1.3-.2.5-.4.8z"/>
      <path fill="#00B67A" d="M12 0l3.7 7.6 8.3 1.2-6 5.9 1.4 8.3L12 19l-7.4 3.9 1.4-8.3-6-5.9 8.3-1.2z"/>
      <path fill="#005128" d="M17.1 17.6l-.7-2.1-4.4 3.2z"/>
    </svg>
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
              <TrustpilotLogo className="h-5 w-auto" />
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
