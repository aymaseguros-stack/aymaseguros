import { useState } from 'react'
import { Shield, CheckCircle, Home, Car, Heart, Users } from 'lucide-react'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <ChatBot />

      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Shield size={80} className="text-yellow-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
              Seguros de Auto, Hogar y Vida en Rosario
            </h1>
            
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto font-semibold">
              <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg inline-block mb-2">
                Cotización GRATIS en 2 minutos
              </span>
            </p>

            <p className="text-white text-lg mb-4">
              👉 <strong>Hacé click en el botón verde</strong> (abajo a la derecha) para cotizar
            </p>

            <p className="text-white text-lg">
              📞 O llamanos: <a 
                href="tel:+5493416952259" 
                className="text-yellow-400 font-bold hover:underline"
              >341 695-2259</a>
            </p>
          </div>

          <section className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center shadow-xl">
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

      <main>
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-center text-gray-900 mb-12">
              ¿Por qué elegir Ayma Advisors?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <article className="text-center p-6 bg-blue-50 rounded-xl shadow-lg">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Comparamos por vos</h3>
                <p className="text-gray-700">
                  Analizamos todas las opciones para encontrar la mejor relación precio-cobertura
                </p>
              </article>

              <article className="text-center p-6 bg-blue-50 rounded-xl shadow-lg">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">17 años de experiencia</h3>
                <p className="text-gray-700">
                  Más de 5,000 familias y empresas confían en nosotros
                </p>
              </article>

              <article className="text-center p-6 bg-blue-50 rounded-xl shadow-lg">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Asesoramiento personalizado</h3>
                <p className="text-gray-700">
                  Te acompañamos desde la cotización hasta el siniestro
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-center text-white mb-12">
              Nuestros Servicios
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="bg-white p-6 rounded-xl shadow-lg">
                <Car size={48} className="text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center">Vehículos</h3>
                <p className="text-gray-600 text-center">Autos, motos, camiones</p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-lg">
                <Home size={48} className="text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center">Hogar</h3>
                <p className="text-gray-600 text-center">Protegé tu casa</p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-lg">
                <Heart size={48} className="text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center">Vida y Salud</h3>
                <p className="text-gray-600 text-center">Cuidá a tu familia</p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-lg">
                <Users size={48} className="text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 text-center">Empresas</h3>
                <p className="text-gray-600 text-center">ART y más</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 Ayma Advisors. PAS 68323. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
