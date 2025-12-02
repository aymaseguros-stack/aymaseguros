// src/components/ChatBot.jsx
// ChatBot AYMA - Conectado al Backend ACARA + Leads

import { useState, useRef, useEffect } from 'react';

const BACKEND_URL = 'https://ayma-portal-backend.onrender.com/api/v1';
const WHATSAPP_ROSARIO = '5493416952259';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente de AYMA Advisors.\n\n¿Qué tipo de seguro te interesa?\n\n🚗 Auto\n🏍️ Moto\n🚐 Camioneta\n🏠 Hogar'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Estado del flujo de cotización
  const [cotizacion, setCotizacion] = useState({
    step: 'inicio', // inicio, tipo, marca, modelo, version, anio, cobertura, datos, telefono
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
    tipos: [],
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

  // Cargar tipos al abrir
  useEffect(() => {
    if (isOpen && cache.tipos.length === 0) {
      fetchTipos();
    }
  }, [isOpen]);

  // ==================== LLAMADAS AL BACKEND ====================

  const fetchTipos = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/acara/tipos`);
      const data = await res.json();
      setCache(prev => ({ ...prev, tipos: data }));
    } catch (err) {
      console.error('Error fetching tipos:', err);
    }
  };

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
          nombre: leadData.nombre,
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

  // ==================== TRACKING ====================

  const handleOpen = () => {
    setIsOpen(true);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'bot_opened', { event_category: 'engagement', event_label: 'chatbot' });
    }
  };

  // ==================== PROCESAMIENTO DE MENSAJES ====================

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const processMessage = async (userMessage) => {
    const msg = userMessage.toLowerCase().trim();

    // ========== PASO: INICIO - Selección de tipo ==========
    if (cotizacion.step === 'inicio') {
      if (msg.includes('auto') || msg.includes('coche') || msg === '1') {
        setCotizacion(prev => ({ ...prev, step: 'marca', tipo: 'auto' }));
        setIsTyping(true);
        const marcas = await fetchMarcas('auto');
        setIsTyping(false);
        
        if (marcas.length > 0) {
          const lista = marcas.slice(0, 15).map(m => `• ${m.marca}`).join('\n');
          addMessage('assistant', `🚗 ¡Perfecto! Seguro de auto.\n\n¿Cuál es la marca?\n\n${lista}\n\n${marcas.length > 15 ? `...y ${marcas.length - 15} más. Escribí la marca.` : ''}`);
        } else {
          addMessage('assistant', '🚗 ¡Perfecto! Seguro de auto.\n\n¿Cuál es la marca de tu vehículo? (ej: Ford, Toyota, Fiat)');
        }
        return;
      }
      
      if (msg.includes('moto') || msg === '2') {
        setCotizacion(prev => ({ ...prev, step: 'marca', tipo: 'moto' }));
        setIsTyping(true);
        const marcas = await fetchMarcas('moto');
        setIsTyping(false);
        
        if (marcas.length > 0) {
          const lista = marcas.slice(0, 15).map(m => `• ${m.marca}`).join('\n');
          addMessage('assistant', `🏍️ ¡Genial! Seguro de moto.\n\n¿Cuál es la marca?\n\n${lista}\n\n${marcas.length > 15 ? `...y ${marcas.length - 15} más. Escribí la marca.` : ''}`);
        } else {
          addMessage('assistant', '🏍️ ¡Genial! Seguro de moto.\n\n¿Cuál es la marca? (ej: Honda, Yamaha, Zanella)');
        }
        return;
      }
      
      if (msg.includes('camioneta') || msg.includes('pickup') || msg === '3') {
        setCotizacion(prev => ({ ...prev, step: 'marca', tipo: 'camioneta' }));
        setIsTyping(true);
        const marcas = await fetchMarcas('camioneta');
        setIsTyping(false);
        
        if (marcas.length > 0) {
          const lista = marcas.slice(0, 15).map(m => `• ${m.marca}`).join('\n');
          addMessage('assistant', `🚐 ¡Perfecto! Seguro de camioneta.\n\n¿Cuál es la marca?\n\n${lista}`);
        } else {
          addMessage('assistant', '🚐 ¡Perfecto! Seguro de camioneta.\n\n¿Cuál es la marca? (ej: Toyota, Ford, Volkswagen)');
        }
        return;
      }
      
      if (msg.includes('hogar') || msg.includes('casa') || msg.includes('depto') || msg === '4') {
        addMessage('assistant', '🏠 ¡Excelente! Para seguro de hogar, te contactamos directamente.\n\n¿Cuál es tu nombre y teléfono?\n\nEj: Juan Pérez, 341 555-1234');
        setCotizacion(prev => ({ ...prev, step: 'datos', tipo: 'hogar' }));
        return;
      }

      // No entendió
      addMessage('assistant', 'No entendí. ¿Qué tipo de seguro necesitás?\n\n🚗 Auto\n🏍️ Moto\n🚐 Camioneta\n🏠 Hogar');
      return;
    }

    // ========== PASO: MARCA ==========
    if (cotizacion.step === 'marca') {
      // Buscar marca en cache
      const marcaEncontrada = cache.marcas.find(m => 
        m.marca.toLowerCase() === msg || 
        m.marca.toLowerCase().includes(msg) ||
        msg.includes(m.marca.toLowerCase())
      );

      if (marcaEncontrada) {
        setCotizacion(prev => ({ ...prev, step: 'modelo', marca: marcaEncontrada.marca }));
        setIsTyping(true);
        const modelos = await fetchModelos(cotizacion.tipo, marcaEncontrada.marca);
        setIsTyping(false);

        if (modelos.length > 0) {
          const lista = modelos.slice(0, 12).map(m => `• ${m.modelo}`).join('\n');
          addMessage('assistant', `✅ ${marcaEncontrada.marca}\n\n¿Cuál es el modelo?\n\n${lista}\n\n${modelos.length > 12 ? `...y ${modelos.length - 12} más.` : ''}`);
        } else {
          addMessage('assistant', `✅ ${marcaEncontrada.marca}\n\n¿Cuál es el modelo?`);
        }
      } else {
        addMessage('assistant', `No encontré "${userMessage}" en nuestra base.\n\n¿Podés escribir la marca correctamente? O escribí "marcas" para ver la lista.`);
      }
      return;
    }

    // ========== PASO: MODELO ==========
    if (cotizacion.step === 'modelo') {
      const modeloEncontrado = cache.modelos.find(m => 
        m.modelo.toLowerCase() === msg || 
        m.modelo.toLowerCase().includes(msg) ||
        msg.includes(m.modelo.toLowerCase())
      );

      if (modeloEncontrado) {
        setCotizacion(prev => ({ ...prev, step: 'version', modelo: modeloEncontrado.modelo }));
        setIsTyping(true);
        const versiones = await fetchVersiones(cotizacion.tipo, cotizacion.marca, modeloEncontrado.modelo);
        setIsTyping(false);

        if (versiones.length > 0) {
          const lista = versiones.slice(0, 10).map(v => `• ${v.version}`).join('\n');
          addMessage('assistant', `✅ ${cotizacion.marca} ${modeloEncontrado.modelo}\n\n¿Cuál es la versión?\n\n${lista}\n\n${versiones.length > 10 ? `...y ${versiones.length - 10} más.` : ''}\n\nO escribí "cualquiera" si no sabés.`);
        } else {
          addMessage('assistant', `✅ ${cotizacion.marca} ${modeloEncontrado.modelo}\n\n¿Cuál es el año del vehículo?`);
          setCotizacion(prev => ({ ...prev, step: 'anio', version: 'N/A' }));
        }
      } else {
        addMessage('assistant', `No encontré "${userMessage}".\n\n¿Podés escribir el modelo correctamente?`);
      }
      return;
    }

    // ========== PASO: VERSION ==========
    if (cotizacion.step === 'version') {
      let versionSeleccionada = userMessage;
      
      if (msg === 'cualquiera' || msg === 'no se' || msg === 'no sé') {
        versionSeleccionada = cache.versiones[0]?.version || 'Base';
      } else {
        const versionEncontrada = cache.versiones.find(v => 
          v.version.toLowerCase().includes(msg) || msg.includes(v.version.toLowerCase().substring(0, 10))
        );
        if (versionEncontrada) {
          versionSeleccionada = versionEncontrada.version;
        }
      }

      setCotizacion(prev => ({ ...prev, step: 'anio', version: versionSeleccionada }));
      addMessage('assistant', `✅ ${cotizacion.marca} ${cotizacion.modelo} ${versionSeleccionada.substring(0, 30)}...\n\n¿De qué año es? (ej: 2022)`);
      return;
    }

    // ========== PASO: AÑO ==========
    if (cotizacion.step === 'anio') {
      const anioMatch = msg.match(/\d{4}/);
      if (anioMatch) {
        const anio = anioMatch[0];
        setCotizacion(prev => ({ ...prev, step: 'cobertura', anio }));
        addMessage('assistant', `✅ ${cotizacion.marca} ${cotizacion.modelo} ${anio}\n\n¿Qué cobertura te interesa?\n\n1️⃣ Responsabilidad Civil (RC)\n2️⃣ Terceros Completo\n3️⃣ Todo Riesgo`);
      } else {
        addMessage('assistant', 'Por favor, escribí el año (ej: 2020, 2023)');
      }
      return;
    }

    // ========== PASO: COBERTURA ==========
    if (cotizacion.step === 'cobertura') {
      let cobertura = 'terceros_completo';
      
      if (msg.includes('rc') || msg.includes('civil') || msg === '1') {
        cobertura = 'responsabilidad_civil';
      } else if (msg.includes('completo') || msg.includes('terceros') || msg === '2') {
        cobertura = 'terceros_completo';
      } else if (msg.includes('todo') || msg.includes('riesgo') || msg === '3') {
        cobertura = 'todo_riesgo';
      }

      setCotizacion(prev => ({ ...prev, step: 'datos', cobertura }));
      
      const coberturaTexto = {
        'responsabilidad_civil': 'Responsabilidad Civil',
        'terceros_completo': 'Terceros Completo',
        'todo_riesgo': 'Todo Riesgo'
      }[cobertura];

      addMessage('assistant', `✅ ${cotizacion.marca} ${cotizacion.modelo} ${cotizacion.anio}\n📋 Cobertura: ${coberturaTexto}\n\n¡Casi listo! Para enviarte la cotización, necesito:\n\n👤 Tu nombre y 📱 teléfono\n\nEj: Juan Pérez, 341 555-1234`);
      return;
    }

    // ========== PASO: DATOS (nombre + teléfono) ==========
    if (cotizacion.step === 'datos') {
      // Extraer teléfono
      const telMatch = msg.match(/[\d\s\-]{7,}/);
      
      if (telMatch) {
        const telefono = telMatch[0].replace(/\D/g, '');
        const nombre = userMessage.replace(telMatch[0], '').replace(/[,.-]/g, '').trim() || 'Cliente';
        
        setCotizacion(prev => ({ ...prev, nombre, telefono }));
        
        setIsTyping(true);
        
        // Guardar lead en el backend
        const leadData = {
          ...cotizacion,
          nombre,
          telefono
        };
        await guardarLead(leadData);
        
        // Tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'lead_captured', { 
            event_category: 'conversion',
            event_label: cotizacion.tipo,
            value: 1
          });
        }

        setIsTyping(false);
        
        // Resumen final
        const resumen = cotizacion.tipo === 'hogar' 
          ? `🏠 Seguro de Hogar`
          : `🚗 ${cotizacion.marca} ${cotizacion.modelo} ${cotizacion.anio}\n📋 ${cotizacion.cobertura?.replace('_', ' ')}`;

        addMessage('assistant', `✅ ¡Listo, ${nombre}!\n\n📋 Resumen:\n${resumen}\n📱 Tel: ${telefono}\n\n⏰ Te contactamos en menos de 2 horas.\n\n¿Querés que te llamemos por WhatsApp? 👇`);
        
        // Resetear para nueva cotización
        setTimeout(() => {
          setCotizacion({
            step: 'fin',
            tipo: null, marca: null, modelo: null, version: null, anio: null, cobertura: null, nombre: null, telefono: null
          });
        }, 1000);
      } else {
        addMessage('assistant', 'No detecté un teléfono válido.\n\nPor favor escribí tu nombre y teléfono.\nEj: María García, 341 555-1234');
      }
      return;
    }

    // ========== PASO: FIN o conversación general ==========
    if (cotizacion.step === 'fin') {
      if (msg.includes('otra') || msg.includes('nuevo') || msg.includes('cotizar')) {
        setCotizacion({
          step: 'inicio',
          tipo: null, marca: null, modelo: null, version: null, anio: null, cobertura: null, nombre: null, telefono: null
        });
        addMessage('assistant', '¡Perfecto! Empecemos de nuevo.\n\n¿Qué tipo de seguro te interesa?\n\n🚗 Auto\n🏍️ Moto\n🚐 Camioneta\n🏠 Hogar');
        return;
      }
    }

    // Respuestas generales
    if (msg.includes('contacto') || msg.includes('telefono') || msg.includes('whatsapp')) {
      addMessage('assistant', `📞 Nuestros canales:\n\n• WhatsApp: 341 695-2259\n• Tel Rosario: 341 695-2259\n• Tel CABA: 11 5302-2929\n• Email: aymaseguros@hotmail.com`);
      return;
    }

    if (msg.includes('gracias')) {
      addMessage('assistant', '¡De nada! 😊 ¿Necesitás algo más?');
      return;
    }

    // Default
    addMessage('assistant', '¿Querés cotizar un seguro? Escribí:\n\n🚗 Auto\n🏍️ Moto\n🚐 Camioneta\n🏠 Hogar\n\nO contactanos por WhatsApp 👇');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsTyping(true);

    await processMessage(userMessage);
    
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWhatsApp = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'chatbot_whatsapp' });
    }
    
    let mensaje = 'Hola! Vengo del chatbot de la web.';
    if (cotizacion.marca && cotizacion.modelo) {
      mensaje = `Hola! Quiero cotizar: ${cotizacion.marca} ${cotizacion.modelo} ${cotizacion.anio || ''} - ${cotizacion.cobertura || 'Terceros Completo'}`;
    }
    
    window.open(`https://wa.me/${WHATSAPP_ROSARIO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed top-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all z-50 group"
          aria-label="Abrir chat"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            ¿Necesitás ayuda?
          </span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* VENTANA CHAT */}
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
                <p className="text-xs text-blue-100">🟢 En línea · Cotizá en 2 min</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition p-1" aria-label="Cerrar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
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
              {cotizacion.step === 'inicio' && (
                <>
                  <button onClick={() => { setInput('Auto'); handleSend(); }} className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition">🚗 Auto</button>
                  <button onClick={() => { setInput('Moto'); handleSend(); }} className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition">🏍️ Moto</button>
                  <button onClick={() => { setInput('Camioneta'); handleSend(); }} className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition">🚐 Camioneta</button>
                </>
              )}
              <button onClick={handleWhatsApp} className="flex-shrink-0 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition">💬 WhatsApp</button>
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
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                aria-label="Enviar"
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
