import { useState } from 'react'
import { Shield, CheckCircle, MessageCircle, Home, Car, Heart, Users, FileText } from 'lucide-react'

function App() {
  const handleWhatsAppClick = () => {
    const message = `Hola! Vengo desde la web de Ayma Advisors.
Quiero recibir las mejores cotizaciones del mercado.`
    const whatsappURL = `https://wa.me/5493416952259?text=${encodeURIComponent(message)}`
    
    // GTM Event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'whatsapp_click',
        button_location: 'hero_cta'
      });
    }
    
    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayma-blue-dark via-ayma-blue to-ayma-blue-light">
      {/* Hero Section */}
      <header className="relative overflow-hidden" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8" aria-label="Ayma Advisors Logo">
              <Shield size={80} className="text-yellow-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Seguros de Auto, Hogar y Vida en Rosario
            </h1>
            
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto font-semibold">
              <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg inline-block mb-2">
                Cotización GRATIS en 2 minutos
              </span>
            </p>

            <button
              id="btn-whatsapp-hero"
              data-gtm-event="whatsapp_click"
              data-gtm-location="hero"
              onClick={handleWhatsAppClick}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-bold py-6 px-8 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-2xl pulse-glow mb-4"
            >
              <MessageCircle size={28} className="inline mr-3" />
              Cotizar Gratis Ahora
            </button>

            <p className="text-white text-lg">
              📞 También podés llamarnos: <a 
                href="tel:+5493416952259" 
                id="btn-phone-hero"
                data-gtm-event="phone_click"
                data-gtm-location="hero"
                className="text-ayma-blue font-bold hover:underline"
              >341 695-2259</a>
            </p>
          </div>

          <section className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center shadow-xl" aria-label="Aseguradoras asociadas">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              Trabajamos con las mejores aseguradoras
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-gray-900 font-bold text-lg">
              <span className="bg-white px-4 py-2 rounded-lg shadow">San Cristóbal</span>
              <span className="bg-white px-4 py-2 rounded-lg shadow">Nación Seguros</span>
              <span className="bg-white px-4 py-2 rounded-lg shadow">Mapfre</span>
              <span className="bg-white px-4 py-2 rounded-lg shadow">SMG Seguros</span>
            </div>
          </section>
        </div>
      </header>

      {/* Benefits Section */}
      <main>
        <section className="bg-white py-16" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="benefits-heading" className="text-3xl font-black text-center text-gray-900 mb-12">
              ¿Por qué elegir Ayma Advisors?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <article className="text-center p-6 bg-ayma-blue-light rounded-xl shadow-lg">
                <div className="bg-ayma-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Comparamos por vos</h3>
                <p className="text-gray-700">
                  Analizamos todas las opciones del mercado para encontrar la mejor relación precio-cobertura
                </p>
              </article>

              <article className="text-center p-6 bg-ayma-blue-light rounded-xl shadow-lg">
                <div className="bg-ayma-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">17 años de experiencia</h3>
                <p className="text-gray-700">
                  Más de 5,000 familias y empresas confían en nosotros
                </p>
              </article>

              <article className="text-center p-6 bg-ayma-blue-light rounded-xl shadow-lg">
                <div className="bg-ayma-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Asesoramiento personalizado</h3>
                <p className="text-gray-700">
                  Te acompañamos en cada paso, desde la cotización hasta el siniestro
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-gradient-to-br from-ayma-blue to-ayma-blue-dark py-16" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="services-heading" className="text-3xl font-black text-center text-white mb-12">
              Nuestros Servicios
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <Car size={48} className="text-ayma-blue mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center text-gray-900">Vehículos</h3>
                <p className="text-gray-600 text-center">Autos, motos, camiones y flotas</p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <Home size={48} className="text-ayma-blue mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center text-gray-900">Hogar</h3>
                <p className="text-gray-600 text-center">Protegé tu casa y tus bienes</p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <Heart size={48} className="text-ayma-blue mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center text-gray-900">Vida y Salud</h3>
                <p className="text-gray-600 text-center">Cuidá a tu familia</p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <Users size={48} className="text-ayma-blue mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center text-gray-900">Empresas</h3>
                <p className="text-gray-600 text-center">ART, responsabilidad civil y más</p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-yellow-400 py-16" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
              ¿Listo para ahorrar en tu seguro?
            </h2>
            <p className="text-xl text-gray-800 mb-8 font-semibold">
              Recibí las mejores cotizaciones en minutos
            </p>
            
            <button
              id="btn-whatsapp-cta"
              data-gtm-event="whatsapp_click"
              data-gtm-location="cta"
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-bold py-6 px-12 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-2xl pulse-glow"
            >
              <MessageCircle size={28} className="inline mr-3" />
              Cotizar Gratis por WhatsApp
            </button>

            <p className="mt-6 text-gray-800 text-lg">
              📞 También podés llamarnos: <a 
                href="tel:+5493416952259" 
                id="btn-phone-cta"
                data-gtm-event="phone_click"
                data-gtm-location="cta"
                className="text-ayma-blue-dark font-bold hover:underline"
              >341 695-2259</a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ayma Advisors</h3>
              <p className="text-gray-400">
                Gestores de Riesgos desde 2008
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <p className="text-gray-400">Rosario, Santa Fe</p>
              <p className="text-gray-400">
                <a 
                  href="tel:+5493416952259"
                  id="btn-phone-footer"
                  data-gtm-event="phone_click"
                  data-gtm-location="footer"
                  className="hover:text-yellow-400"
                >341 695-2259</a>
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Seguinos</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400" aria-label="Facebook">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-yellow-400" aria-label="Instagram">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-yellow-400" aria-label="LinkedIn">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ayma Advisors. PAS 68323. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
