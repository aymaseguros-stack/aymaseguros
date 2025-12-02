import { useState } from 'react';

const Footer = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'contact_form_submit', { event_category: 'engagement' });
    }
    
    const msg = `📩 *NUEVO CONTACTO WEB*\n\n👤 Nombre: ${form.nombre}\n📧 Email: ${form.email}\n📱 Teléfono: ${form.telefono || 'No indicado'}\n\n💬 Mensaje:\n${form.mensaje}`;
    window.open(`https://wa.me/5493416952259?text=${encodeURIComponent(msg)}`, '_blank');
    
    setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    setSent(true);
    setLoading(false);
    setTimeout(() => setSent(false), 5000);
  };

  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <footer className="bg-gray-900 text-white">
      {/* Sección principal: Contacto + Ubicaciones */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ========== FORMULARIO CONTACTO ========== */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Contactanos</h2>
            <p className="text-gray-400 mb-6">
              Completá el formulario y te respondemos en menos de 24 horas
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Nombre completo *</label>
                  <input 
                    type="text" 
                    value={form.nombre} 
                    onChange={(e) => setForm({...form, nombre: e.target.value})} 
                    required 
                    className={inputClass} 
                    placeholder="Tu nombre" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    required 
                    className={inputClass} 
                    placeholder="tu@email.com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  value={form.telefono} 
                  onChange={(e) => setForm({...form, telefono: e.target.value})} 
                  className={inputClass} 
                  placeholder="341 XXX-XXXX" 
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Mensaje *</label>
                <textarea 
                  value={form.mensaje} 
                  onChange={(e) => setForm({...form, mensaje: e.target.value})} 
                  required 
                  rows={4} 
                  className={inputClass + " resize-none"} 
                  placeholder="¿En qué podemos ayudarte?" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>📧 Enviar mensaje</>
                )}
              </button>

              {sent && (
                <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center">
                  ✅ ¡Mensaje enviado! Te contactaremos pronto.
                </div>
              )}
            </form>
          </div>

          {/* ========== UBICACIONES CON MAPAS ========== */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Nuestras oficinas</h2>
            <p className="text-gray-400 mb-6">Visitanos en Rosario o Buenos Aires</p>

            <div className="space-y-6">
              
              {/* ROSARIO */}
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">📍 Rosario</h3>
                      <p className="text-gray-400 text-sm">Mariano Moreno 37, Piso 9 A</p>
                      <a href="tel:+5493416952259" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        📞 341 695-2259
                      </a>
                    </div>
                  </div>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.5!2d-60.6393!3d-32.9468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab3d5d00d5c7%3A0x1234567890abcdef!2sMariano%20Moreno%2037%2C%20S2000%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar" 
                  width="100%" 
                  height="180" 
                  style={{border: 0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Rosario"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* BUENOS AIRES */}
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">📍 Buenos Aires</h3>
                      <p className="text-gray-400 text-sm">Manzoni 112, CABA</p>
                      <a href="tel:+5491153022929" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        📞 11 5302-2929
                      </a>
                    </div>
                  </div>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0!2d-58.4370!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb0c0c0c0c0c%3A0xabcdef1234567890!2sManzoni%20112%2C%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1700000000001!5m2!1ses!2sar" 
                  width="100%" 
                  height="180" 
                  style={{border: 0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Buenos Aires"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========== BARRA INFERIOR ========== */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          
          {/* Grid inferior */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Logo + descripción */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 80 96" fill="none">
                    <path d="M40 0L80 16V48C80 72 60 88 40 96C20 88 0 72 0 48V16L40 0Z" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">AYMA Advisors</h3>
                  <p className="text-xs text-gray-500">Gestores de Riesgos desde 2008</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Asesores integrales en seguros para personas y empresas. 
                Comparamos las mejores opciones del mercado para proteger lo que más te importa.
              </p>
            </div>

            {/* Seguros */}
            <div>
              <h4 className="font-bold mb-4">Seguros</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#vehiculos" className="hover:text-white transition">🚗 Vehículos</a></li>
                <li><a href="#hogar" className="hover:text-white transition">🏠 Hogar</a></li>
                <li><a href="#vida" className="hover:text-white transition">❤️ Vida y Salud</a></li>
                <li><a href="#comercio" className="hover:text-white transition">🏪 Comercio</a></li>
                <li><a href="#art" className="hover:text-white transition">🏢 ART Empresas</a></li>
              </ul>
            </div>

            {/* Contacto rápido */}
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="tel:+5493416952259" className="hover:text-white transition flex items-center gap-2">
                    📞 341 695-2259
                  </a>
                </li>
                <li>
                  <a href="tel:+5491153022929" className="hover:text-white transition flex items-center gap-2">
                    📞 11 5302-2929
                  </a>
                </li>
                <li>
                  <a href="mailto:aymaseguros@hotmail.com" className="hover:text-white transition flex items-center gap-2">
                    📧 aymaseguros@hotmail.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5493416952259" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-2">
                    💬 WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimers legales */}
          <div className="border-t border-gray-800 pt-6">
            <div className="text-xs text-gray-500 space-y-2">
              <p>
                <strong>AYMA Advisors</strong> — Matrícula PAS N° 68323 inscripta ante la 
                Superintendencia de Seguros de la Nación (SSN). Asesoramiento de seguros 
                sujeto a Condiciones Particulares y Normativa SSN vigente.
              </p>
              <p>
                *El ahorro promedio del 35% está basado en clientes con dos o más pólizas 
                y perfil de riesgo bajo durante 2024. Los resultados individuales pueden 
                variar según compañía aseguradora, tipo de cobertura y antecedentes.
              </p>
              <p>
                Protección de datos personales conforme Ley 25.326 (AAIP). 
                <a href="/privacidad" className="underline hover:text-white ml-1">Política de Privacidad</a>
                {' | '}
                <a href="/terminos" className="underline hover:text-white">Términos y Condiciones</a>
              </p>
            </div>
            
            <p className="text-center text-gray-600 text-xs mt-6">
              © {new Date().getFullYear()} AYMA Advisors. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
