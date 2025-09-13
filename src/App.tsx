import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Vision from './components/Vision';
import MarketInsights from './components/MarketInsights';
import HowItWorks from './components/HowItWorks';
import FeatureRoadmap from './components/FeatureRoadmap';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Hero />
      <Benefits />
      <Vision />
      <MarketInsights />
      <HowItWorks />
      <FeatureRoadmap />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;