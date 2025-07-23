import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import UpcomingMatches from './components/UpcomingMatches';
import Standings from './components/Standings';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Header />
      <Hero />
      <Stats />
      <About />
      <UpcomingMatches />
      <Standings />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
