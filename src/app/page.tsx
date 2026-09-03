"use client";

import Hero from "@/components/Hero";
import FoundationSect from "@/components/FoundationSection";
import FounderTierSection from "@/components/FounderTierSection";
import BrandStatement from "@/components/BrandStatement";
import Footer from "@/components/Footer";
import ProductShowcase from "@/components/ProductShowcase";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#070708] text-[#E8E2D6] font-satoshi selection:bg-[#D4AF37] selection:text-black">
      <Navbar/>
      <Hero />
      <FoundationSect/>
      <FounderTierSection />
      <ProductShowcase/>
      <BrandStatement />

      <Footer />
    </main>
  );
}