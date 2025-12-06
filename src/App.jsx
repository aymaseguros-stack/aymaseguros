import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import { WhyChooseUs, Services, Testimonials, FinalCTA } from './components/Sections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import { retryPendingTokens } from './utils/tokenVault';

// Landing Page
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ChatBot />
      <HeroSection />
      <WhyChooseUs />
      <Services />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// App con rutas
function App() {
  // Reintentar tokens pendientes al cargar la app
  useEffect(() => {
    retryPendingTokens();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
