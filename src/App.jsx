import { useState } from 'react'

// Iconos SVG
const TrendingDown = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
)

const Clock = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const Shield = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const MessageCircle = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
)

const AymaLogo = ({ size = "normal" }) => {
  const dimensions = {
    small: { circle: 50, text: 30 },
    normal: { circle: 80, text: 48 },
    large: { circle: 120, text: 72 }
  }
  const s = dimensions[size] || dimensions.normal
  
  return (
    <div className={`w-${s.circle} h-${s.circle} bg-ayma-blue rounded-full flex items-center justify-center shadow-xl border-4 border-white`} style={{width: s.circle + 'px', height: s.circle + 'px'}}>
      <span style={{fontSize: s.text + 'px'}}>🛡️</span>
    </div>
  )
}

function App() {
  const headlines = {
    0: {
      main: "Ahorrá hasta 35% en tu seguro de auto hoy",
      sub: "Miles de clientes ya ahorraron. Cotización gratis en 2 minutos sin compromiso"
    }
  }

  const [headlineVersion] = useState(0)

  const handleWhatsAppClick = () => {
    const message = `Hola! Vengo desde la web de Ayma Advisors.
Quiero recibir las mejores cotizaciones del mercado.`
    const whatsappURL = `https://wa.me/5493416952259?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayma-blue-dark via-ayma-blue to-ayma-blue-light">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AymaLogo size="normal" />
            <div className="text-left ml-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">AYMA ADVISORS</h1>
              <p className="text-gray-200 text-sm italic">Ahorro inteligente desde 2008</p>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-center py-4 px-6 rounded-2xl font-black text-lg md:text-xl shadow-2xl border-4 border-yellow-300">
            🔥 OFERTA EXCLUSIVA: Hasta 35% de descuento sobre tu póliza actual
          </div>
        </div>

        <article className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center leading-tight">
              {headlines[headlineVersion].main}
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-center">
              {headlines[headlineVersion].sub}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Ahorrás hasta 35%</h3>
                <p className="text-gray-600">Comparamos y encontramos el mejor precio del mercado</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="bg-ayma-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">En 2 minutos</h3>
                <p className="text-gray-600">Cotización instantánea sin papeleos ni esperas</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Las Mejores</h3>
                <p className="text-gray-600">Trabajamos con las aseguradoras líderes</p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-bold py-6 px-8 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-2xl pulse-glow mb-4"
            >
              <MessageCircle size={28} className="inline mr-3" />
              Cotizar Gratis Ahora
            </button>

            <p className="text-center text-gray-500 text-sm">
              📞 También podés llamarnos: <a href="tel:+5493416952259" className="text-ayma-blue font-bold hover:underline">341 695-2259</a>
            </p>
          </div>

          <section className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center shadow-xl" aria-label="Aseguradoras asociadas">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              🏆 TRABAJAMOS CON LAS MEJORES ASEGURADORAS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['San Cristóbal', 'Nación Seguros', 'Mapfre', 'SMG Seguros'].map((company) => (
                <div key={company} className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-6 rounded-xl font-bold text-ayma-blue text-center shadow-md">
                  {company}
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}

export default App
