import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { validarMarca, validarAnio, validarModelo, validarVersion } from '../utils/acaraParser'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [step, setStep] = useState('inicio')
  const [leadData, setLeadData] = useState({})
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      
        addBotMessage('¡Hola! 👋 Soy el asistente de AYMA Advisors.\n\nEn 2 minutos te ayudo a cotizar tu seguro.\n\n¿Cuál es tu nombre?')
        setStep('nombre')
      }, 500)
    }
  }, [isOpen])

  const addBotMessage = (text) => {
    setIsTyping(true)
    
      setMessages(prev => [...prev, { type: 'bot', text }])
      setIsTyping(false)
    }, 800)
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userInput = inputValue.trim()
    addUserMessage(userInput)
    setInputValue('')

    await processStep(step, userInput)
  }

  const processStep = async (currentStep, input) => {
    let nextStep = ''
    let botResponse = ''

    switch(currentStep) {
      case 'nombre':
        setLeadData(prev => ({ ...prev, nombre: input }))
        botResponse = `Perfecto ${input}! 😊\n\n¿En qué código postal está tu vehículo?\n\nEjemplo: 2000`
        nextStep = 'cp'
        break

      case 'cp':
        if (!/^\d{4}$/.test(input)) {
          botResponse = '❌ Código postal inválido.\n\nDebe tener 4 dígitos.\n\nEjemplo: 2000'
          nextStep = 'cp'
        } else {
          setLeadData(prev => ({ ...prev, cp: input }))
          botResponse = '¿Qué tipo de vehículo querés asegurar?\n\n1️⃣ Auto\n2️⃣ Moto\n3️⃣ Camión/Utilitario\n\nPodés escribir el número o el nombre'
          nextStep = 'tipo_vehiculo'
        }
        break

      case 'tipo_vehiculo':
        const inputLower = input.toLowerCase()
        let tipoSeleccionado = null
        
        if (input === '1' || inputLower.includes('auto')) {
          tipoSeleccionado = 'Auto'
        } else if (input === '2' || inputLower.includes('moto')) {
          tipoSeleccionado = 'Moto'
        } else if (input === '3' || inputLower.includes('camion') || inputLower.includes('utilitario')) {
          tipoSeleccionado = 'Camión'
        }
        
        if (!tipoSeleccionado) {
          botResponse = '❌ Opción inválida.\n\nEscribí:\n1 (o Auto)\n2 (o Moto)\n3 (o Camión)'
          nextStep = 'tipo_vehiculo'
        } else {
          setLeadData(prev => ({ ...prev, tipo_vehiculo: tipoSeleccionado }))
          botResponse = `Perfecto, un ${tipoSeleccionado}. 🚗\n\n¿Qué marca es?\n\nEjemplo: Ford, Chevrolet`
          nextStep = 'marca'
        }
        break

      case 'marca':
        const resultadoMarca = validarMarca(input)
        
        if (!resultadoMarca.valido) {
          botResponse = resultadoMarca.mensaje
          nextStep = 'marca'
        } else {
          setLeadData(prev => ({ ...prev, marca: resultadoMarca.marca }))
          botResponse = `Perfecto! ${resultadoMarca.marca} 👍\n\n¿De qué año es tu ${leadData.tipo_vehiculo}?\n\nEjemplo: 2020 o "dos mil veinte"`
          nextStep = 'anio'
        }
        break

      case 'anio':
        const resultadoAnio = validarAnio(input)
        
        if (!resultadoAnio.valido) {
          botResponse = resultadoAnio.mensaje
          nextStep = 'anio'
        } else {
          setLeadData(prev => ({ ...prev, anio: resultadoAnio.anio }))
          botResponse = `Perfecto! ${resultadoAnio.anio} 📅\n\n¿Qué modelo?\n\nSi no sabés, escribí "nose" para ver opciones`
          nextStep = 'modelo'
        }
        break

      case 'modelo':
        const resultadoModelo = validarModelo(leadData.marca, leadData.anio, input)
        
        if (!resultadoModelo.valido) {
          botResponse = resultadoModelo.mensaje
          nextStep = 'modelo'
        } else {
          setLeadData(prev => ({ ...prev, modelo: resultadoModelo.modelo }))
          botResponse = `Excelente! ${resultadoModelo.modelo} 🚙\n\n¿Cuál es la versión?\n\nSi no sabés, escribí "nose" para ver opciones`
          nextStep = 'version'
        }
        break

      case 'version':
        const resultadoVersion = validarVersion(leadData.marca, leadData.anio, leadData.modelo, input)
        
        if (!resultadoVersion.valido) {
          botResponse = resultadoVersion.mensaje
          nextStep = 'version'
        } else {
          setLeadData(prev => ({ ...prev, version: resultadoVersion.version }))
          botResponse = `Perfecto! ✅\n\nConfirmemos:\n━━━━━━━━━━━━━━━━\n🚗 ${leadData.marca} ${leadData.modelo}\n📅 Año: ${leadData.anio}\n⚙️ Versión: ${resultadoVersion.version}\n━━━━━━━━━━━━━━━━\n\n¿Es correcto?\n\nEscribí: SI o NO`
          nextStep = 'confirmar'
        }
        break

      case 'confirmar':
        const respuesta = input.toUpperCase()
        if (respuesta === 'SI' || respuesta === 'SÍ' || respuesta === 'S') {
          botResponse = `Excelente! 🎉\n\n¿Qué cobertura querés?\n\n1️⃣ Responsabilidad Civil\n2️⃣ Terceros Completo\n3️⃣ Todo Riesgo\n\nPodés escribir número o nombre`
          nextStep = 'cobertura'
        } else {
          botResponse = `¿Qué querés corregir?\n\n1️⃣ Marca (${leadData.marca})\n2️⃣ Año (${leadData.anio})\n3️⃣ Modelo (${leadData.modelo})\n4️⃣ Versión (${leadData.version})\n\nEscribí el número`
          nextStep = 'corregir'
        }
        break

      case 'corregir':
        const opcionCorregir = input.trim()
        if (opcionCorregir === '1') {
          botResponse = `¿Qué marca es?\n\nEjemplo: Ford, Chevrolet`
          nextStep = 'marca'
        } else if (opcionCorregir === '2') {
          botResponse = `¿De qué año es tu ${leadData.tipo_vehiculo}?\n\nEjemplo: 2020`
          nextStep = 'anio'
        } else if (opcionCorregir === '3') {
          botResponse = `¿Qué modelo?\n\nSi no sabés, escribí "nose"`
          nextStep = 'modelo'
        } else if (opcionCorregir === '4') {
          botResponse = `¿Cuál es la versión?\n\nSi no sabés, escribí "nose"`
          nextStep = 'version'
        } else {
          botResponse = '❌ Opción inválida.\n\nEscribí:\n1 (Marca)\n2 (Año)\n3 (Modelo)\n4 (Versión)'
          nextStep = 'corregir'
        }
        break

      case 'cobertura':
        const inputCobLower = input.toLowerCase()
        let coberturaSeleccionada = null
        
        if (input === '1' || inputCobLower.includes('rc') || inputCobLower.includes('responsabilidad')) {
          coberturaSeleccionada = { codigo: 'RC', nombre: 'Responsabilidad Civil' }
        } else if (input === '2' || inputCobLower.includes('tc') || inputCobLower.includes('terceros')) {
          coberturaSeleccionada = { codigo: 'TC', nombre: 'Terceros Completo' }
        } else if (input === '3' || inputCobLower.includes('tr') || inputCobLower.includes('todo riesgo')) {
          coberturaSeleccionada = { codigo: 'TR', nombre: 'Todo Riesgo' }
        }
        
        if (!coberturaSeleccionada) {
          botResponse = '❌ Opción inválida.\n\nEscribí:\n1 (o RC)\n2 (o TC)\n3 (o TR)'
          nextStep = 'cobertura'
        } else {
          const leadCompleto = {
            ...leadData,
            cobertura: coberturaSeleccionada.codigo,
            timestamp: new Date().toISOString()
          }
          
          setLeadData(leadCompleto)
          
          const leads = JSON.parse(localStorage.getItem('leads_ayma') || '[]')
          leads.push(leadCompleto)
          localStorage.setItem('leads_ayma', JSON.stringify(leads))
          
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'lead_captured',
              lead_tipo: 'cotizacion_auto',
              lead_marca: leadCompleto.marca
            })
          }
          
          const mensajeWA = `🚗 NUEVA COTIZACIÓN

👤 ${leadCompleto.nombre}
📍 CP: ${leadCompleto.cp}

🚙 ${leadCompleto.marca} ${leadCompleto.modelo} ${leadCompleto.anio}
Versión: ${leadCompleto.version}
Cobertura: ${coberturaSeleccionada.nombre}`

          botResponse = `¡Listo ${leadCompleto.nombre}! ✅\n\nTu solicitud fue registrada.\n\nTe contactaremos pronto.`
          nextStep = 'finalizado'
          
          
            window.open(`https://wa.me/5493416952259?text=${encodeURIComponent(mensajeWA)}`, '_blank')
          
        }
        break

      default:
        botResponse = 'Gracias por contactarnos!'
        nextStep = 'finalizado'
    }

    if (botResponse) {
      setTimeout(() => addBotMessage(botResponse), 1000)
    }
    setStep(nextStep)
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-full shadow-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-110 transition-all z-50"
          style={{ width: '80px', height: '80px' }}
        >
          <MessageCircle size={40} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-4 border-blue-600" style={{ height: 'calc(100vh - 100px)', maxHeight: '600px' }}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-bold">AYMA Advisors</h3>
                <p className="text-xs">Cotización en 2 min</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex-shrink-0 rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribí tu respuesta..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none"
                disabled={isTyping}
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatBot
