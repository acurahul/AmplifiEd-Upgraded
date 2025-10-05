// src/app/page.tsx

'use client';

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    // The main background color is handled by the layout's body tag,
    // so we just need a main container here.
    <main>
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <FAQ />
      <Footer />
    </main>
  );
}