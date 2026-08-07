// src/components/ChatBot.jsx
// ChatBot AYMA - Versión TRIPLE RESPALDO
// Todas las acciones van al Worker → KV + PG + Sheets
// Fecha: 6 Dic 2025

import { useState, useRef, useEffect } from 'react';
import { tokenizar, TIPOS } from '../utils/tokenVault';

const BACKEND_URL = 'https://ayma-portal-backend.onrender.com/api/v1';
const WHATSAPP_ROSARIO = '5493416952259';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [sessionToken, setSessionToken] = useState(null);

  const [flujo, setFlujo] = useState({
    modo: 'inicio',
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

  // ==================== REGISTRO VÍA WORKER ====================
  const registrarAccion = async (tipoAccion, datos = {}) => {
    const result = await tokenizar(TIPOS.BOT_ACTION, {
      accion: tipoAccion,
      session_token: sessionToken,
      ...datos
    }, 'chatbot');
    return result.token;
  };

  // Mensaje inicial al abrir
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      (async () => {
        // Generar sesión vía Worker
        const sessionResult = await tokenizar(TIPOS.BOT_SESSION, {
          evento: 'apertura_bot'
        }, 'chatbot');
        
        const newSessionToken = sessionResult.token || `LOCAL-${Date.now()}`;
        setSessionToken(newSessionToken);

        setMessages([{
          role: 'assistant',
          content: `¡Hola! 👋 Soy el asistente de AYMA Advisors.

¿En qué puedo ayudarte?

1️⃣ Cotizar seguro de vehículo
2️⃣ Consultar sobre coberturas
3️⃣ Hablar con un ejecutivo

Escribí el número o lo que necesitás.`,
          token: newSessionToken
        }]);
      })();
    }
  }, [isOpen, messages.length]);

  // ==================== LLAMADAS AL BACKEND ====================
  const fetchMarcas = async (tipo) => {
    await registrarAccion('FETCH_MARCAS', { tipo });
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
    await registrarAccion('FETCH_MODELOS', { tipo, marca });
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
    await registrarAccion('FETCH_VERSIONES', { tipo, marca, modelo });
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
    // Tokenizar cotización completa
    const cotResult = await tokenizar(TIPOS.COT_AUTO, {
      vehiculo: `${leadData.marca} ${leadData.modelo} ${leadData.anio}`,
      tipo: leadData.tipo,
      marca: leadData.marca,
      modelo: leadData.modelo,
      version: leadData.version,
      anio: leadData.anio,
      cobertura: leadData.cobertura,
      nombre: leadData.nombre,
      telefono: leadData.telefono,
      session_token: sessionToken
    }, 'chatbot');

    try {
      const res = await fetch(`${BACKEND_URL}/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: leadData.nombre || 'Cliente Web',
          telefono: leadData.telefono,
          tipo_seguro: leadData.tipo || 'auto',
          vehiculo_tipo: leadData.tipo,
          vehiculo_marca: leadData.marca,
          vehiculo_modelo: leadData.modelo,
          vehiculo_version: leadData.version,
          vehiculo_anio: leadData.anio,
          cobertura: leadData.cobertura,
          origen: 'chatbot',
          session_token: sessionToken,
          vault_token: cotResult.token,
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        })
      });
      const data = await res.json();
      console.log('✅ Lead guardado:', data);
      return { ...data, vault_token: cotResult.token };
    } catch (err) {
      console.error('Error guardando lead:', err);
      return { vault_token: cotResult.token };
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = async () => {
    await registrarAccion('BOT_CERRADO', { 
      session_token: sessionToken
    });
    setIsOpen(false);
  };

  const addResponse = (content, extraData = {}) => {
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content,
      ...extraData
    }]);
    setIsTyping(false);
  };

  const abrirWhatsApp = async (mensaje = 'Hola! Vengo del chatbot de la web') => {
    await tokenizar(TIPOS.WA_CLICK, {
      mensaje_preview: mensaje.substring(0, 50),
      vehiculo: flujo.marca ? `${flujo.marca} ${flujo.modelo}` : null,
      session_token: sessionToken
    }, 'chatbot');
    
    window.open(`https://wa.me/${WHATSAPP_ROSARIO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    await registrarAccion('MENSAJE_USUARIO', { 
      mensaje: userMessage,
      step_actual: flujo.step,
      modo_actual: flujo.modo
    });

    const lowerMessage = userMessage.toLowerCase();

    // ==================== FLUJO INICIAL ====================
    if (flujo.modo === 'inicio') {
      if (lowerMessage === '1' || lowerMessage.includes('cotiz') || lowerMessage.includes('precio') || lowerMessage.includes('cuanto')) {
        await registrarAccion('INICIO_COTIZACION', { origen: 'menu_principal' });
        setFlujo(prev => ({ ...prev, modo: 'cotizar', step: 'tipo' }));
        addResponse(`¡Perfecto! Vamos a cotizar tu seguro.

¿Qué tipo de vehículo es?

🚗 Auto
🏍️ Moto
🚙 Camioneta

Escribí el tipo.`);
        return;
      }
      
      if (lowerMessage === '2' || lowerMessage.includes('cobertura') || lowerMessage.includes('consulta') || lowerMessage.includes('info')) {
        await tokenizar(TIPOS.CONSULTA, { consulta: 'coberturas' }, 'chatbot');
        setFlujo(prev => ({ ...prev, modo: 'consulta' }));
        addResponse(`Te cuento sobre nuestras coberturas:

🚗 **VEHÍCULOS:**
- RC (Responsabilidad Civil): Lo básico obligatorio
- Terceros Completo: RC + Robo + Incendio + Granizo
- Todo Riesgo: Cobertura total incluyendo daños propios

🏠 **HOGAR:**
- Incendio, robo, RC, daños por agua

🏢 **EMPRESAS:**
- ART, Vida Patronal, RC Comercial

¿Querés cotizar alguno o hablamos por WhatsApp?`);
        return;
      }
      
      if (lowerMessage === '3' || lowerMessage.includes('ejecutivo') || lowerMessage.includes('hablar') || lowerMessage.includes('persona') || lowerMessage.includes('whatsapp')) {
        await registrarAccion('SOLICITUD_EJECUTIVO', {});
        addResponse(`¡Por supuesto! Te conecto con un asesor.

📞 WhatsApp: 341 695-2259
📧 Email: aymaseguros@hotmail.com

¿Te abro WhatsApp ahora?`);
        setTimeout(() => abrirWhatsApp(), 2000);
        return;
      }

      if (lowerMessage.includes('auto') || lowerMessage.includes('moto') || lowerMessage.includes('camioneta')) {
        await registrarAccion('INICIO_COTIZACION', { origen: 'directo', tipo_detectado: lowerMessage });
        setFlujo(prev => ({ ...prev, modo: 'cotizar', step: 'tipo' }));
      } else {
        await registrarAccion('MENSAJE_NO_ENTENDIDO', { mensaje: userMessage });
        addResponse(`No entendí bien. ¿Qué necesitás?

1️⃣ Cotizar seguro de vehículo
2️⃣ Consultar sobre coberturas  
3️⃣ Hablar con un ejecutivo

Escribí el número.`);
        return;
      }
    }

    // ==================== FLUJO COTIZAR ====================
    if (flujo.modo === 'cotizar') {
      
      if (flujo.step === 'tipo') {
        let tipoVehiculo = null;
        
        if (lowerMessage.includes('auto') || lowerMessage.includes('coche')) {
          tipoVehiculo = 'auto';
        } else if (lowerMessage.includes('moto')) {
          tipoVehiculo = 'moto';
        } else if (lowerMessage.includes('camioneta') || lowerMessage.includes('pickup') || lowerMessage.includes('utilitario')) {
          tipoVehiculo = 'camioneta';
        }
        
        if (tipoVehiculo) {
          await registrarAccion('TIPO_SELECCIONADO', { tipo: tipoVehiculo });
          setFlujo(prev => ({ ...prev, step: 'marca', tipo: tipoVehiculo }));
          const marcas = await fetchMarcas(tipoVehiculo);
          const lista = marcas.slice(0, 12).map(m => m.marca).join(', ');
          
          const iconos = { auto: '🚗', moto: '🏍️', camioneta: '🚙' };
          addResponse(`${iconos[tipoVehiculo]} ${tipoVehiculo.charAt(0).toUpperCase() + tipoVehiculo.slice(1)}, perfecto!

¿Cuál es la marca?

Marcas populares: ${lista}

Escribí la marca.`);
          return;
        }
        
        addResponse(`¿Qué tipo de vehículo es?

🚗 Auto
🏍️ Moto
🚙 Camioneta`);
        return;
      }

      if (flujo.step === 'marca') {
        let marcaEncontrada = cache.marcas.find(m => 
          m.marca.toLowerCase() === lowerMessage || 
          m.marca.toLowerCase().includes(lowerMessage) ||
          lowerMessage.includes(m.marca.toLowerCase())
        );

        if (!marcaEncontrada) {
          const marcasComunes = ['ford', 'chevrolet', 'toyota', 'fiat', 'volkswagen', 'renault', 'peugeot', 'honda', 'yamaha', 'suzuki', 'bmw', 'audi', 'mercedes', 'nissan', 'hyundai', 'kia'];
          const marcaComun = marcasComunes.find(m => lowerMessage.includes(m));
          if (marcaComun) {
            marcaEncontrada = { marca: marcaComun.toUpperCase() };
          }
        }

        if (marcaEncontrada) {
          await registrarAccion('MARCA_SELECCIONADA', { marca: marcaEncontrada.marca, tipo: flujo.tipo });
          setFlujo(prev => ({ ...prev, step: 'modelo', marca: marcaEncontrada.marca }));
          const modelos = await fetchModelos(flujo.tipo, marcaEncontrada.marca);
          
          if (modelos.length > 0) {
            const lista = modelos.slice(0, 10).map(m => m.modelo).join(', ');
            addResponse(`✅ ${marcaEncontrada.marca}

¿Cuál es el modelo?

Modelos: ${lista}${modelos.length > 10 ? ` (+${modelos.length - 10} más)` : ''}

Escribí el modelo.`);
          } else {
            addResponse(`✅ ${marcaEncontrada.marca}

¿Cuál es el modelo? (ej: Corolla, Focus, Gol)`);
          }
          return;
        }
        
        await registrarAccion('MARCA_NO_ENCONTRADA', { input: userMessage });
        addResponse(`No encontré "${userMessage}" en la base.

Escribí la marca correctamente o probá con otra.
Ej: Ford, Toyota, Fiat, Volkswagen`);
        return;
      }

      if (flujo.step === 'modelo') {
        let modeloEncontrado = cache.modelos.find(m => 
          m.modelo.toLowerCase() === lowerMessage || 
          m.modelo.toLowerCase().includes(lowerMessage) ||
          lowerMessage.includes(m.modelo.toLowerCase())
        );

        const modeloFinal = modeloEncontrado ? modeloEncontrado.modelo : userMessage.toUpperCase();
        
        await registrarAccion('MODELO_SELECCIONADO', { 
          modelo: modeloFinal, 
          marca: flujo.marca,
          encontrado_en_acara: !!modeloEncontrado
        });
        
        setFlujo(prev => ({ ...prev, step: 'anio', modelo: modeloFinal }));
        addResponse(`✅ ${flujo.marca} ${modeloFinal}

¿De qué año es?

Escribí el año (ej: 2020, 2023)`);
        return;
      }

      if (flujo.step === 'anio') {
        const anioMatch = lowerMessage.match(/\d{4}/);
        if (anioMatch) {
          const anio = anioMatch[0];
          const anioNum = parseInt(anio);
          const anioActual = new Date().getFullYear();
          
          if (anioNum < 1990 || anioNum > anioActual + 1) {
            await registrarAccion('ANIO_INVALIDO', { input: anio });
            addResponse(`El año ${anio} no parece válido.

Escribí un año entre 1990 y ${anioActual + 1}.`);
            return;
          }
          
          await registrarAccion('ANIO_SELECCIONADO', { 
            anio, 
            vehiculo: `${flujo.marca} ${flujo.modelo}`
          });
          
          setFlujo(prev => ({ ...prev, step: 'cobertura', anio }));
          addResponse(`✅ ${flujo.marca} ${flujo.modelo} ${anio}

¿Qué cobertura te interesa?

1️⃣ Responsabilidad Civil (RC) - Lo básico
2️⃣ Terceros Completo - RC + Robo + Incendio
3️⃣ Todo Riesgo - Cobertura total

Escribí 1, 2 o 3.`);
          return;
        }
        
        await registrarAccion('ANIO_NO_DETECTADO', { input: userMessage });
        addResponse(`No detecté un año válido.

Escribí el año (ej: 2020, 2022, 2024)`);
        return;
      }

      if (flujo.step === 'cobertura') {
        let cobertura = 'terceros_completo';
        let coberturaTexto = 'Terceros Completo';
        
        if (lowerMessage === '1' || lowerMessage.includes('rc') || lowerMessage.includes('civil') || lowerMessage.includes('básic')) {
          cobertura = 'responsabilidad_civil';
          coberturaTexto = 'Responsabilidad Civil';
        } else if (lowerMessage === '3' || lowerMessage.includes('todo') || lowerMessage.includes('riesgo') || lowerMessage.includes('total')) {
          cobertura = 'todo_riesgo';
          coberturaTexto = 'Todo Riesgo';
        }

        await registrarAccion('COBERTURA_SELECCIONADA', { 
          cobertura,
          vehiculo: `${flujo.marca} ${flujo.modelo} ${flujo.anio}`
        });

        setFlujo(prev => ({ ...prev, step: 'nombre', cobertura }));
        addResponse(`✅ Cobertura: ${coberturaTexto}

📋 Resumen:
🚗 ${flujo.marca} ${flujo.modelo} ${flujo.anio}
📄 ${coberturaTexto}

¡Último paso! ¿Cómo te llamás?`);
        return;
      }

      if (flujo.step === 'nombre') {
        await registrarAccion('NOMBRE_INGRESADO', { nombre: userMessage });
        setFlujo(prev => ({ ...prev, step: 'telefono', nombre: userMessage }));
        addResponse(`✅ Gracias ${userMessage}!

¿Cuál es tu teléfono o WhatsApp?

(ej: 341 555-1234)`);
        return;
      }

      if (flujo.step === 'telefono') {
        const telMatch = lowerMessage.match(/[\d\s\-]{7,}/);
        if (telMatch) {
          const telefono = telMatch[0].replace(/\D/g, '');
          
          const leadResult = await guardarLead({
            ...flujo,
            telefono
          });

          const coberturaTexto = {
            'responsabilidad_civil': 'Responsabilidad Civil',
            'terceros_completo': 'Terceros Completo',
            'todo_riesgo': 'Todo Riesgo'
          }[flujo.cobertura] || flujo.cobertura;

          const flujoAnterior = { ...flujo };
          setFlujo({
            modo: 'fin',
            step: 'fin',
            tipo: null, marca: null, modelo: null, version: null, anio: null, cobertura: null, nombre: null, telefono: null
          });

          addResponse(`🎉 ¡Listo ${flujoAnterior.nombre}!

📋 Tu solicitud:
🚗 ${flujoAnterior.marca} ${flujoAnterior.modelo} ${flujoAnterior.anio}
📄 ${coberturaTexto}
📱 ${telefono}
🔖 Ref: ${leadResult?.vault_token || sessionToken}

⏰ Te contactamos en menos de 2 horas con las mejores opciones.

¿Querés que te escribamos por WhatsApp ahora?`);
          
          return;
        }
        
        await registrarAccion('TELEFONO_INVALIDO', { input: userMessage });
        addResponse(`No detecté un teléfono válido.

Escribí tu número.
Ej: 341 555-1234`);
        return;
      }
    }

    // ==================== FLUJO CONSULTA ====================
    if (flujo.modo === 'consulta') {
      if (lowerMessage.includes('cotiz') || lowerMessage.includes('si') || lowerMessage.includes('quiero')) {
        await registrarAccion('CONSULTA_A_COTIZACION', {});
        setFlujo({ ...flujo, modo: 'cotizar', step: 'tipo' });
        addResponse(`¡Dale! ¿Qué tipo de vehículo querés cotizar?

🚗 Auto
🏍️ Moto
🚙 Camioneta`);
        return;
      }
      
      if (lowerMessage.includes('whatsapp') || lowerMessage.includes('hablar')) {
        abrirWhatsApp('Hola! Tengo consultas sobre coberturas');
        addResponse('¡Te abrí WhatsApp! Un asesor te va a atender.');
        return;
      }
      
      addResponse(`¿Qué querés hacer?

1️⃣ Cotizar un vehículo
2️⃣ Hablar por WhatsApp`);
      return;
    }

    // ==================== RESPUESTAS GENERALES ====================
    
    if (flujo.modo === 'fin') {
      if (lowerMessage.includes('otra') || lowerMessage.includes('nuevo') || lowerMessage.includes('cotizar') || lowerMessage.includes('si')) {
        await registrarAccion('NUEVA_COTIZACION', {});
        setFlujo({
          modo: 'cotizar',
          step: 'tipo',
          tipo: null, marca: null, modelo: null, version: null, anio: null, cobertura: null, nombre: null, telefono: null
        });
        addResponse(`¡Dale! Nueva cotización.

¿Qué tipo de vehículo?

🚗 Auto
🏍️ Moto
🚙 Camioneta`);
        return;
      }
      
      if (lowerMessage.includes('whatsapp')) {
        const mensaje = `Hola! Acabo de solicitar cotización (Ref: ${sessionToken})`;
        abrirWhatsApp(mensaje);
        addResponse('¡Te abrí WhatsApp! Ya te contactamos.');
        return;
      }
      
      addResponse(`¡Gracias por elegirnos! 😊

¿Necesitás algo más?
- Escribí "cotizar" para otra cotización
- Escribí "whatsapp" para hablar con un asesor`);
      return;
    }

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage.includes('buen dia')) {
      await registrarAccion('SALUDO', {});
      addResponse(`¡Hola! 👋 ¿Cómo estás?

¿En qué puedo ayudarte?

1️⃣ Cotizar seguro de vehículo
2️⃣ Consultar sobre coberturas
3️⃣ Hablar con un ejecutivo`);
      setFlujo({ ...flujo, modo: 'inicio' });
      return;
    }

    if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('llamar')) {
      await registrarAccion('CONSULTA_CONTACTO', {});
      addResponse(`📞 Nuestros canales:

- WhatsApp: 341 695-2259
- Teléfono Rosario: 341 695-2259
- Teléfono CABA: 341 695-2259
- Email: aymaseguros@hotmail.com

¿Te abro WhatsApp?`);
      return;
    }

    if (lowerMessage.includes('gracias') || lowerMessage.includes('genial') || lowerMessage.includes('perfecto')) {
      await registrarAccion('AGRADECIMIENTO', {});
      addResponse(`¡De nada! 😊 

¿Hay algo más en lo que pueda ayudarte?`);
      return;
    }

    await registrarAccion('MENSAJE_NO_ENTENDIDO', { mensaje: userMessage });
    addResponse(`No entendí bien. ¿Qué necesitás?

1️⃣ Cotizar seguro de vehículo
2️⃣ Consultar sobre coberturas
3️⃣ Hablar con un ejecutivo

Escribí el número o lo que necesitás.`);
    setFlujo({ ...flujo, modo: 'inicio' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWhatsAppButton = () => {
    let mensaje = 'Hola! Vengo del chatbot de la web';
    if (flujo.marca && flujo.modelo) {
      mensaje = `Hola! Quiero cotizar: ${flujo.marca} ${flujo.modelo} ${flujo.anio || ''} - ${flujo.cobertura || 'Terceros Completo'} (Ref: ${sessionToken})`;
    }
    abrirWhatsApp(mensaje);
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed top-24 left-4 z-50">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full tracking-wider">ATENCIÓN</span>
          <button
            onClick={handleOpen}
            className="bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all group"
            aria-label="Abrir chat"
          >
            <img src="/LOGO_AYMA_II.png" alt="AYMA" className="w-12 h-12 rounded-full object-cover" />
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">¿Necesitás ayuda?</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full tracking-wider">24HS</span>
        </div>
      )}

      {isOpen && (
        <div className="fixed top-6 left-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[500px] overflow-hidden border border-gray-200">
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/LOGO_AYMA_II.png" alt="AYMA" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold">AYMA Advisors</h3>
                <p className="text-xs text-blue-100">🟢 En línea · {sessionToken?.slice(-8) || ''}</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition p-1"
              aria-label="Cerrar chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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

          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button 
                onClick={async () => {
                  await registrarAccion('BOTON_RAPIDO_COTIZAR', {});
                  setFlujo({ ...flujo, modo: 'cotizar', step: 'tipo' });
                  setMessages(prev => [...prev, 
                    { role: 'user', content: 'Quiero cotizar' },
                    { role: 'assistant', content: '¡Perfecto! ¿Qué tipo de vehículo?\n\n🚗 Auto\n🏍️ Moto\n🚙 Camioneta' }
                  ]);
                }}
                className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                🚗 Cotizar
              </button>
              <button 
                onClick={async () => {
                  await tokenizar(TIPOS.CONSULTA, { consulta: 'coberturas_boton' }, 'chatbot');
                  setFlujo({ ...flujo, modo: 'consulta' });
                  setMessages(prev => [...prev,
                    { role: 'user', content: 'Consulta sobre coberturas' },
                    { role: 'assistant', content: 'Te cuento sobre nuestras coberturas:\n\n🚗 VEHÍCULOS:\n• RC: Lo básico obligatorio\n• Terceros Completo: RC + Robo + Incendio\n• Todo Riesgo: Cobertura total\n\n¿Querés cotizar alguno?' }
                  ]);
                }}
                className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
              >
                📋 Coberturas
              </button>
              <button 
                onClick={handleWhatsAppButton}
                className="flex-shrink-0 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition"
              >
                💬 WhatsApp
              </button>
            </div>
          </div>

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
