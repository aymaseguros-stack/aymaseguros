// src/components/ChatBot.jsx
// ChatBot AYMA - Posición: ARRIBA IZQUIERDA (confirmado por Sebastián)
// Conectado al backend ACARA + guardado de leads

import { useState, useRef, useEffect } from 'react';

const BACKEND_URL = 'https://ayma-portal-backend.onrender.com/api/v1';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente de AYMA Advisors. ¿En qué puedo ayudarte hoy?\n\n📋 Puedo ayudarte con:\n• Cotizar seguro de auto\n• Cotizar seguro de hogar\n• Consultas sobre coberturas\n• Información de contacto'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Estado del flujo de cotización
  const [cotizacion, setCotizacion] = useState({
    step: 'inicio',
    tipo: null,
    marca: null,
    modelo: null,
    version: null,
    anio: null,
    cobertura: null,
    nombre: null,
    telefono: null
  });

  // Cache de datos del backend
  const [cache, setCache] = useState({
    marcas: [],
    modelos: [],
    versiones: []
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==================== LLAMADAS AL BACKEND ====================

  const fetchMarcas = async (tipo) => {
    try {
      const res = await fetch(`${BACKEND_URL}/acara/marcas?tipo=${tipo}`);
      const data = await res.json();
      setCache(prev => ({ ...prev, marcas: data }));
      return data;
    } catch (err) {
      console.error('Error fetching marcas:', err);
      return [];
    }
  };

  const fetchModelos = async (tipo, marca) => {
    try {
      const res = await fetch(`${BACKEND_URL}/acara/modelos?tipo=${tipo}&marca=${encodeURIComponent(marca)}`);
      const data = await res.json();
      setCache(prev => ({ ...prev, modelos: data }));
      return data;
    } catch (err) {
      console.error('Error fetching modelos:', err);
      return [];
    }
  };

  const fetchVersiones = async (tipo, marca, modelo) => {
    try {
      const res = await fetch(`${BACKEND_URL}/acara/versiones?tipo=${tipo}&marca=${encodeURIComponent(marca)}&modelo=${encodeURIComponent(modelo)}`);
      const data = await res.json();
      setCache(prev => ({ ...prev, versiones: data }));
      return data;
    } catch (err) {
      console.error('Error fetching versiones:', err);
      return [];
    }
  };

  const guardarLead = async (leadData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: leadData.nombre || 'Sin nombre',
          telefono: leadData.telefono,
          tipo_seguro: leadData.tipo || 'auto',
          vehiculo_tipo: leadData.tipo,
          vehiculo_marca: leadData.marca,
          vehiculo_modelo: leadData.modelo,
          vehiculo_version: leadData.version,
          vehiculo_anio: leadData.anio,
          cobertura: leadData.cobertura,
          origen: 'chatbot',
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        })
      });
      const data = await res.json();
      console.log('Lead guardado:', data);
      return data;
    } catch (err) {
      console.error('Error guardando lead:', err);
      return null;
    }
  };

  // Tracking cuando se abre el bot
  const handleOpen = () => {
    setIsOpen(true);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'bot_opened', {
        'event_category': 'engagement',
        'event_label': 'chatbot'
      });
    }
  };

  const addResponse = (content) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    const lowerMessage = userMessage.toLowerCase();

    // ========== FLUJO DE COTIZACIÓN POR PASOS ==========

    // PASO: SELECCIÓN DE TIPO
    if (cotizacion.step === 'inicio' || cotizacion.step === 'tipo') {
      if (lowerMessage.includes('auto') || lowerMessage.includes('coche')) {
        setCotizacion(prev => ({ ...prev, step: 'marca', tipo: 'auto' }));
        const marcas = await fetchMarcas('auto');
        if (marcas.length > 0) {
          const lista = marcas.slice(0, 10).map(m => `• ${m.marca}`).join('\n');
          addResponse(`🚗 ¡Perfecto! Seguro de auto.\n\n¿Cuál es la marca?\n\n${lista}\n\n...y ${marcas.length - 10} más. Escribí tu marca.`);
        } else {
          addResponse('🚗 ¡Perfecto! ¿Cuál es la marca de tu auto? (ej: Ford, Toyota, Fiat)');
        }
        return;
      }
      
      if (lowerMessage.includes('moto')) {
        setCotizacion(prev => ({ ...prev, step: 'marca', tipo: 'moto' }));
        const marcas = await fetchMarcas('moto');
        if (marcas.length > 0) {
          const lista = marcas.slice(0, 10).map(m => `• ${m.marca}`).join('\n');
          addResponse(`🏍️ ¡Genial! Seguro de moto.\n\n¿Cuál es la marca?\n\n${lista}`);
        } else {
          addResponse('🏍️ ¡Genial! ¿Cuál es la marca? (ej: Honda, Yamaha)');
        }
        return;
      }
      
      if (lowerMessage.includes('camioneta') || lowerMessage.includes('pickup')) {
        setCotizacion(prev => ({ ...prev, step: 'marca', tipo: 'camioneta' }));
        const marcas = await fetchMarcas('camioneta');
        if (marcas.length > 0) {
          const lista = marcas.slice(0, 10).map(m => `• ${m.marca}`).join('\n');
          addResponse(`🚐 ¡Perfecto! Seguro de camioneta.\n\n¿Cuál es la marca?\n\n${lista}`);
        } else {
          addResponse('🚐 ¡Perfecto! ¿Cuál es la marca? (ej: Toyota, Ford)');
        }
        return;
      }

      if (lowerMessage.includes('cotiz') || lowerMessage.includes('precio') || lowerMessage.includes('cuanto')) {
        setCotizacion(prev => ({ ...prev, step: 'tipo' }));
        addResponse('¡Perfecto! Para darte una cotización necesito algunos datos:\n\n🚗 ¿Qué tipo de vehículo querés asegurar?\n• Auto\n• Moto\n• Camioneta\n\nO si preferís, usá el formulario de arriba para cotizar directamente. 👆');
        return;
      }
    }

    // PASO: MARCA
    if (cotizacion.step === 'marca') {
      const marcaEncontrada = cache.marcas.find(m => 
        m.marca.toLowerCase() === lowerMessage || 
        m.marca.toLowerCase().includes(lowerMessage) ||
        lowerMessage.includes(m.marca.toLowerCase())
      );

      if (marcaEncontrada) {
        setCotizacion(prev => ({ ...prev, step: 'modelo', marca: marcaEncontrada.marca }));
        const modelos = await fetchModelos(cotizacion.tipo, marcaEncontrada.marca);
        if (modelos.length > 0) {
          const lista = modelos.slice(0, 10).map(m => `• ${m.modelo}`).join('\n');
          addResponse(`✅ ${marcaEncontrada.marca}\n\n¿Cuál es el modelo?\n\n${lista}${modelos.length > 10 ? `\n\n...y ${modelos.length - 10} más.` : ''}`);
        } else {
          addResponse(`✅ ${marcaEncontrada.marca}\n\n¿Cuál es el modelo?`);
        }
        return;
      } else {
        // Buscar si escribió una marca conocida aunque no esté en cache
        const marcasComunes = ['ford', 'chevrolet', 'toyota', 'fiat', 'volkswagen', 'renault', 'peugeot', 'honda', 'yamaha', 'suzuki'];
        const marcaComun = marcasComunes.find(m => lowerMessage.includes(m));
        if (marcaComun) {
          const marcaCapitalizada = marcaComun.toUpperCase();
          setCotizacion(prev => ({ ...prev, step: 'modelo', marca: marcaCapitalizada }));
          const modelos = await fetchModelos(cotizacion.tipo, marcaCapitalizada);
          if (modelos.length > 0) {
            const lista = modelos.slice(0, 10).map(m => `• ${m.modelo}`).join('\n');
            addResponse(`✅ ${marcaCapitalizada}\n\n¿Cuál es el modelo?\n\n${lista}`);
          } else {
            addResponse(`✅ ${marcaCapitalizada}\n\n¿Cuál es el modelo?`);
          }
          return;
        }
        addResponse(`No encontré "${userMessage}" en nuestra base.\n\nProbá con otra marca o escribí "marcas" para ver la lista.`);
        return;
      }
    }

    // PASO: MODELO
    if (cotizacion.step === 'modelo') {
      const modeloEncontrado = cache.modelos.find(m => 
        m.modelo.toLowerCase() === lowerMessage || 
        m.modelo.toLowerCase().includes(lowerMessage) ||
        lowerMessage.includes(m.modelo.toLowerCase())
      );

      if (modeloEncontrado) {
        setCotizacion(prev => ({ ...prev, step: 'anio', modelo: modeloEncontrado.modelo }));
        addResponse(`✅ ${cotizacion.marca} ${modeloEncontrado.modelo}\n\n¿De qué año es? (ej: 2022)`);
        return;
      } else {
        // Aceptar cualquier modelo que escriba
        setCotizacion(prev => ({ ...prev, step: 'anio', modelo: userMessage }));
        addResponse(`✅ ${cotizacion.marca} ${userMessage}\n\n¿De qué año es? (ej: 2022)`);
        return;
      }
    }

    // PASO: AÑO
    if (cotizacion.step === 'anio') {
      const anioMatch = lowerMessage.match(/\d{4}/);
      if (anioMatch) {
        const anio = anioMatch[0];
        setCotizacion(prev => ({ ...prev, step: 'cobertura', anio }));
        addResponse(`✅ ${cotizacion.marca} ${cotizacion.modelo} ${anio}\n\n¿Qué cobertura te interesa?\n\n1️⃣ Responsabilidad Civil\n2️⃣ Terceros Completo\n3️⃣ Todo Riesgo`);
        return;
      } else {
        addResponse('Por favor, escribí el año (ej: 2020, 2023)');
        return;
      }
    }

    // PASO: COBERTURA
    if (cotizacion.step === 'cobertura') {
      let cobertura = 'terceros_completo';
      let coberturaTexto = 'Terceros Completo';
      
      if (lowerMessage.includes('civil') || lowerMessage === '1' || lowerMessage.includes('rc')) {
        cobertura = 'responsabilidad_civil';
        coberturaTexto = 'Responsabilidad Civil';
      } else if (lowerMessage.includes('todo') || lowerMessage === '3' || lowerMessage.includes('riesgo')) {
        cobertura = 'todo_riesgo';
        coberturaTexto = 'Todo Riesgo';
      }

      setCotizacion(prev => ({ ...prev, step: 'telefono', cobertura }));
      addResponse(`✅ ${cotizacion.marca} ${cotizacion.modelo} ${cotizacion.anio}\n📋 Cobertura: ${coberturaTexto}\n\n¡Último paso! Para enviarte la cotización, dejame tu teléfono/WhatsApp:\n\n(ej: 341 555-1234)`);
      return;
    }

    // PASO: TELÉFONO (captura lead)
    if (cotizacion.step === 'telefono') {
      const telMatch = lowerMessage.match(/[\d\s\-]{7,}/);
      if (telMatch) {
        const telefono = telMatch[0].replace(/\D/g, '');
        
        // Guardar lead
        await guardarLead({
          ...cotizacion,
          telefono,
          nombre: 'Cliente Web'
        });

        // Tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'lead_captured', { 
            event_category: 'conversion',
            event_label: cotizacion.tipo
          });
        }

        // Reset
        setCotizacion({
          step: 'fin',
          tipo: null, marca: null, modelo: null, version: null, anio: null, cobertura: null, nombre: null, telefono: null
        });

        addResponse(`✅ ¡Listo!\n\n📋 Resumen:\n🚗 ${cotizacion.marca} ${cotizacion.modelo} ${cotizacion.anio}\n📋 ${cotizacion.cobertura?.replace('_', ' ')}\n📱 ${telefono}\n\n⏰ Te contactamos en menos de 2 horas.\n\n¿Querés que te llamemos por WhatsApp? 👇`);
        return;
      } else {
        addResponse('No detecté un teléfono válido.\n\nPor favor escribí tu número.\nEj: 341 555-1234');
        return;
      }
    }

    // ========== RESPUESTAS GENERALES (sin flujo activo) ==========

    if (lowerMessage.includes('hogar') || lowerMessage.includes('casa') || lowerMessage.includes('departamento')) {
      addResponse('Para el seguro de hogar te ofrecemos:\n\n🏠 **Cobertura básica:**\n• Incendio\n• Robo\n• Responsabilidad civil\n\n🏠 **Cobertura premium:**\n• Todo lo anterior +\n• Daños por agua\n• Cristales\n• Electrodomésticos\n\n¿Querés que te cotice? Necesito la dirección y valor aproximado del inmueble.');
      return;
    }

    if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('llamar') || lowerMessage.includes('whatsapp')) {
      addResponse('📞 **Nuestros canales:**\n\n• WhatsApp: 341 695-2259\n• Teléfono Rosario: 341 695-2259\n• Teléfono CABA: 11 5302-2929\n• Email: aymaseguros@hotmail.com\n\n¿Querés que te contactemos nosotros?');
      return;
    }

    if (lowerMessage.includes('gracias') || lowerMessage.includes('genial') || lowerMessage.includes('perfecto')) {
      addResponse('¡De nada! 😊 Estoy acá para lo que necesites.\n\n¿Hay algo más en lo que pueda ayudarte?');
      return;
    }

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage.includes('buen dia')) {
      addResponse('¡Hola! 👋 ¿Cómo estás?\n\n¿En qué puedo ayudarte hoy? Podemos cotizar seguros de auto, hogar, vida o responder cualquier consulta que tengas.');
      return;
    }

    // Nueva cotización después de finalizar
    if (cotizacion.step === 'fin' && (lowerMessage.includes('otra') || lowerMessage.includes('nuevo') || lowerMessage.includes('cotizar'))) {
      setCotizacion({
        step: 'inicio',
        tipo: null, marca: null, modelo: null, version: null, anio: null, cobertura: null, nombre: null, telefono: null
      });
      addResponse('¡Perfecto! ¿Qué tipo de seguro te interesa?\n\n🚗 Auto\n🏍️ Moto\n🚐 Camioneta\n🏠 Hogar');
      return;
    }

    // Default
    addResponse('Entiendo tu consulta. Para darte la mejor atención, te sugiero:\n\n1️⃣ Usar el **formulario de cotización** arriba 👆\n2️⃣ O contactarnos por **WhatsApp** al 341 695-2259\n\n¿Hay algo específico sobre seguros que quieras saber?');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWhatsApp = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        'event_category': 'engagement',
        'event_label': 'chatbot_whatsapp'
      });
    }
    
    let mensaje = 'Hola! Vengo del chatbot de la web';
    if (cotizacion.marca && cotizacion.modelo) {
      mensaje = `Hola! Quiero cotizar: ${cotizacion.marca} ${cotizacion.modelo} ${cotizacion.anio || ''} - ${cotizacion.cobertura || 'Terceros Completo'}`;
    }
    
    window.open(`https://wa.me/5493416952259?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <>
      {/* ============================================ */}
      {/* BOTÓN FLOTANTE - ARRIBA IZQUIERDA */}
      {/* ============================================ */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed top-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all z-50 group"
          aria-label="Abrir chat"
        >
          {/* Icono chat */}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          {/* Tooltip */}
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            ¿Necesitás ayuda?
          </span>
          
          {/* Punto de notificación */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* ============================================ */}
      {/* VENTANA CHAT - ARRIBA IZQUIERDA */}
      {/* ============================================ */}
      {isOpen && (
        <div className="fixed top-6 left-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[500px] overflow-hidden border border-gray-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">AYMA Advisors</h3>
                <p className="text-xs text-blue-100">🟢 En línea · Respuesta inmediata</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition p-1"
              aria-label="Cerrar chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-3 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Acciones rápidas */}
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button 
                onClick={() => {
                  setInput('Quiero cotizar un auto');
                  setTimeout(handleSend, 100);
                }}
                className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                🚗 Cotizar auto
              </button>
              <button 
                onClick={() => {
                  setInput('Quiero cotizar seguro de hogar');
                  setTimeout(handleSend, 100);
                }}
                className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                🏠 Seguro hogar
              </button>
              <button 
                onClick={handleWhatsApp}
                className="flex-shrink-0 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition"
              >
                💬 WhatsApp
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribí tu mensaje..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
