// LogosAseguradoras.jsx - Carrusel infinito de logos
// AYMA Advisors - 14-Dic-2025

const logos = [
  { nombre: 'San Cristóbal', archivo: '/logos/san-cristobal.webp', escala: 2 },
  { nombre: 'Mapfre', archivo: '/logos/mapfre.svg', escala: 1.5 },
  { nombre: 'Asociart ART', archivo: '/logos/asociart_logo.webp', escala: 2.4 },
  { nombre: 'Experta ART', archivo: '/logos/experta_art_logo.png', escala: 1 },
  { nombre: 'Galeno ART', archivo: '/logos/galeno_art_logo.svg', escala: 1 },
  { nombre: 'Galeno Seguros', archivo: '/logos/Galeno_seguros_logo.svg', escala: 1 },
  { nombre: 'Omint', archivo: '/logos/omint_seguros_logo.png', escala: 1 },
  { nombre: 'Provincia ART', archivo: '/logos/ProvinciaArt_Logo.svg', escala: 1 },
  { nombre: 'Experta Seguros', archivo: '/logos/experta-seguros-logo.png', escala: 1 },
  { nombre: 'Serena ART', archivo: '/logos/serena-art-logo.webp', escala: 2 },
];

export default function LogosAseguradoras() {
  const logosDobles = [...logos, ...logos];

  return (
    <section className="py-6 bg-white overflow-hidden">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex items-center animate-marquee hover:[animation-play-state:paused]">
          {logosDobles.map((logo, index) => (
            <div
              key={`${logo.nombre}-${index}`}
              className="flex-shrink-0 mx-10 flex items-center justify-center"
              style={{ minWidth: '140px', height: '60px' }}
            >
              <img
                src={logo.archivo}
                alt={logo.nombre}
                title={logo.nombre}
                className="w-auto object-contain opacity-60 grayscale hover:opacity-80 transition-opacity"
                style={{ 
                  maxHeight: `${36 * logo.escala}px`,
                  maxWidth: `${120 * logo.escala}px`
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          width: fit-content;
        }
      `}</style>
    </section>
  );
}
