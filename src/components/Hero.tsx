'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGE = '/hero1.jpg';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[68vh] sm:min-h-[78vh] lg:min-h-[82vh] flex flex-col items-center justify-center text-center px-4 pt-24 sm:pt-28 pb-14 border-b border-[#1E2026] overflow-hidden bg-[#0A0B0D]">
      
      {/* 1. SINGLE STATIC BACKGROUND IMAGE (MAXIMUM CRISP QUALITY) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Kult Origin Fabric & Physique Texture"
          fill
          priority
          quality={100}
          unoptimized
          sizes="100vw"
          className="object-cover object-center grayscale contrast-125 brightness-90 scale-100 image-render-crisp antialiased"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>

      {/* 2. OVERLAY SHADOWS & VIGNETTE */}
      <div className="absolute inset-0 z-10 bg-black/30 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0B0D] via-transparent to-[#0A0B0D]/60 pointer-events-none" />

      {/* 3. HERO CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto px-2">
        
        {/* Solid Off-White Monument Heading */}
        <h1 className="w-full text-[20vw] sm:text-[8vw] md:text-[6vw] lg:text-[7vw] font-black font-monument uppercase tracking-tight leading-[0.88] mb-3.5 text-[#F3EFE0] drop-shadow-md">
          KULT<br />ORIGIN
        </h1>

        {/* Subtitle Text */}
        <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-[#D0C9BC] uppercase max-w-2xl mb-7 leading-relaxed font-mono font-medium px-2">
          IRREDUCIBLE GRIT. PUMP COVERS.<br />
          TECH-COMPRESSION. DROP 01.
        </p>

        {/* Minimalist Dark Pill Button */}
        <Link
          href="/batch-001"
          className="w-full max-w-[200px] sm:max-w-[240px] bg-[#1C1E22]/80 hover:bg-[#282B32] text-[#F3EFE0] border border-[#3A3D46] font-mono font-semibold text-xs tracking-[0.2em] uppercase py-3 rounded-md text-center transition-all duration-300 backdrop-blur-sm shadow-xl active:scale-95 block"
        >
          ENTER THE KULT.
        </Link>
      </div>
    </section>
  );
}