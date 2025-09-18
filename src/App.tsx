import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import LoginPage from './components/LoginPage';
import Portal from './components/Portal';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;