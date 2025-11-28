import { useState, useEffect } from 'react';

// ==========================================
// DATOS PARA CADA TIPO DE SEGURO
// ==========================================

// VEHÍCULOS
const TIPOS_VEHICULO = [{ value: 'auto', label: 'Auto' }, { value: 'camioneta', label: 'Camioneta' }, { value: 'moto', label: 'Moto' }, { value: 'camion', label: 'Camión' }];
const MARCAS = { auto: ['Ford', 'Chevrolet', 'Volkswagen', 'Toyota', 'Fiat', 'Renault', 'Peugeot', 'Honda', 'Nissan', 'Hyundai', 'Kia'], camioneta: ['Toyota', 'Ford', 'Volkswagen', 'Chevrolet', 'Nissan', 'RAM'], moto: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Zanella', 'Motomel'], camion: ['Mercedes-Benz', 'Scania', 'Volvo', 'Iveco', 'Ford'] };
const MODELOS = { 'Ford': ['Focus', 'Fiesta', 'Ka', 'Mondeo', 'Mustang', 'EcoSport', 'Kuga', 'Ranger', 'F-150'], 'Chevrolet': ['Onix', 'Cruze', 'Tracker', 'S10', 'Montana', 'Camaro'], 'Volkswagen': ['Gol', 'Polo', 'Virtus', 'Golf', 'T-Cross', 'Amarok', 'Saveiro'], 'Toyota': ['Corolla', 'Yaris', 'Etios', 'Hilux', 'SW4', 'RAV4'], 'Fiat': ['Argo', 'Cronos', 'Pulse', 'Strada', 'Toro', 'Fiorino'], 'Renault': ['Sandero', 'Logan', 'Duster', 'Captur', 'Kangoo', 'Kwid'], 'Peugeot': ['208', '308', '2008', '3008', 'Partner'], 'Honda': ['Civic', 'City', 'HR-V', 'CR-V', 'Accord'], default: ['Consultar modelo'] };
const COBERTURAS_AUTO = [{ value: 'rc', label: 'Resp. Civil' }, { value: 'terceros', label: 'Terceros' }, { value: 'terceros_plus', label: 'Terceros +' }, { value: 'todo_riesgo', label: 'Todo Riesgo' }];
const AÑOS = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i);

// HOGAR
const TIPOS_INMUEBLE = [{ value: 'casa', label: 'Casa' }, { value: 'depto', label: 'Departamento' }, { value: 'ph', label: 'PH' }, { value: 'country', label: 'Country/Barrio cerrado' }];
const COBERTURAS_HOGAR = [{ value: 'incendio', label: 'Incendio' }, { value: 'robo', label: 'Robo' }, { value: 'integral', label: 'Integral' }, { value: 'todo_riesgo', label: 'Todo Riesgo' }];

// ART - EMPRESAS
const PROVINCIAS = ['Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Chaco', 'Corrientes', 'Misiones', 'Santiago del Estero', 'San Juan', 'Jujuy', 'Río Negro', 'Neuquén', 'Formosa', 'Chubut', 'San Luis', 'Catamarca', 'La Rioja', 'La Pampa', 'Santa Cruz', 'Tierra del Fuego'];
const ACTIVIDADES_CIIU = [
  { value: '4711', label: 'Comercio minorista' },
  { value: '4520', label: 'Taller mecánico' },
  { value: '5610', label: 'Restaurantes' },
  { value: '4771', label: 'Indumentaria' },
  { value: '6201', label: 'Desarrollo software' },
  { value: '4110', label: 'Construcción' },
  { value: '4921', label: 'Transporte' },
  { value: '8610', label: 'Servicios salud' },
  { value: '8510', label: 'Educación' },
  { value: 'otro', label: 'Otra actividad' },
];

// COMERCIO
const TIPOS_COMERCIO = [
  { value: 'local', label: 'Local comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'deposito', label: 'Depósito/Galpón' },
  { value: 'industria', label: 'Industria' },
  { value: 'gastronomia', label: 'Gastronomía' },
];
const RUBROS = [
  { value: 'retail', label: 'Venta minorista' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'salud', label: 'Salud' },
  { value: 'otro', label: 'Otro' },
];

// VIDA / SALUD
const TIPOS_VIDA = [
  { value: 'vida', label: 'Seguro de Vida' },
  { value: 'accidentes', label: 'Accidentes Personales' },
  { value: 'sepelio', label: 'Sepelio' },
  { value: 'salud', label: 'Salud/Prepaga' },
];

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('vehiculos');
  const [loading, setLoading] = useState(false);

  // Estados por tipo de seguro
  const [vehiculo, setVehiculo] = useState({ tipo: '', marca: '', modelo: '', año: '', cobertura: '' });
  const [hogar, setHogar] = useState({ tipo: '', metros: '', zona: '', antiguedad: '', cobertura: '' });
  const [art, setArt] = useState({ razonSocial: '', cuit: '', actividad: '', empleados: '', masaSalarial: '', provincia: '' });
  const [comercio, setComercio] = useState({ tipo: '', rubro: '', superficie: '', sumaContenido: '', sumaEdificio: '', zona: '' });
  const [vida, setVida] = useState({ nombre: '', edad: '', ocupacion: '', sumaAsegurada: '', tipo: '' });

  // Dinámicos para vehículos
  const [marcasDisp, setMarcasDisp] = useState([]);
  const [modelosDisp, setModelosDisp] = useState([]);

  useEffect(() => {
    if (vehiculo.tipo) {
      setMarcasDisp(MARCAS[vehiculo.tipo] || []);
      setVehiculo(p => ({ ...p, marca: '', modelo: '' }));
    }
  }, [vehiculo.tipo]);

  useEffect(() => {
    if (vehiculo.marca) {
      setModelosDisp(MODELOS[vehiculo.marca] || MODELOS.default);
      setVehiculo(p => ({ ...p, modelo: '' }));
    }
  }, [vehiculo.marca]);

  // ==========================================
  // SUBMIT POR TIPO
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let mensaje = '';
    
    switch (activeTab) {
      case 'vehiculos':
        if (!vehiculo.tipo || !vehiculo.marca || !vehiculo.modelo || !vehiculo.año || !vehiculo.cobertura) {
          alert('Completá todos los campos'); setLoading(false); return;
        }
        mensaje = `🚗 *COTIZACIÓN VEHÍCULO*\n\nTipo: ${vehiculo.tipo}\nMarca: ${vehiculo.marca}\nModelo: ${vehiculo.modelo}\nAño: ${vehiculo.año}\nCobertura: ${COBERTURAS_AUTO.find(c => c.value === vehiculo.cobertura)?.label}`;
        break;
        
      case 'hogar':
        if (!hogar.tipo || !hogar.metros || !hogar.cobertura) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🏠 *COTIZACIÓN HOGAR*\n\nTipo: ${TIPOS_INMUEBLE.find(t => t.value === hogar.tipo)?.label}\nMetros²: ${hogar.metros}\nZona: ${hogar.zona || 'No especificada'}\nAntigüedad: ${hogar.antiguedad || 'No especificada'}\nCobertura: ${COBERTURAS_HOGAR.find(c => c.value === hogar.cobertura)?.label}`;
        break;
        
      case 'art':
        if (!art.razonSocial || !art.cuit || !art.actividad || !art.empleados || !art.masaSalarial || !art.provincia) {
          alert('Completá todos los campos del F.931'); setLoading(false); return;
        }
        mensaje = `🏢 *COTIZACIÓN ART EMPRESAS*\n\n📋 Datos F.931 AFIP:\nRazón Social: ${art.razonSocial}\nCUIT: ${art.cuit}\nActividad: ${ACTIVIDADES_CIIU.find(a => a.value === art.actividad)?.label}\nEmpleados: ${art.empleados}\nMasa salarial: $${art.masaSalarial}\nProvincia: ${art.provincia}`;
        break;
        
      case 'comercio':
        if (!comercio.tipo || !comercio.rubro || !comercio.superficie) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `🏪 *COTIZACIÓN COMERCIO*\n\nTipo: ${TIPOS_COMERCIO.find(t => t.value === comercio.tipo)?.label}\nRubro: ${RUBROS.find(r => r.value === comercio.rubro)?.label}\nSuperficie: ${comercio.superficie}m²\nSuma contenido: $${comercio.sumaContenido || 'A definir'}\nSuma edificio: $${comercio.sumaEdificio || 'A definir'}\nZona: ${comercio.zona || 'No especificada'}`;
        break;
        
      case 'vida':
        if (!vida.nombre || !vida.edad || !vida.tipo) {
          alert('Completá los campos obligatorios'); setLoading(false); return;
        }
        mensaje = `❤️ *COTIZACIÓN VIDA/SALUD*\n\nNombre: ${vida.nombre}\nEdad: ${vida.edad} años\nOcupación: ${vida.ocupacion || 'No especificada'}\nTipo: ${TIPOS_VIDA.find(t => t.value === vida.tipo)?.label}\nSuma asegurada: $${vida.sumaAsegurada || 'A definir'}`;
        break;
    }

    // Tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'quote_started', { event_category: 'conversion', quote_type: activeTab });
    }

    window.open(`https://wa.me/5493415302929?text=${encodeURIComponent(mensaje)}`, '_blank');
    setLoading(false);
  };

  // ==========================================
  // ESTILOS
  // ==========================================
  const inputClass = "w-full px-3 py-2.5 text-sm border-0 rounded-lg bg-white/90 backdrop-blur text-gray-800 focus:ring-2 focus:ring-yellow-400 shadow-sm";
  const labelClass = "block text-xs font-medium text-white/80 mb-1";

  const tabs = [
    { id: 'vehiculos', label: '🚗 Vehículos', icon: '🚗' },
    { id: 'hogar', label: '🏠 Hogar', icon: '🏠' },
    { id: 'art', label: '🏢 ART Empresas', icon: '🏢' },
    { id: 'comercio', label: '🏪 Comercio', icon: '🏪' },
    { id: 'vida', label: '❤️ Vida/Salud', icon: '❤️' },
  ];

  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Escudo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-20">
            <svg viewBox="0 0 80 96" fill="none"><path d="M40 0L80 16V48C80 72 60 88 40 96C20 88 0 72 0 48V16L40 0Z" stroke="#F59E0B" strokeWidth="4" fill="none"/></svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-3">
          Seguros de Auto, Hogar y Vida en Rosario
        </h1>

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-bold shadow-lg">
            Cotización GRATIS en 2 minutos
          </div>
        </div>

        {/* ==========================================
            SISTEMA DE PESTAÑAS
        ========================================== */}
        <div className="max-w-4xl mx-auto">
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit}>
              
              {/* ========== VEHÍCULOS ========== */}
              {activeTab === 'vehiculos' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Tipo *</label>
                    <select value={vehiculo.tipo} onChange={(e) => setVehiculo({...vehiculo, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_VEHICULO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Marca *</label>
                    <select value={vehiculo.marca} onChange={(e) => setVehiculo({...vehiculo, marca: e.target.value})} className={inputClass} disabled={!vehiculo.tipo} required>
                      <option value="">Seleccionar</option>
                      {marcasDisp.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Modelo *</label>
                    <select value={vehiculo.modelo} onChange={(e) => setVehiculo({...vehiculo, modelo: e.target.value})} className={inputClass} disabled={!vehiculo.marca} required>
                      <option value="">Seleccionar</option>
                      {modelosDisp.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Año *</label>
                    <select value={vehiculo.año} onChange={(e) => setVehiculo({...vehiculo, año: e.target.value})} className={inputClass} required>
                      <option value="">Año</option>
                      {AÑOS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Cobertura *</label>
                    <select value={vehiculo.cobertura} onChange={(e) => setVehiculo({...vehiculo, cobertura: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {COBERTURAS_AUTO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== HOGAR ========== */}
              {activeTab === 'hogar' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Tipo inmueble *</label>
                    <select value={hogar.tipo} onChange={(e) => setHogar({...hogar, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_INMUEBLE.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Metros² *</label>
                    <input type="number" value={hogar.metros} onChange={(e) => setHogar({...hogar, metros: e.target.value})} className={inputClass} placeholder="Ej: 80" required />
                  </div>
                  <div>
                    <label className={labelClass}>Zona/Barrio</label>
                    <input type="text" value={hogar.zona} onChange={(e) => setHogar({...hogar, zona: e.target.value})} className={inputClass} placeholder="Ej: Centro" />
                  </div>
                  <div>
                    <label className={labelClass}>Antigüedad</label>
                    <input type="text" value={hogar.antiguedad} onChange={(e) => setHogar({...hogar, antiguedad: e.target.value})} className={inputClass} placeholder="Ej: 10 años" />
                  </div>
                  <div>
                    <label className={labelClass}>Cobertura *</label>
                    <select value={hogar.cobertura} onChange={(e) => setHogar({...hogar, cobertura: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {COBERTURAS_HOGAR.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== ART EMPRESAS ========== */}
              {activeTab === 'art' && (
                <div className="space-y-4">
                  <p className="text-white/80 text-sm text-center mb-2">📋 Datos del Formulario 931 AFIP</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <label className={labelClass}>Razón Social *</label>
                      <input type="text" value={art.razonSocial} onChange={(e) => setArt({...art, razonSocial: e.target.value})} className={inputClass} placeholder="Empresa S.A." required />
                    </div>
                    <div>
                      <label className={labelClass}>CUIT *</label>
                      <input type="text" value={art.cuit} onChange={(e) => setArt({...art, cuit: e.target.value})} className={inputClass} placeholder="30-12345678-9" required />
                    </div>
                    <div>
                      <label className={labelClass}>Actividad (CIIU) *</label>
                      <select value={art.actividad} onChange={(e) => setArt({...art, actividad: e.target.value})} className={inputClass} required>
                        <option value="">Seleccionar</option>
                        {ACTIVIDADES_CIIU.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Empleados *</label>
                      <input type="number" value={art.empleados} onChange={(e) => setArt({...art, empleados: e.target.value})} className={inputClass} placeholder="Ej: 15" required />
                    </div>
                    <div>
                      <label className={labelClass}>Masa salarial $ *</label>
                      <input type="number" value={art.masaSalarial} onChange={(e) => setArt({...art, masaSalarial: e.target.value})} className={inputClass} placeholder="Ej: 5000000" required />
                    </div>
                    <div>
                      <label className={labelClass}>Provincia *</label>
                      <select value={art.provincia} onChange={(e) => setArt({...art, provincia: e.target.value})} className={inputClass} required>
                        <option value="">Seleccionar</option>
                        {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar ART</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== COMERCIO ========== */}
              {activeTab === 'comercio' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                  <div>
                    <label className={labelClass}>Tipo comercio *</label>
                    <select value={comercio.tipo} onChange={(e) => setComercio({...comercio, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_COMERCIO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Rubro *</label>
                    <select value={comercio.rubro} onChange={(e) => setComercio({...comercio, rubro: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {RUBROS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Superficie m² *</label>
                    <input type="number" value={comercio.superficie} onChange={(e) => setComercio({...comercio, superficie: e.target.value})} className={inputClass} placeholder="Ej: 100" required />
                  </div>
                  <div>
                    <label className={labelClass}>Suma contenido $</label>
                    <input type="number" value={comercio.sumaContenido} onChange={(e) => setComercio({...comercio, sumaContenido: e.target.value})} className={inputClass} placeholder="Ej: 5000000" />
                  </div>
                  <div>
                    <label className={labelClass}>Suma edificio $</label>
                    <input type="number" value={comercio.sumaEdificio} onChange={(e) => setComercio({...comercio, sumaEdificio: e.target.value})} className={inputClass} placeholder="Ej: 20000000" />
                  </div>
                  <div>
                    <label className={labelClass}>Zona</label>
                    <input type="text" value={comercio.zona} onChange={(e) => setComercio({...comercio, zona: e.target.value})} className={inputClass} placeholder="Ej: Centro" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ========== VIDA / SALUD ========== */}
              {activeTab === 'vida' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className={labelClass}>Nombre *</label>
                    <input type="text" value={vida.nombre} onChange={(e) => setVida({...vida, nombre: e.target.value})} className={inputClass} placeholder="Tu nombre" required />
                  </div>
                  <div>
                    <label className={labelClass}>Edad *</label>
                    <input type="number" value={vida.edad} onChange={(e) => setVida({...vida, edad: e.target.value})} className={inputClass} placeholder="Ej: 35" required />
                  </div>
                  <div>
                    <label className={labelClass}>Ocupación</label>
                    <input type="text" value={vida.ocupacion} onChange={(e) => setVida({...vida, ocupacion: e.target.value})} className={inputClass} placeholder="Ej: Empleado" />
                  </div>
                  <div>
                    <label className={labelClass}>Tipo seguro *</label>
                    <select value={vida.tipo} onChange={(e) => setVida({...vida, tipo: e.target.value})} className={inputClass} required>
                      <option value="">Seleccionar</option>
                      {TIPOS_VIDA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Suma asegurada $</label>
                    <input type="number" value={vida.sumaAsegurada} onChange={(e) => setVida({...vida, sumaAsegurada: e.target.value})} className={inputClass} placeholder="Ej: 10000000" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">
                      {loading ? <span className="animate-spin">⏳</span> : <>💬 Cotizar</>}
                    </button>
                  </div>
                </div>
              )}

            </form>

            <p className="text-white/70 text-xs text-center mt-3">
              💬 Te contactamos por WhatsApp en menos de 2 minutos · Sin compromiso
            </p>
          </div>
        </div>

        {/* Teléfono */}
        <div className="text-center mt-6">
          <p className="text-white/90">
            📞 O llamanos: <a href="tel:+5493416952259" className="text-yellow-300 font-bold hover:underline">341 695-2259</a>
          </p>
        </div>

        {/* Aseguradoras */}
        <div className="text-center mt-6">
          <p className="text-white/80 font-semibold mb-3">Trabajamos con las mejores aseguradoras</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['San Cristóbal', 'Nación Seguros', 'Mapfre', 'SMG Seguros'].map(a => (
              <span key={a} className="bg-white px-3 py-1.5 rounded-lg text-gray-800 font-medium text-sm shadow">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
