import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LogosAseguradoras from './components/LogosAseguradoras';
import { WhyChooseUs, Services, SeccionHogar, SeccionComercio, SeccionEmpresas, FinalCTA } from './components/Sections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import TrustpilotSection from './components/TrustpilotSection';
import CookieBanner from './components/CookieBanner';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import NotFound from './pages/NotFound';
import { useSEO } from './hooks/useSEO';
import { retryPendingTokens } from './utils/tokenVault';

// Landing Page
function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useSEO({
    title: 'Seguros de Auto, Hogar y Empresas en Rosario | AYMA Advisors',
    description: 'Broker de seguros en Rosario. Comparamos coberturas entre San Cristóbal, Nación Seguros, Mapfre y SMG. Cotización sin cargo. Productor Asesor matrícula SSN 68323.',
    path: '/',
  });

  return (
    <div className="min-h-screen">
      <Header isChatOpen={isChatOpen} onOpenChat={() => setIsChatOpen(true)} />
      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <HeroSection />
      <LogosAseguradoras />
      <TrustpilotSection />
      <WhyChooseUs />
      <Services />
      <SeccionHogar />
      <SeccionComercio />
      <SeccionEmpresas />
      <FinalCTA />
      <Footer />
      <CookieBanner />
    </div>
  );
}

// App con rutas
function App() {
  useEffect(() => {
    retryPendingTokens();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
