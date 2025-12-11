// ==========================================
// SECCIÓN: ¿POR QUÉ ELEGIR AYMA ADVISORS?
// ==========================================

export const WhyChooseUs = () => {
  const reasons = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Comparamos por vos',
      description: 'Analizamos todas las opciones para encontrar la mejor relación precio-cobertura'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '17 años de experiencia',
      description: 'Trayectoria comprobada en el mercado asegurador'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Asesoramiento personalizado',
      description: 'Te acompañamos desde la cotización hasta el siniestro'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          ¿Por qué elegir Ayma Advisors?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECCIÓN: NUESTROS SERVICIOS
// ==========================================

export const Services = () => {
  const services = [
    {
      icon: '🚗',
      title: 'Vehículos',
      description: 'Autos, motos, camiones',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🏠',
      title: 'Hogar',
      description: 'Protegé tu casa',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '❤️',
      title: 'Vida y Salud',
      description: 'Cuidá a tu familia',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🏢',
      title: 'Empresas',
      description: 'ART y más',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const scrollToQuote = (tab) => {
    // Scroll al hero y cambiar pestaña
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Opcional: disparar evento para cambiar tab
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Nuestros Servicios
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => scrollToQuote(service.title.toLowerCase())}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600">
                {service.description}
              </p>
            </button>
          ))}
        </div>

        {/* CTA adicional */}
        <div className="text-center mt-10">
          <p className="text-white/80 mb-4">¿No encontrás lo que buscás?</p>
          <a 
            href="https://wa.me/5493415302929?text=Hola! Necesito información sobre otro tipo de seguro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            💬 Consultanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECCIÓN: TESTIMONIOS (Opcional)
// ==========================================

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'María García',
      role: 'Empresaria - Rosario',
      text: 'Excelente atención. Me ahorraron un 40% en el seguro de mi flota de vehículos.',
      rating: 5
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Particular',
      text: 'Muy profesionales. Cuando tuve un siniestro, me acompañaron en todo el proceso.',
      rating: 5
    },
    {
      name: 'Laura Martínez',
      role: 'PyME - Buenos Aires',
      text: 'La ART que nos consiguieron tiene excelente cobertura y el precio es muy competitivo.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Trayectoria comprobada en el mercado asegurador
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              
              {/* Texto */}
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.text}"
              </p>
              
              {/* Autor */}
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECCIÓN: CTA FINAL
// ==========================================

export const FinalCTA = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para proteger lo que más importa?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Cotizá gratis en 2 minutos. Sin compromiso, sin letra chica.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition"
          >
            Cotizar ahora
          </button>
          <a 
            href="https://wa.me/5493415302929"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            💬 WhatsApp
          </a>
          <a 
            href="tel:+5493416952259"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition"
          >
            📞 Llamar
          </a>
        </div>
      </div>
    </section>
  );
};
