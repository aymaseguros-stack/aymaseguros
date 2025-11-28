import { useState, useEffect } from 'react';

const TIPOS = [{ value: 'auto', label: 'Auto' }, { value: 'camioneta', label: 'Camioneta' }, { value: 'moto', label: 'Moto' }];
const MARCAS = { auto: ['Ford', 'Chevrolet', 'Volkswagen', 'Toyota', 'Fiat', 'Renault', 'Peugeot', 'Honda', 'Nissan', 'Hyundai'], camioneta: ['Toyota', 'Ford', 'Volkswagen', 'Chevrolet', 'Nissan', 'RAM'], moto: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Zanella'] };
const MODELOS = { 'Ford': ['Focus', 'Fiesta', 'Ka', 'Mondeo', 'Mustang', 'EcoSport', 'Kuga', 'Ranger'], 'Chevrolet': ['Onix', 'Cruze', 'Tracker', 'S10', 'Montana'], 'Volkswagen': ['Gol', 'Polo', 'Virtus', 'Golf', 'T-Cross', 'Amarok'], 'Toyota': ['Corolla', 'Yaris', 'Etios', 'Hilux', 'SW4'], 'Fiat': ['Argo', 'Cronos', 'Pulse', 'Strada', 'Toro'], 'Renault': ['Sandero', 'Logan', 'Duster', 'Captur', 'Kwid'], 'Peugeot': ['208', '308', '2008', '3008'], 'Honda': ['Civic', 'City', 'HR-V', 'CR-V'], default: ['Consultar'] };
const COBERTURAS = [{ value: 'rc', label: 'Resp. Civil' }, { value: 'terceros', label: 'Terceros' }, { value: 'todo_riesgo', label: 'Todo Riesgo' }];
const AÑOS = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i);

const HeroSection = () => {
  const [form, setForm] = useState({ tipo: '', marca: '', modelo: '', año: '', cobertura: '' });
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (form.tipo) { setMarcas(MARCAS[form.tipo] || []); setForm(p => ({ ...p, marca: '', modelo: '' })); } }, [form.tipo]);
  useEffect(() => { if (form.marca) { setModelos(MODELOS[form.marca] || MODELOS.default); setForm(p => ({ ...p, modelo: '' })); } }, [form.marca]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tipo || !form.marca || !form.modelo || !form.año || !form.cobertura) { alert('Completá todos los campos'); return; }
    setLoading(true);
    if (typeof gtag !== 'undefined') gtag('event', 'quote_started', { event_category: 'conversion', vehicle_brand: form.marca, vehicle_model: form.modelo });
    const msg = `¡Hola! Quiero cotizar:\n🚗 ${form.marca} ${form.modelo} ${form.año}\n🛡️ ${COBERTURAS.find(c => c.value === form.cobertura)?.label}`;
    window.open(`https://wa.me/5493415302929?text=${encodeURIComponent(msg)}`, '_blank');
    setLoading(false);
  };

  const sel = "px-3 py-2.5 text-sm border-0 rounded-lg bg-white/90 backdrop-blur text-gray-800 focus:ring-2 focus:ring-yellow-400 shadow-sm w-full";

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 overflow-hidden">
      <div className="absolute inset-0 opacity-10"><div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div><div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex justify-center mb-6"><div className="w-20 h-24"><svg viewBox="0 0 80 96" fill="none"><path d="M40 0L80 16V48C80 72 60 88 40 96C20 88 0 72 0 48V16L40 0Z" stroke="#F59E0B" strokeWidth="4" fill="none"/></svg></div></div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4">Seguros de Auto, Hogar y Vida en Rosario</h1>
        <div className="flex justify-center mb-8"><div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg">Cotización GRATIS en 2 minutos</div></div>
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div><label className="block text-xs font-medium text-white/80 mb-1">Tipo</label><select value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})} className={sel} required><option value="">Seleccionar</option>{TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-white/80 mb-1">Marca</label><select value={form.marca} onChange={(e) => setForm({...form, marca: e.target.value})} className={sel} disabled={!form.tipo} required><option value="">Seleccionar</option>{marcas.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-white/80 mb-1">Modelo</label><select value={form.modelo} onChange={(e) => setForm({...form, modelo: e.target.value})} className={sel} disabled={!form.marca} required><option value="">Seleccionar</option>{modelos.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-white/80 mb-1">Año</label><select value={form.año} onChange={(e) => setForm({...form, año: e.target.value})} className={sel} required><option value="">Año</option>{AÑOS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-white/80 mb-1">Cobertura</label><select value={form.cobertura} onChange={(e) => setForm({...form, cobertura: e.target.value})} className={sel} required><option value="">Seleccionar</option>{COBERTURAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                <div className="flex items-end"><button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2">{loading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/></svg> : <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>Cotizar</>}</button></div>
              </div>
            </form>
            <p className="text-white/70 text-xs text-center mt-3">💬 Te contactamos por WhatsApp en menos de 2 minutos</p>
          </div>
        </div>
        <div className="text-center mb-8"><p className="text-white/90">📞 O llamanos: <a href="tel:+5493416952259" className="text-yellow-300 font-bold hover:underline">341 695-2259</a></p></div>
        <div className="text-center"><p className="text-white/80 font-semibold mb-4">Trabajamos con las mejores aseguradoras</p><div className="flex flex-wrap justify-center gap-3">{['San Cristóbal', 'Nación Seguros', 'Mapfre', 'SMG Seguros'].map(a => <span key={a} className="bg-white px-4 py-2 rounded-lg text-gray-800 font-medium text-sm shadow">{a}</span>)}</div></div>
      </div>
    </section>
  );
};

export default HeroSection;
