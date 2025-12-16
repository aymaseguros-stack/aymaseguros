import { useState } from 'react';
import { tokenizar, TIPOS } from '../utils/tokenVault';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('auto');
  const [loading, setLoading] = useState(false);
  
  // Estados de formularios
  const [autoForm, setAutoForm] = useState({ tipo: '', marca: '', modelo: '', anio: '', nombre: '', telefono: '' });
  const [hogarForm, setHogarForm] = useState({ tipo: '', metros: '', ubicacion: '', nombre: '', telefono: '' });
  const [artForm, setArtForm] = useState({ empresa: '', empleados: '', actividad: '', nombre: '', telefono: '' });
  const [comercioForm, setComercioForm] = useState({ rubro: '', metros: '', ubicacion: '', nombre: '', telefono: '' });
  const [vidaForm, setVidaForm] = useState({ edad: '', cobertura: '', nombre: '', telefono: '' });

  const WHATSAPP = '5493416952259';

  const tabs = [
    { id: 'auto', icon: '/icons/icons500x500_vehiculo.png', label: 'Vehículo' },
    { id: 'hogar', icon: '/icons/icons500x500_vivienda.png', label: 'Hogar' },
    { id: 'art', icon: '/icons/seguroart.png', label: 'ART' },
    { id: 'comercio', icon: '/icons/seguros_integral.png', label: 'Comercio' },
    { id: 'vida', icon: '/icons/Segurodevida.png', label: 'Vida' },
  ];

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900";
  const selectClass = inputClass + " bg-white";
  const btnClass = "w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2";

  // ========== SUBMIT HANDLERS ==========

  const handleAutoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await tokenizar(TIPOS.COT_AUTO, {
      tipo_vehiculo: autoForm.tipo,
      marca: autoForm.marca,
      modelo: autoForm.modelo,
      anio: autoForm.anio,
      nombre: autoForm.nombre,
      telefono: autoForm.telefono
    }, 'hero_auto');

    const msg = `🚗 *COTIZACIÓN AUTO/MOTO*\n🔖 Ref: ${result.token}\n\n` +
      `Tipo: ${autoForm.tipo}\nMarca: ${autoForm.marca}\nModelo: ${autoForm.modelo}\nAño: ${autoForm.anio}\n\n` +
      `👤 ${autoForm.nombre}\n📱 ${autoForm.telefono}`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  const handleHogarSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await tokenizar(TIPOS.COT_HOGAR, {
      tipo_vivienda: hogarForm.tipo,
      metros: hogarForm.metros,
      ubicacion: hogarForm.ubicacion,
      nombre: hogarForm.nombre,
      telefono: hogarForm.telefono
    }, 'hero_hogar');

    const msg = `🏠 *COTIZACIÓN HOGAR*\n🔖 Ref: ${result.token}\n\n` +
      `Tipo: ${hogarForm.tipo}\nM²: ${hogarForm.metros}\nUbicación: ${hogarForm.ubicacion}\n\n` +
      `👤 ${hogarForm.nombre}\n📱 ${hogarForm.telefono}`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  const handleArtSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await tokenizar(TIPOS.COT_ART, {
      empresa: artForm.empresa,
      empleados: artForm.empleados,
      actividad: artForm.actividad,
      nombre: artForm.nombre,
      telefono: artForm.telefono
    }, 'hero_art');

    const msg = `🏢 *COTIZACIÓN ART*\n🔖 Ref: ${result.token}\n\n` +
      `Empresa: ${artForm.empresa}\nEmpleados: ${artForm.empleados}\nActividad: ${artForm.actividad}\n\n` +
      `👤 ${artForm.nombre}\n📱 ${artForm.telefono}`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  const handleComercioSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await tokenizar(TIPOS.COT_COMERCIO, {
      rubro: comercioForm.rubro,
      metros: comercioForm.metros,
      ubicacion: comercioForm.ubicacion,
      nombre: comercioForm.nombre,
      telefono: comercioForm.telefono
    }, 'hero_comercio');

    const msg = `🏪 *COTIZACIÓN COMERCIO*\n🔖 Ref: ${result.token}\n\n` +
      `Rubro: ${comercioForm.rubro}\nM²: ${comercioForm.metros}\nUbicación: ${comercioForm.ubicacion}\n\n` +
      `👤 ${comercioForm.nombre}\n📱 ${comercioForm.telefono}`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  const handleVidaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await tokenizar(TIPOS.COT_VIDA, {
      edad: vidaForm.edad,
      cobertura: vidaForm.cobertura,
      nombre: vidaForm.nombre,
      telefono: vidaForm.telefono
    }, 'hero_vida');

    const msg = `❤️ *COTIZACIÓN VIDA*\n🔖 Ref: ${result.token}\n\n` +
      `Edad: ${vidaForm.edad}\nCobertura: ${vidaForm.cobertura}\n\n` +
      `👤 ${vidaForm.nombre}\n📱 ${vidaForm.telefono}`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  // ========== FORMULARIOS ==========

  const renderAutoForm = () => (
    <form onSubmit={handleAutoSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <select value={autoForm.tipo} onChange={(e) => setAutoForm({...autoForm, tipo: e.target.value})} required className={selectClass}>
          <option value="">Tipo</option>
          <option value="auto">Auto</option>
          <option value="moto">Moto</option>
          <option value="camioneta">Camioneta</option>
          <option value="camion">Camión</option>
        </select>
        <input type="text" placeholder="Marca" value={autoForm.marca} onChange={(e) => setAutoForm({...autoForm, marca: e.target.value})} required className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder="Modelo" value={autoForm.modelo} onChange={(e) => setAutoForm({...autoForm, modelo: e.target.value})} required className={inputClass} />
        <select value={autoForm.anio} onChange={(e) => setAutoForm({...autoForm, anio: e.target.value})} required className={selectClass}>
          <option value="">Año</option>
          {Array.from({length: 25}, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <input type="text" placeholder="Tu nombre" value={autoForm.nombre} onChange={(e) => setAutoForm({...autoForm, nombre: e.target.value})} required className={inputClass} />
      <input type="tel" placeholder="Tu teléfono" value={autoForm.telefono} onChange={(e) => setAutoForm({...autoForm, telefono: e.target.value})} required className={inputClass} />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? '⏳ Enviando...' : '📱 Cotizar por WhatsApp'}
      </button>
    </form>
  );

  const renderHogarForm = () => (
    <form onSubmit={handleHogarSubmit} className="space-y-4">
      <select value={hogarForm.tipo} onChange={(e) => setHogarForm({...hogarForm, tipo: e.target.value})} required className={selectClass}>
        <option value="">Tipo de vivienda</option>
        <option value="casa">Casa</option>
        <option value="departamento">Departamento</option>
        <option value="ph">PH</option>
        <option value="country">Country/Barrio cerrado</option>
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input type="number" placeholder="M² cubiertos" value={hogarForm.metros} onChange={(e) => setHogarForm({...hogarForm, metros: e.target.value})} required className={inputClass} />
        <input type="text" placeholder="Barrio/Zona" value={hogarForm.ubicacion} onChange={(e) => setHogarForm({...hogarForm, ubicacion: e.target.value})} required className={inputClass} />
      </div>
      <input type="text" placeholder="Tu nombre" value={hogarForm.nombre} onChange={(e) => setHogarForm({...hogarForm, nombre: e.target.value})} required className={inputClass} />
      <input type="tel" placeholder="Tu teléfono" value={hogarForm.telefono} onChange={(e) => setHogarForm({...hogarForm, telefono: e.target.value})} required className={inputClass} />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? '⏳ Enviando...' : '📱 Cotizar por WhatsApp'}
      </button>
    </form>
  );

  const renderArtForm = () => (
    <form onSubmit={handleArtSubmit} className="space-y-4">
      <input type="text" placeholder="Nombre de la empresa" value={artForm.empresa} onChange={(e) => setArtForm({...artForm, empresa: e.target.value})} required className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <select value={artForm.empleados} onChange={(e) => setArtForm({...artForm, empleados: e.target.value})} required className={selectClass}>
          <option value="">Empleados</option>
          <option value="1-5">1-5</option>
          <option value="6-15">6-15</option>
          <option value="16-50">16-50</option>
          <option value="51-100">51-100</option>
          <option value="100+">Más de 100</option>
        </select>
        <select value={artForm.actividad} onChange={(e) => setArtForm({...artForm, actividad: e.target.value})} required className={selectClass}>
          <option value="">Actividad</option>
          <option value="comercio">Comercio</option>
          <option value="servicios">Servicios</option>
          <option value="industria">Industria</option>
          <option value="construccion">Construcción</option>
          <option value="agro">Agropecuario</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <input type="text" placeholder="Tu nombre" value={artForm.nombre} onChange={(e) => setArtForm({...artForm, nombre: e.target.value})} required className={inputClass} />
      <input type="tel" placeholder="Tu teléfono" value={artForm.telefono} onChange={(e) => setArtForm({...artForm, telefono: e.target.value})} required className={inputClass} />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? '⏳ Enviando...' : '📱 Cotizar por WhatsApp'}
      </button>
    </form>
  );

  const renderComercioForm = () => (
    <form onSubmit={handleComercioSubmit} className="space-y-4">
      <select value={comercioForm.rubro} onChange={(e) => setComercioForm({...comercioForm, rubro: e.target.value})} required className={selectClass}>
        <option value="">Rubro</option>
        <option value="gastronomia">Gastronomía</option>
        <option value="retail">Retail/Tienda</option>
        <option value="oficina">Oficina</option>
        <option value="deposito">Depósito</option>
        <option value="taller">Taller</option>
        <option value="otro">Otro</option>
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input type="number" placeholder="M² local" value={comercioForm.metros} onChange={(e) => setComercioForm({...comercioForm, metros: e.target.value})} required className={inputClass} />
        <input type="text" placeholder="Barrio/Zona" value={comercioForm.ubicacion} onChange={(e) => setComercioForm({...comercioForm, ubicacion: e.target.value})} required className={inputClass} />
      </div>
      <input type="text" placeholder="Tu nombre" value={comercioForm.nombre} onChange={(e) => setComercioForm({...comercioForm, nombre: e.target.value})} required className={inputClass} />
      <input type="tel" placeholder="Tu teléfono" value={comercioForm.telefono} onChange={(e) => setComercioForm({...comercioForm, telefono: e.target.value})} required className={inputClass} />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? '⏳ Enviando...' : '📱 Cotizar por WhatsApp'}
      </button>
    </form>
  );

  const renderVidaForm = () => (
    <form onSubmit={handleVidaSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input type="number" placeholder="Tu edad" min="18" max="70" value={vidaForm.edad} onChange={(e) => setVidaForm({...vidaForm, edad: e.target.value})} required className={inputClass} />
        <select value={vidaForm.cobertura} onChange={(e) => setVidaForm({...vidaForm, cobertura: e.target.value})} required className={selectClass}>
          <option value="">Cobertura</option>
          <option value="vida">Vida</option>
          <option value="sepelio">Sepelio</option>
          <option value="accidentes">Accidentes personales</option>
          <option value="salud">Salud complementaria</option>
        </select>
      </div>
      <input type="text" placeholder="Tu nombre" value={vidaForm.nombre} onChange={(e) => setVidaForm({...vidaForm, nombre: e.target.value})} required className={inputClass} />
      <input type="tel" placeholder="Tu teléfono" value={vidaForm.telefono} onChange={(e) => setVidaForm({...vidaForm, telefono: e.target.value})} required className={inputClass} />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? '⏳ Enviando...' : '📱 Cotizar por WhatsApp'}
      </button>
    </form>
  );

  const renderForm = () => {
    switch(activeTab) {
      case 'auto': return renderAutoForm();
      case 'hogar': return renderHogarForm();
      case 'art': return renderArtForm();
      case 'comercio': return renderComercioForm();
      case 'vida': return renderVidaForm();
      default: return renderAutoForm();
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* IZQUIERDA - Copy */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Asesoramiento online 24/7
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Protegé lo que más <span className="text-yellow-400">importa</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-lg">
              Comparamos las mejores aseguradoras del mercado y te conseguimos 
              <strong className="text-white"> hasta 35% de ahorro</strong> en tu póliza.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">17+</div>
                <div className="text-sm text-blue-200">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">4</div>
                <div className="text-sm text-blue-200">Aseguradoras top</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">35%</div>
                <div className="text-sm text-blue-200">Ahorro promedio</div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-2 rounded-lg">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm">4.9/5 en Google</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-2 rounded-lg">
                <span>🛡️</span>
                <span className="text-sm">Matrícula SSN</span>
              </div>
            </div>
          </div>

          {/* DERECHA - Formulario con tabs */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-3 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <img src={tab.icon} alt={tab.label} className="w-8 h-8 object-contain" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Form content */}
            <div className="p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Cotizá tu seguro de {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Completá los datos y recibí tu presupuesto en minutos
              </p>
              
              {renderForm()}
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                🔒 Tus datos están protegidos. No spam garantizado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
