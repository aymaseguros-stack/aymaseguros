import { useState } from 'react';
import { tokenizar, TIPOS } from '../utils/tokenVault';

const Footer = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [tokenRef, setTokenRef] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Tokenizar lead de contacto
    const result = await tokenizar(TIPOS.LEAD, {
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      mensaje: form.mensaje.substring(0, 200),
      formulario: 'contacto_footer'
    }, 'footer');
    
    setTokenRef(result.token);
    
    const msg = `📩 *NUEVO CONTACTO WEB*\n🔖 Ref: ${result.token}\n\n👤 Nombre: ${form.nombre}\n📧 Email: ${form.email}\n📱 Teléfono: ${form.telefono || 'No indicado'}\n\n💬 Mensaje:\n${form.mensaje}`;
    window.open(`https://wa.me/5493416952259?text=${encodeURIComponent(msg)}`, '_blank');
    
    setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    setSent(true);
    setLoading(false);
    setTimeout(() => setSent(false), 5000);
  };

  const handlePhoneClick = async (numero, ubicacion) => {
    await tokenizar(TIPOS.PHONE_CLICK, { numero, ubicacion }, 'footer');
  };

  const handleWhatsAppClick = async () => {
    await tokenizar(TIPOS.WA_CLICK, { ubicacion: 'footer_social' }, 'footer');
  };

  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* FORMULARIO CONTACTO */}
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
                  ✅ ¡Mensaje enviado! Ref: {tokenRef?.slice(-8)}
                </div>
              )}
            </form>
          </div>

          {/* UBICACIONES */}
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
                      <a href="tel:+5493416952259" onClick={() => handlePhoneClick('3416952259', 'footer_rosario')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
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
                      <a href="tel:+5491153022929" onClick={() => handlePhoneClick('1153022929', 'footer_caba')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
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

      {/* BARRA INFERIOR */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Logo */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12">
                  <img src="/LOGO_AYMA_II.png" alt="AYMA" className="w-full h-full object-contain rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">AYMA</h3>
                  <p className="text-xs text-gray-500">Gestores de Riesgos desde 2008</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Asesores integrales en seguros para personas y empresas. 
                Comparamos las mejores opciones del mercado para proteger lo que más te importa.
              </p>
              
              {/* Redes Sociales */}
              <div className="flex gap-3 mt-4">
                <a href="https://instagram.com/aymaseguros" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition" aria-label="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="https://facebook.com/61584119926136" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition" aria-label="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="https://twitter.com/AymaSeguros" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-black rounded-full flex items-center justify-center transition" aria-label="X"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://linkedin.com/company/ayma-seguros" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition" aria-label="LinkedIn"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                <a href="https://wa.me/5493416952259" onClick={handleWhatsAppClick} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition" aria-label="WhatsApp"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
              </div>
            </div>

            {/* Seguros */}
            <div>
              <h4 className="font-bold mb-4">Seguros</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#vehiculos" className="hover:text-white transition"><img src="/icons/icons500x500_vehiculo.png" alt="" className="w-6 h-6 inline-block mr-2" />Vehículos</a></li>
                <li><a href="#hogar" className="hover:text-white transition"><img src="/icons/icons500x500_vivienda.png" alt="" className="w-6 h-6 inline-block mr-2" />Hogar</a></li>
                <li><a href="#vida" className="hover:text-white transition"><img src="/icons/Segurodevida.png" alt="" className="w-6 h-6 inline-block mr-2" />Vida y Salud</a></li>
                <li><a href="#comercio" className="hover:text-white transition"><img src="/icons/seguros_integral.png" alt="" className="w-6 h-6 inline-block mr-2" />Comercio</a></li>
                <li><a href="#art" className="hover:text-white transition"><img src="/icons/seguroart.png" alt="" className="w-6 h-6 inline-block mr-2" />ART Empresas</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="tel:+5493416952259" onClick={() => handlePhoneClick('3416952259', 'footer_contacto')} className="hover:text-white transition flex items-center gap-2">
                    📞 341 695-2259
                  </a>
                </li>
                <li>
                  <a href="tel:+5491153022929" onClick={() => handlePhoneClick('1153022929', 'footer_contacto')} className="hover:text-white transition flex items-center gap-2">
                    📞 11 5302-2929
                  </a>
                </li>
                <li>
                  <a href="mailto:aymaseguros@hotmail.com" className="hover:text-white transition flex items-center gap-2">
                    📧 aymaseguros@hotmail.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5493416952259" onClick={handleWhatsAppClick} target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-2">
                    💬 WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
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
