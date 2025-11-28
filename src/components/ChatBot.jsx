import { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! 👋 Soy el asistente de AYMA. ¿En qué puedo ayudarte?\n\n• Cotizar seguro de auto\n• Cotizar seguro de hogar\n• Consultas sobre coberturas' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    if (typeof gtag !== 'undefined') gtag('event', 'bot_opened', { event_category: 'engagement' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    setTimeout(() => {
      let response = 'Para darte la mejor atención, usá el formulario de cotización arriba 👆 o contactanos por WhatsApp al 341 530-2929';
      const lower = userMessage.toLowerCase();
      if (lower.includes('cotiz') || lower.includes('precio')) response = '¡Perfecto! Usá el formulario de arriba 👆 para cotizar. Es súper rápido.';
      else if (lower.includes('contacto') || lower.includes('telefono')) response = '📞 Rosario: 341 695-2259\n📞 CABA: 11 5302-2929\n💬 WhatsApp: 341 530-2929';
      else if (lower.includes('hola') || lower.includes('buenas')) response = '¡Hola! 👋 ¿En qué puedo ayudarte? Podés cotizar tu seguro con el formulario de arriba.';
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  const handleWhatsApp = () => {
    if (typeof gtag !== 'undefined') gtag('event', 'whatsapp_click', { event_category: 'engagement' });
    window.open('https://wa.me/5493415302929?text=Hola! Vengo del chatbot', '_blank');
  };

  return (
    <>
      {!isOpen && (
        <button onClick={handleOpen} className="fixed top-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all z-50 group" aria-label="Abrir chat">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">¿Necesitás ayuda?</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}
      {isOpen && (
        <div className="fixed top-6 left-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[500px] overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div><h3 className="font-bold">AYMA Advisors</h3><p className="text-xs text-blue-100">🟢 En línea</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white text-gray-800 shadow-sm border rounded-bl-md'}`}>{msg.content}</div></div>))}
            {isTyping && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl shadow-sm border"><div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span></div></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-4 py-2 bg-white border-t"><div className="flex gap-2 overflow-x-auto pb-2"><button onClick={() => { setInput('Cotizar auto'); }} className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full">🚗 Cotizar auto</button><button onClick={handleWhatsApp} className="flex-shrink-0 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full">💬 WhatsApp</button></div></div>
          <div className="p-3 bg-white border-t"><div className="flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Escribí tu mensaje..." className="flex-1 px-4 py-2.5 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /><button onClick={handleSend} disabled={!input.trim()} className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button></div></div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
