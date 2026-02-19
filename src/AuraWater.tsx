import { Cursor } from './components/cursor/Cursor';
import { Nav } from './components/ui/Nav';
import { Hero } from './components/ui/Hero';
import { Ticker } from './components/ui/Ticker';
import { Story } from './components/ui/Story';
import { Features } from './components/ui/Features';
import { Showcase } from './components/ui/Showcase';
import { Numbers } from './components/ui/Numbers';
import { Customizer } from './components/ui/Customizer';
import { CTA } from './components/ui/CTA';
import { Footer } from './components/ui/Footer';
import { useReveal } from './hooks/useReveal';
import './index.css';

function App() {
  useReveal();

  return (
    // overflow-x-hidden ici bloque tout débordement horizontal
    // quelle que soit la section qui en est la cause
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <Cursor />
      <Nav />
      <Hero />
      <Ticker />
      <Story />
      <Features />
      <Showcase />
      <Numbers />
      <Customizer />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;