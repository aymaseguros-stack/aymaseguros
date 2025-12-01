import { useState, useEffect, useRef } from 'react'
import {
  Shield,
  Clock,
  TrendingDown,
  Award,
  CheckCircle,
  Users,
  Bot,
  User,
  Send,
  MessageCircle,
  Zap
} from './components/Icons'
import AymaLogo from './components/Logo'

// Constants
const HEADLINES = {
  A: {
    main: "Dejá de pagar de más por tu seguro de auto",
    sub: "Comparamos las mejores aseguradoras y te conseguimos el mejor precio en menos de 2 minutos"
  },
  B: {
    main: "Ahorrá hasta 35% en tu seguro de auto hoy",
    sub: "Miles de clientes ya ahorraron. Cotización gratis en 2 minutos sin compromiso"
  }
}

const TESTIMONIALS = [
  {
    name: "María González",
    location: "Rosario Centro",
    text: "Me ahorraron $15.000 por mes en mi seguro. El servicio es excelente, siempre atentos.",
    rating: 5,
    vehicle: "Honda Civic 2019"
  },
  {
    name: "Carlos Fernández",
    location: "Fisherton",
    text: "Rápido y sin vueltas. En 10 minutos tenía 3 cotizaciones y elegí la mejor. Súper recomendable.",
    rating: 5,
    vehicle: "Toyota Corolla 2021"
  },
  {
    name: "Lucía Martínez",
    location: "Funes",
    text: "Después de 5 años con otra compañía, me pasé gracias a Ayma. Mejor precio y mejor atención.",
    rating: 5,
    vehicle: "Volkswagen Gol 2018"
  }
]

const AymaAdvisorsApp = () => {
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [currentStep, setCurrentStep] = useState('inicio')
  const [currentQuote, setCurrentQuote] = useState({})
  const [isTyping, setIsTyping] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const messagesEndRef = useRef(null)

  // A/B Testing: Alterna entre dos versiones de headline
  const [headlineVersion] = useState(Math.random() > 0.5 ? 'A' : 'B')

  // Helper Functions
  const saveQuoteToStorage = async (quote) => {
    try {
      const quoteWithId = {
        ...quote,
        id: Date.now(),
        status: 'nueva',
        createdAt: new Date().toISOString(),
        notes: '',
        contactHistory: [],
        headlineVersion: headlineVersion // Trackear qué versión convirtió
      }

      // Guardar en localStorage
      const existingQuotes = JSON.parse(localStorage.getItem('ayma_quotes') || '[]')
      existingQuotes.push(quoteWithId)
      localStorage.setItem('ayma_quotes', JSON.stringify(existingQuotes))

      // Enviar a Google Sheets (si está configurado)
      sendToGoogleSheets(quoteWithId)

      // Enviar email automático al cliente
      sendAutoEmail(quoteWithId)

      console.log('Cotización guardada:', quoteWithId)
    } catch (error) {
      console.error('Error guardando cotización:', error)
    }
  }

  const sendToGoogleSheets = async (quote) => {
    // Implementación de Google Sheets API
    // Por ahora en consola, luego configuraremos con tu API key
    console.log('📊 Enviando a Google Sheets:', quote)

    // Cuando configures tu Google Sheet, usaremos esta estructura:
    // const SHEET_URL = 'TU_GOOGLE_APPS_SCRIPT_URL';
    // fetch(SHEET_URL, {
    //     method: 'POST',
    //     body: JSON.stringify(quote)
    // });
  }

  const sendAutoEmail = (quote) => {
    // Email automático usando mailto (básico)
    // Para versión profesional usaremos EmailJS o SendGrid
    console.log('📧 Email automático preparado para:', quote.email)

    const emailBody = `Hola ${quote.nombre},

¡Gracias por cotizar con Ayma Advisors!

Recibimos tu solicitud de cotización para tu ${quote.marca} ${quote.modelo} ${quote.anio}.

En breve te estaremos contactando con las mejores propuestas de:
✓ Nación Seguros
✓ San Cristóbal
✓ Mapfre
✓ SMG Seguros

Mientras tanto, si tenés alguna consulta, no dudes en contactarnos al +54 9 341 695-2259.

Saludos,
Equipo Ayma Advisors
Tu ahorro inteligente desde 2008`

    localStorage.setItem(`email_pending_${quote.id}`, emailBody)
  }

  const addBotMessage = (text) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { text, sender: 'bot', timestamp: new Date() }])
      setIsTyping(false)
    }, 800)
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }])
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userInput = input.trim()
    addUserMessage(userInput)
    setInput('')
    processUserInput(userInput)
  }

  const processUserInput = (userInput) => {
    switch(currentStep) {
      case 'inicio':
        setCurrentQuote({ nombre: userInput })
        setCurrentStep('codigoPostal')
        addBotMessage("Perfecto. ¿Cuál es tu código postal?")
        break

      case 'codigoPostal':
        setCurrentQuote(prev => ({ ...prev, codigoPostal: userInput }))
        setCurrentStep('marca')
        addBotMessage("Ahora sobre tu auto. ¿Qué marca es?")
        break

      case 'marca':
        setCurrentQuote(prev => ({ ...prev, marca: userInput }))
        setCurrentStep('modelo')
        addBotMessage("¿Qué modelo?")
        break

      case 'modelo':
        setCurrentQuote(prev => ({ ...prev, modelo: userInput }))
        setCurrentStep('anio')
        addBotMessage("¿De qué año?")
        break

      case 'anio':
        const anio = parseInt(userInput)
        if (isNaN(anio) || anio < 1980 || anio > 2026) {
          addBotMessage("Por favor, ingresá un año válido.")
          return
        }
        setCurrentQuote(prev => ({ ...prev, anio: userInput }))
        setCurrentStep('cobertura')
        addBotMessage("¿Qué cobertura te interesa? (RC / Terceros Completo / Terceros con Granizo / Todo Riesgo)")
        break

      case 'cobertura':
        const finalQuote = {
          ...currentQuote,
          cobertura: userInput,
          fecha: new Date().toLocaleString('es-AR')
        }
        setCurrentQuote(finalQuote)
        setCurrentStep('finalizado')
        setShowSuccess(true)
        saveQuoteToStorage(finalQuote)
        addBotMessage("¡Perfecto! Tu cotización está lista. Enviame tus datos por WhatsApp y te mando las mejores propuestas al instante.")
        break

      case 'finalizado':
        addBotMessage("Tu cotización ya está lista. Hacé clic en el botón verde de WhatsApp para enviármela.")
        break
    }
  }

  const sendToWhatsApp = () => {
    const message = `*SOLICITUD DE COTIZACIÓN - AYMA ADVISORS*

*DATOS:*
Nombre: ${currentQuote.nombre}
Código Postal: ${currentQuote.codigoPostal}

*VEHÍCULO:*
Modelo: ${currentQuote.modelo}
Año: ${currentQuote.anio}

*COBERTURA SOLICITADA:*
${currentQuote.cobertura}

Quiero recibir las mejores cotizaciones del mercado.`

    const whatsappURL = `https://wa.me/5493416952259?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }

  const startNewQuote = () => {
    setMessages([])
    setCurrentQuote({})
    setCurrentStep('inicio')
    setShowSuccess(false)
    addBotMessage("¡Hola! Soy el asistente de Ayma Advisors. Para cotizar tu seguro de auto, necesito algunos datos. ¿Cuál es tu nombre?")
  }

  // Landing Page View
  if (!showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayma-blue-dark via-ayma-blue to-ayma-blue-light">
        <div className="container mx-auto px-4 py-8">
          {/* Header con Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AymaLogo size="normal" />
              <div className="text-left ml-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">AYMA ADVISORS</h1>
                <p className="text-gray-200 text-sm italic">Ahorro inteligente desde 2008</p>
              </div>
            </div>
          </div>

          {/* Banner amarillo SEPARADO */}
          <div className="max-w-5xl mx-auto mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-center py-4 px-6 rounded-2xl font-black text-lg md:text-xl shadow-2xl border-4 border-yellow-300">
              🔥 OFERTA EXCLUSIVA: Hasta 35% de descuento sobre tu póliza actual
            </div>
          </div>

          {/* Card blanca SEPARADA */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center leading-tight">
                {HEADLINES[headlineVersion].main}
              </h2>
              <p className="text-xl text-gray-600 mb-8 text-center">
                {HEADLINES[headlineVersion].sub}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingDown size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-xl">Ahorrás hasta 35%</h3>
                  <p className="text-gray-600">Comparamos y encontramos el mejor precio del mercado</p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="bg-ayma-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-xl">En 2 minutos</h3>
                  <p className="text-gray-600">Cotización instantánea sin papeleos ni esperas</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-xl">Las Mejores</h3>
                  <p className="text-gray-600">Trabajamos con las aseguradoras líderes</p>
                </div>
              </div>

              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-bold py-6 px-8 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-2xl pulse-glow mb-4"
              >
                ✨ Cotizar Gratis Ahora
              </button>
              <p className="text-center text-sm text-gray-500">✓ Sin compromiso ✓ 100% gratis ✓ Respuesta inmediata</p>
            </div>
          </div>

          {/* Por qué elegirnos */}
          <div className="max-w-5xl mx-auto mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white text-center mb-8">¿Por qué miles eligen Ayma Advisors?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start text-white">
                <CheckCircle className="mr-3 flex-shrink-0 text-green-400" size={24} />
                <div>
                  <h4 className="font-bold mb-1">17 años de experiencia</h4>
                  <p className="text-blue-100 text-sm">Productores profesionales desde 2008</p>
                </div>
              </div>
              <div className="flex items-start text-white">
                <CheckCircle className="mr-3 flex-shrink-0 text-green-400" size={24} />
                <div>
                  <h4 className="font-bold mb-1">Asesoramiento sin costo</h4>
                  <p className="text-blue-100 text-sm">Te guiamos en todo el proceso gratis</p>
                </div>
              </div>
              <div className="flex items-start text-white">
                <CheckCircle className="mr-3 flex-shrink-0 text-green-400" size={24} />
                <div>
                  <h4 className="font-bold mb-1">Gestionamos tus siniestros</h4>
                  <p className="text-blue-100 text-sm">No te preocupés por nada, nosotros lo hacemos</p>
                </div>
              </div>
              <div className="flex items-start text-white">
                <CheckCircle className="mr-3 flex-shrink-0 text-green-400" size={24} />
                <div>
                  <h4 className="font-bold mb-1">Comparación objetiva</h4>
                  <p className="text-blue-100 text-sm">Te mostramos todas las opciones sin letra chica</p>
                </div>
              </div>
            </div>
          </div>

          {/* Garantía */}
          <div className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center shadow-xl">
            <Award className="mx-auto mb-3 text-gray-900" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Garantía de Ahorro</h3>
            <p className="text-gray-900 text-lg">Si no te ahorramos dinero comparado con tu póliza actual, no pagás nada. Sin vueltas.</p>
          </div>

          {/* Aseguradoras */}
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-gray-800 text-center font-bold text-xl mb-6">Trabajamos con las mejores aseguradoras:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-6 rounded-xl font-bold text-ayma-blue text-center shadow-md">Nación Seguros</div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 px-4 py-6 rounded-xl font-bold text-red-900 text-center shadow-md">San Cristóbal</div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-6 rounded-xl font-bold text-green-900 text-center shadow-md">Mapfre</div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-6 rounded-xl font-bold text-purple-900 text-center shadow-md">SMG Seguros</div>
            </div>
          </div>

          {/* Testimonios */}
          <div className="max-w-6xl mx-auto mt-12">
            <h3 className="text-3xl font-bold text-white text-center mb-8">Lo que dicen nuestros clientes</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-ayma-blue rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                  <p className="text-sm text-gray-500">{testimonial.vehicle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-white mb-2">
              <Users size={24} />
              <span className="text-lg font-semibold">+2.500 clientes confían en nosotros</span>
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">★</span>
              ))}
            </div>
            <p className="text-blue-200">Calificación promedio 4.9/5</p>
          </div>

          {/* Footer */}
          <div className="text-center text-white mt-12 pt-8 border-t border-blue-500">
            <p className="mb-2 text-lg">📍 Rosario, Santa Fe, Argentina</p>
            <p className="mb-2 text-lg">📞 +54 9 341 695-2259</p>
            <p className="text-blue-200 mb-4">Atención personalizada por WhatsApp</p>
          </div>
        </div>
      </div>
    )
  }

  // Chat View
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-ayma-blue-dark to-ayma-blue text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AymaLogo size="small" />
              <div className="ml-3">
                <h2 className="text-xl font-bold">Ayma Advisors</h2>
                <p className="text-sm text-blue-100">Cotizador Inteligente</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-ayma-blue px-3 py-1 rounded transition"
            >
              ← Volver
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 ${msg.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {msg.sender === 'bot' ? (
                    <div className="w-10 h-10 bg-ayma-blue rounded-full flex items-center justify-center">
                      <Bot size={22} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <User size={22} className="text-white" />
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${msg.sender === 'bot' ? 'bg-white border-2 border-blue-200' : 'bg-ayma-blue text-white'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[80%]">
                <div className="w-10 h-10 bg-ayma-blue rounded-full flex items-center justify-center mr-2">
                  <Bot size={22} className="text-white" />
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-blue-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-ayma-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-ayma-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-ayma-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-t-4 border-green-500 p-6 mx-4 mb-4 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <CheckCircle size={32} className="text-green-600 mr-3" />
              <div>
                <h3 className="font-bold text-green-800 text-lg">¡Tu cotización está lista! 🎉</h3>
                <p className="text-green-700 text-sm">Enviame tus datos por WhatsApp y te mando las mejores propuestas en minutos</p>
              </div>
            </div>
            <button
              onClick={sendToWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl mb-3"
            >
              <MessageCircle size={24} />
              Enviar por WhatsApp
            </button>
            <button
              onClick={startNewQuote}
              className="w-full bg-ayma-blue hover:bg-ayma-blue-dark text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Nueva Cotización
            </button>
          </div>
        )}

        <div className="bg-white border-t-2 border-gray-200 p-4" style={{marginBottom: '60px'}}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu respuesta aquí..."
              className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ayma-blue focus:border-transparent"
              disabled={currentStep === 'finalizado'}
            />
            <button
              onClick={handleSend}
              disabled={currentStep === 'finalizado'}
              className="bg-ayma-blue text-white p-3 rounded-xl hover:bg-ayma-blue-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AymaAdvisorsApp
