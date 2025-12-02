// src/components/ChatBot.jsx
// ChatBot AYMA - Posición: ARRIBA IZQUIERDA (confirmado por Sebastián)

import { useState, useRef, useEffect } from 'react';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simular respuesta (reemplazar con IA real si querés)
    setTimeout(() => {
      let response = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('cotiz') || lowerMessage.includes('precio') || lowerMessage.includes('cuanto')) {
        response = '¡Perfecto! Para darte una cotización necesito algunos datos:\n\n🚗 ¿Qué tipo de vehículo querés asegurar?\n• Auto\n• Moto\n• Camioneta\n\nO si preferís, usá el formulario de arriba para cotizar directamente. 👆';
      } else if (lowerMessage.includes('auto') || lowerMessage.includes('coche') || lowerMessage.includes('vehiculo')) {
        response = '¡Genial! Para cotizar tu auto necesito:\n\n1️⃣ Marca (ej: Ford, Toyota)\n2️⃣ Modelo (ej: Focus, Corolla)\n3️⃣ Año\n4️⃣ ¿Qué cobertura te interesa?\n   • Responsabilidad Civil\n   • Terceros Completo\n   • Todo Riesgo\n\n¿Me pasás esos datos?';
      } else if (lowerMessage.includes('ford') || lowerMessage.includes('chevrolet') || lowerMessage.includes('toyota') || lowerMessage.includes('fiat') || lowerMessage.includes('volkswagen')) {
        response = `¡Excelente elección! Trabajamos con esa marca. 🚗\n\n¿Me decís el modelo y año? Así te paso las mejores opciones de cobertura.`;
      } else if (lowerMessage.includes('hogar') || lowerMessage.includes('casa') || lowerMessage.includes('departamento')) {
        response = 'Para el seguro de hogar te ofrecemos:\n\n🏠 **Cobertura básica:**\n• Incendio\n• Robo\n• Responsabilidad civil\n\n🏠 **Cobertura premium:**\n• Todo lo anterior +\n• Daños por agua\n• Cristales\n• Electrodomésticos\n\n¿Querés que te cotice? Necesito la dirección y valor aproximado del inmueble.';
      } else if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('llamar') || lowerMessage.includes('whatsapp')) {
        response = '📞 **Nuestros canales:**\n\n• WhatsApp: 341 530-2929\n• Teléfono Rosario: 341 695-2259\n• Teléfono CABA: 11 5302-2929\n• Email: aymaseguros@hotmail.com\n\n¿Querés que te contactemos nosotros?';
      } else if (lowerMessage.includes('gracias') || lowerMessage.includes('genial') || lowerMessage.includes('perfecto')) {
        response = '¡De nada! 😊 Estoy acá para lo que necesites.\n\n¿Hay algo más en lo que pueda ayudarte?';
      } else if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage.includes('buen dia')) {
        response = '¡Hola! 👋 ¿Cómo estás?\n\n¿En qué puedo ayudarte hoy? Podemos cotizar seguros de auto, hogar, vida o responder cualquier consulta que tengas.';
      } else {
        response = 'Entiendo tu consulta. Para darte la mejor atención, te sugiero:\n\n1️⃣ Usar el **formulario de cotización** arriba 👆\n2️⃣ O contactarnos por **WhatsApp** al 341 530-2929\n\n¿Hay algo específico sobre seguros que quieras saber?';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
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
    window.open('https://wa.me/5493416952259?text=Hola! Vengo del chatbot de la web', '_blank');
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
                  handleSend();
                }}
                className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                🚗 Cotizar auto
              </button>
              <button 
                onClick={() => {
                  setInput('Quiero cotizar seguro de hogar');
                  handleSend();
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
