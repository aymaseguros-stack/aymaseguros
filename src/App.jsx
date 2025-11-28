import HeroSection from './components/HeroSection';
import { WhyChooseUs, Services, Testimonials, FinalCTA } from './components/Sections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen">
      {/* ChatBot flotante - arriba izquierda */}
      <ChatBot />
      
      {/* Hero con formulario de cotización por pestañas */}
      <HeroSection />
      
      {/* ¿Por qué elegir AYMA? */}
      <WhyChooseUs />
      
      {/* Nuestros Servicios */}
      <Services />
      
      {/* Testimonios (opcional - podés comentarlo si no lo querés) */}
      <Testimonials />
      
      {/* CTA Final */}
      <FinalCTA />
      
      {/* Footer con contacto + 2 mapas */}
      <Footer />
    </div>
  );
}

export default App;
