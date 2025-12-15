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
            <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECCIÓN: HOGAR
// ==========================================

export const SeccionHogar = () => {
  const coberturas = [
    { icon: '🔥', titulo: 'Incendio', desc: 'Protección contra fuego, rayo y explosión' },
    { icon: '🌊', titulo: 'Daños por agua', desc: 'Filtraciones, roturas de cañerías' },
    { icon: '🔐', titulo: 'Robo', desc: 'Contenido general y objetos de valor' },
    { icon: '⚡', titulo: 'Daños eléctricos', desc: 'Electrodomésticos y equipos' },
    { icon: '🏠', titulo: 'Responsabilidad civil', desc: 'Daños a terceros en tu propiedad' },
    { icon: '🔧', titulo: 'Asistencia hogar', desc: 'Plomería, cerrajería, electricidad 24hs' },
  ];

  return (
    <section id="hogar" className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            SEGUROS PARA EL HOGAR
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Protegé tu casa y todo lo que hay dentro
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tu hogar es más que un lugar, es donde están tus recuerdos. 
            Aseguralo contra imprevistos con coberturas a tu medida.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {coberturas.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.titulo}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">¿Por qué asegurar tu hogar con nosotros?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span><span>Comparamos más de 10 compañías para darte el mejor precio</span></li>
                <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span><span>Coberturas flexibles: elegís lo que necesitás</span></li>
                <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span><span>Asistencia 24/7 ante emergencias</span></li>
                <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span><span>Gestión de siniestros personalizada</span></li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-blue-100 mb-4">Cotización gratis en 2 minutos</p>
              <a href="https://wa.me/5493416952259?text=Hola! Quiero cotizar un seguro de hogar" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
                🏠 Cotizar Seguro de Hogar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECCIÓN: COMERCIO
// ==========================================

export const SeccionComercio = () => {
  const soluciones = [
    { icon: '🏪', titulo: 'Integral de Comercio', desc: 'Todo en uno: incendio, robo, RC y más', destacado: true },
    { icon: '🔥', titulo: 'Incendio', desc: 'Edificio, instalaciones y mercaderías' },
    { icon: '🔐', titulo: 'Robo', desc: 'Mercadería, dinero en caja y tránsito' },
    { icon: '⚖️', titulo: 'Responsabilidad Civil', desc: 'Daños a clientes y terceros' },
    { icon: '💻', titulo: 'Equipos Electrónicos', desc: 'Computadoras, POS, maquinaria' },
    { icon: '🚚', titulo: 'Transporte', desc: 'Mercadería en tránsito' },
  ];
  const rubros = ['Retail', 'Gastronomía', 'Oficinas', 'Servicios', 'Depósitos', 'Industria'];

  return (
    <section id="comercio" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            SEGUROS PARA COMERCIOS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tu negocio protegido, tu tranquilidad garantizada
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Soluciones integrales para comercios de todos los rubros. 
            Protegé tu inversión con coberturas diseñadas para tu actividad.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {rubros.map((rubro, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">{rubro}</span>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {soluciones.map((item, i) => (
            <div key={i} className={`rounded-xl p-6 border-2 transition-all hover:shadow-lg ${item.destacado ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {item.titulo}
                    {item.destacado && <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">RECOMENDADO</span>}
                  </h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">¿Tenés un comercio?</h3>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">Te armamos un paquete de protección a medida de tu negocio. Sin compromiso.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/5493416952259?text=Hola! Quiero cotizar un seguro para mi comercio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition">
              🏪 Cotizar Seguro Comercial
            </a>
            <a href="tel:+5493416952259" className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-800 transition">
              📞 Llamar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECCIÓN: EMPRESAS
// ==========================================

export const SeccionEmpresas = () => {
  const productos = [
    { icon: '👷', titulo: 'ART', desc: 'Aseguradora de Riesgos del Trabajo obligatoria', destacado: true },
    { icon: '❤️', titulo: 'Vida Colectivo', desc: 'Protección para tu equipo de trabajo' },
    { icon: '🚗', titulo: 'Flotas', desc: 'Vehículos corporativos con descuentos' },
    { icon: '⚖️', titulo: 'RC Profesional', desc: 'Para directores y profesionales' },
    { icon: '📦', titulo: 'Transporte', desc: 'Mercadería nacional e internacional' },
    { icon: '📋', titulo: 'Caución', desc: 'Garantías para licitaciones' },
    { icon: '🏭', titulo: 'Todo Riesgo Operativo', desc: 'Maquinaria y equipos' },
    { icon: '🛡️', titulo: 'D&O', desc: 'Directores y gerentes' },
  ];
  const stats = [
    { valor: '+500', label: 'Empresas aseguradas' },
    { valor: '+10.000', label: 'Empleados cubiertos' },
    { valor: '17', label: 'Años de experiencia' },
  ];

  return (
    <section id="empresas" className="py-20 bg-gray-900 text-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            SEGUROS CORPORATIVOS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Soluciones integrales para empresas</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Desde PyMEs hasta grandes corporaciones. Diseñamos programas de seguros 
            que protegen tu operación, tu equipo y tu patrimonio.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">{stat.valor}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {productos.map((item, i) => (
            <div key={i} className={`rounded-xl p-5 transition-all hover:-translate-y-1 ${item.destacado ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 hover:bg-gray-700'}`}>
              <div className="text-2xl mb-3">{item.icon}</div>
              <h4 className={`font-bold mb-1 ${item.destacado ? 'text-gray-900' : 'text-white'}`}>
                {item.titulo}
                {item.destacado && <span className="ml-2 text-xs bg-gray-900 text-yellow-400 px-2 py-0.5 rounded-full">OBLIGATORIO</span>}
              </h4>
              <p className={`text-sm ${item.destacado ? 'text-gray-700' : 'text-gray-400'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Gestión integral de riesgos</h3>
              <p className="text-gray-400 mb-6">No somos solo un broker. Somos tu partner estratégico en la gestión de riesgos empresariales.</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><span className="text-yellow-400">✓</span> Auditoría de riesgos sin cargo</li>
                <li className="flex items-center gap-2"><span className="text-yellow-400">✓</span> Ejecutivo de cuenta dedicado</li>
                <li className="flex items-center gap-2"><span className="text-yellow-400">✓</span> Gestión de siniestros prioritaria</li>
                <li className="flex items-center gap-2"><span className="text-yellow-400">✓</span> Reportes y métricas mensuales</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-xl p-6 mb-4">
                <p className="text-gray-400 text-sm mb-2">¿Cuántos empleados tenés?</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {['1-10', '11-50', '51-200', '+200'].map((rango) => (
                    <a key={rango} href={`https://wa.me/5493416952259?text=Hola! Tengo una empresa con ${rango} empleados`} target="_blank" rel="noopener noreferrer" className="bg-gray-600 hover:bg-yellow-400 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      {rango}
                    </a>
                  ))}
                </div>
              </div>
              <a href="https://wa.me/5493416952259?text=Hola! Quiero información sobre seguros para empresas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition">
                🏢 Cotizar Seguros Corporativos
              </a>
            </div>
          </div>
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
    { icon: '🚗', title: 'Vehículos', description: 'Autos, motos, camiones', href: '#' },
    { icon: '🏠', title: 'Hogar', description: 'Protegé tu casa', href: '#hogar' },
    { icon: '🏪', title: 'Comercio', description: 'Negocios protegidos', href: '#comercio' },
    { icon: '🏢', title: 'Empresas', description: 'ART, flotas y más', href: '#empresas' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Nuestros Servicios</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <a key={index} href={service.href} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </a>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-white/80 mb-4">¿No encontrás lo que buscás?</p>
          <a href="https://wa.me/5493416952259?text=Hola! Necesito información sobre otro tipo de seguro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            💬 Consultanos por WhatsApp
          </a>
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
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para proteger lo que más importa?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Cotizá gratis en 2 minutos. Sin compromiso, sin letra chica.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition">
            Cotizar ahora
          </button>
          <a href="https://wa.me/5493416952259" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition flex items-center gap-2">
            💬 WhatsApp
          </a>
          <a href="tel:+5493416952259" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition">
            📞 Llamar
          </a>
        </div>
      </div>
    </section>
  );
};
