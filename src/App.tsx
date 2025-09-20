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
import ProtectedRoute from './components/ProtectedRoute';
import PortalPage from './pages/PortalPage';
import AdminQueuePage from './pages/AdminQueuePage';
import TutorHomePage from './pages/TutorHomePage';
import TutorCoursePage from './pages/TutorCoursePage';
import TutorSessionPage from './pages/TutorSessionPage';
import StudentHomePage from './pages/StudentHomePage';
import StudentCoursePage from './pages/StudentCoursePage';
import StudentChatPage from './pages/StudentChatPage';

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
    <div className="min-h-screen bg-slate-900">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <PortalPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/queue" 
              element={
                <ProtectedRoute>
                  <AdminQueuePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutor/home" 
              element={
                <ProtectedRoute>
                  <TutorHomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutor/course/:courseId" 
              element={
                <ProtectedRoute>
                  <TutorCoursePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutor/session/:sessionId" 
              element={
                <ProtectedRoute>
                  <TutorSessionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/home" 
              element={
                <ProtectedRoute>
                  <StudentHomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/course/:courseId" 
              element={
                <ProtectedRoute>
                  <StudentCoursePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/chat/:sessionId" 
              element={
                <ProtectedRoute>
                  <StudentChatPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;