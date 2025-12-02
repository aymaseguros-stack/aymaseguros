import { useState, useEffect } from 'react';

const WHATSAPP_ROSARIO = '5493416952259';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#vehiculos', label: 'Vehículos' },
    { href: '#hogar', label: 'Hogar' },
    { href: '#empresas', label: 'Empresas' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#contacto', label: 'Contacto' },
  ];

  const handleWhatsApp = () => {
    if (typeof gtag !== 'undefined') gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'header' });
    window.open(`https://wa.me/${WHATSAPP_ROSARIO}?text=Hola! Quiero información sobre seguros`, '_blank');
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="/" className="flex items-center gap-3">
            <img src="/LOGO_AYMA_II.png" alt="AYMA" className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg items-center justify-center text-white font-bold text-lg hidden">AA</div>
            <div className="hidden sm:block">
              <span className={`font-bold text-lg md:text-xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>AYMA</span>
              <span className={`font-light text-lg md:text-xl ${isScrolled ? 'text-blue-600' : 'text-blue-200'}`}> Advisors</span>
              <p className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}>Gestores de Riesgos</p>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-600/10 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>{link.label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+5493416952259" className={`flex items-center gap-2 text-sm font-medium ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/80 hover:text-white'}`} onClick={() => typeof gtag !== 'undefined' && gtag('event', 'phone_click', { event_category: 'engagement', event_label: 'header' })}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span className="hidden xl:inline">341 695-2259</span>
            </a>
            <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>Cotizá ahora</span>
            </button>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} aria-label="Menú">
            {isMobileMenuOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => <a key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">{link.label}</a>)}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <a href="tel:+5493416952259" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Llamar: 341 695-2259
              </a>
              <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Cotizá por WhatsApp
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
