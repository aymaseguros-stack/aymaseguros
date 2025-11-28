import { useState } from 'react';

const Footer = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (typeof gtag !== 'undefined') gtag('event', 'contact_form_submit', { event_category: 'engagement' });
    const msg = `📩 Nuevo contacto web\n👤 ${form.nombre}\n📧 ${form.email}\n📱 ${form.telefono}\n💬 ${form.mensaje}`;
    window.open(`https://wa.me/5493415302929?text=${encodeURIComponent(msg)}`, '_blank');
    setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Contactanos</h2>
            <p className="text-gray-400 mb-6">Completá el formulario y te respondemos en menos de 24 horas</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Nombre *</label><input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required className={inputClass} placeholder="Tu nombre" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Email *</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className={inputClass} placeholder="tu@email.com" /></div>
              </div>
              <div><label className="block text-sm text-gray-300 mb-1">Teléfono</label><input type="tel" value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} className={inputClass} placeholder="341 XXX-XXXX" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Mensaje *</label><textarea value={form.mensaje} onChange={(e) => setForm({...form, mensaje: e.target.value})} required rows={4} className={inputClass + " resize-none"} placeholder="¿En qué podemos ayudarte?" /></div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? 'Enviando...' : '📧 Enviar mensaje'}</button>
            </form>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Nuestras oficinas</h2>
            <p className="text-gray-400 mb-6">Visitanos en Rosario o Buenos Aires</p>
            <div className="rounded-xl overflow-hidden shadow-lg mb-6"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.0!2d-60.644!3d-32.9587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU3JzMxLjMiUyA2MMKwMzgnMzguNCJX!5e0!3m2!1ses!2sar!4v1700000000000" width="100%" height="250" style={{border:0}} allowFullScreen="" loading="lazy" title="Mapa" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-5"><h3 className="font-bold text-lg">📍 Rosario</h3><p className="text-gray-400 text-sm">Mariano Moreno 37, Piso 9 A</p><a href="tel:+5493416952259" className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2 inline-block">📞 341 695-2259</a></div>
              <div className="bg-gray-800 rounded-xl p-5"><h3 className="font-bold text-lg">📍 Buenos Aires</h3><p className="text-gray-400 text-sm">Manzoni 112, CABA</p><a href="tel:+5491153022929" className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2 inline-block">📞 11 5302-2929</a></div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-xs text-gray-500 space-y-2 mb-4">
            <p><strong>AYMA Advisors</strong> — Matrícula PAS N° 68323 (SSN). Asesoramiento sujeto a normativa SSN.</p>
            <p>*Ahorro 35% basado en clientes con perfil bajo. Resultados pueden variar.</p>
            <p>Protección de datos: Ley 25.326 (AAIP). <a href="/privacidad" className="underline hover:text-white">Política de Privacidad</a></p>
          </div>
          <p className="text-center text-gray-600 text-xs">© {new Date().getFullYear()} AYMA Advisors. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
