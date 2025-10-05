// src/components/FloatingElements.tsx

'use client'; // This component is now interactive, so we mark it as a client component.

import React, { useState, useEffect } from 'react';

// Define a type for our particle styles for better code quality
interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

const FloatingElements: React.FC = () => {
  // 1. Create state to hold our particles. It starts as an empty array.
  const [particles, setParticles] = useState<ParticleStyle[]>([]);

  // 2. Use a useEffect hook. This code will ONLY run in the browser, after the component has mounted.
  useEffect(() => {
    // Generate the random styles for our particles here
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));

    // 3. Update the state with our browser-generated particles.
    setParticles(newParticles);
  }, []); // The empty array [] ensures this effect runs only once.

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* These large orbs are static and cause no issues */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/5 to-teal-500/5 rounded-full blur-3xl"></div>

      {/* 4. Render the particles from our state. On the server, this will be empty. */}
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-pulse"
          style={style}
        />
      ))}
    </div>
  );
};

export default FloatingElements;