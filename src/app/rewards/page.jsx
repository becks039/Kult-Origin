'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Tactical Visual Backgrounds (Matching Founder 50 Style)
const SLIDING_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop'
];

export default function UGCRewardsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewType, setReviewType] = useState('video');
  const [formData, setFormData] = useState({ name: '', email: '', reviewText: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState(null);

  // Background Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDING_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side simulation
    setTimeout(() => {
      const discountPercentage = reviewType === 'video' ? '20' : reviewType === 'photo' ? '10' : '5';
      const randomCode = `KULT-UGC-${discountPercentage}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setSuccessCode(randomCode);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      {/* 1. FULL PAGE BACKGROUND SLIDER WITH VIGNETTE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {SLIDING_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-40 scale-105 transition-transform duration-10000' : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/80 via-[#0A0B0D]/70 to-[#0A0B0D]/90" />
      </div>

      {/* 2. BACKGROUND DOT GRID OVERLAY */}
      <div className="fixed inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none z-10" />

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-20 pb-16 sm:pb-20">

        {/* TOP NAVIGATION BAR */}
        <header className="pt-6 sm:pt-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center max-w-5xl mx-auto gap-2">
            
            {/* BACK TO HOME BUTTON */}
            <Link 
              href="/" 
              className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="text-[#E8E2D6] group-hover:text-[#D4AF37] group-active:text-[#D4AF37] group-hover:-translate-x-1 transition-all duration-300 text-xs sm:text-sm">←</span>
              <span className="group-hover:text-[#D4AF37] group-active:text-[#D4AF37] transition-colors duration-300">HOME</span>
            </Link>

            {/* BATCH 001 BUTTON */}
            <Link 
              href="/batch-001" 
              className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="group-hover:text-[#D4AF37] group-active:text-[#D4AF37] transition-colors duration-300">BATCH 001</span>
              <span className="text-[#E8E2D6] group-hover:text-[#D4AF37] group-active:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300 text-xs sm:text-sm">→</span>
            </Link>

          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-8 sm:pt-10 pb-10 sm:pb-12 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#2D323E]/60 space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 text-center max-w-4xl mx-auto">
            <div>
              <span className="text-[10px] sm:text-xs text-[#D4AF37] border border-[#D4AF37]/40 bg-[#12141B]/80 px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold inline-block backdrop-blur-md shadow-md">
                PROTOCOL // REWARD ENGINE
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black font-monument uppercase tracking-tight leading-tight text-[#E8E2D6] drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)]">
              FIELD TEST REWARDS
            </h1>
            
            <p className="text-[11px] sm:text-sm text-[#E8E2D6]/90 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed font-mono drop-shadow-md">
              SUBMIT ARCHITECTURAL GEAR VALIDATION. EARN AUTOMATED REBUY CREDITS & ACCESS TO CLANDESTINE RELEASES.
            </p>
          </div>
        </section>

        {/* REWARD TIERS (CARDS) */}
        <section className="py-10 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-widest font-bold">MODULE 4.1 // TIER ALLOCATION</span>
            <h2 className="text-2xl sm:text-3xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
              SELECT VALIDATION TIER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Tier 1 */}
            <div 
              onClick={() => setReviewType('text')}
              className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md active:scale-98 ${
                reviewType === 'text' 
                  ? 'bg-[#12141B]/95 border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] scale-[1.02]' 
                  : 'bg-[#12141B]/70 border-[#2D323E] hover:border-[#2D323E]'
              }`}
            >
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">TIER 01 // TEXT BRIEF</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] mt-2 sm:mt-3">5% OFF</h3>
              <p className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-wider mt-2 sm:mt-3 leading-relaxed">
                Quick written feedback detailing fabric & fit performance under tension.
              </p>
            </div>

            {/* Tier 2 */}
            <div 
              onClick={() => setReviewType('photo')}
              className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md active:scale-98 ${
                reviewType === 'photo' 
                  ? 'bg-[#12141B]/95 border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] scale-[1.02]' 
                  : 'bg-[#12141B]/70 border-[#2D323E] hover:border-[#2D323E]'
              }`}
            >
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">TIER 02 // VISUAL SPEC</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] mt-2 sm:mt-3">10% OFF</h3>
              <p className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-wider mt-2 sm:mt-3 leading-relaxed">
                High-res fit photo showcasing silhouette, seams & 3D crest details.
              </p>
            </div>

            {/* Tier 3 */}
            <div 
              onClick={() => setReviewType('video')}
              className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden active:scale-98 ${
                reviewType === 'video' 
                  ? 'bg-[#12141B]/95 border-[#D4AF37]/60 shadow-[0_0_35px_rgba(212,175,55,0.35)] scale-[1.02]' 
                  : 'bg-[#12141B]/70 border-[#2D323E] hover:border-[#2D323E]'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[8px] sm:text-[9px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-bl-lg tracking-widest">
                MAX REWARD
              </div>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">TIER 03 // ACTION FOOTAGE</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] mt-2 sm:mt-3">20% OFF</h3>
              <p className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-wider mt-2 sm:mt-3 leading-relaxed">
                15-20 sec vertical video wearing gear active inside gym or field.
              </p>
            </div>

          </div>
        </section>

        {/* DYNAMIC FORM SECTION */}
        <section className="px-4 sm:px-6 max-w-3xl mx-auto">
          {!successCode ? (
            <form 
              onSubmit={handleFormSubmit} 
              className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-6 sm:p-10 rounded-2xl space-y-5 sm:space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            >
              <div className="flex justify-between items-center border-b border-[#2D323E] pb-3 sm:pb-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase text-[#D4AF37] tracking-widest">
                  TRANSMISSION FORM // TIER ({reviewType.toUpperCase()})
                </h3>
                <span className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 uppercase tracking-widest">AUTHENTICATED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">FULL NAME</label>
                  <input 
                    type="text"
                    required
                    placeholder="COMMANDER NAME"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0A0B0D]/80 border border-[#2D323E] focus:border-[#D4AF37]/50 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs text-[#E8E2D6] outline-none tracking-widest transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">EMAIL ADDRESS</label>
                  <input 
                    type="email"
                    required
                    placeholder="NAME@ORIGIN.COM"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0A0B0D]/80 border border-[#2D323E] focus:border-[#D4AF37]/50 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs text-[#E8E2D6] outline-none tracking-widest transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">TECHNICAL VERDICT / FEEDBACK</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="DESCRIBE GEAR FABRIC COMPRESSION, STITCHING DURABILITY, AND FIT UNDER RESISTANCE..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full bg-[#0A0B0D]/80 border border-[#2D323E] focus:border-[#D4AF37]/50 rounded-xl p-3.5 sm:p-4 text-xs text-[#E8E2D6] outline-none tracking-widest leading-relaxed transition-colors font-mono"
                />
              </div>

              {/* Upload Input */}
              {reviewType !== 'text' && (
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">
                    UPLOAD {reviewType === 'video' ? 'VERTICAL VIDEO (.MP4 / .MOV)' : 'FIT IMAGES (.JPG / .PNG)'}
                  </label>
                  <div className="border-2 border-dashed border-[#2D323E] rounded-xl p-6 sm:p-8 text-center bg-[#0A0B0D]/60 cursor-pointer transition-all">
                    <input 
                      type="file" 
                      accept={reviewType === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                      id="ugc-file-input"
                    />
                    <label htmlFor="ugc-file-input" className="cursor-pointer space-y-1.5 sm:space-y-2 block">
                      <p className="text-xs text-[#E8E2D6] font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors break-all">
                        {selectedFile ? selectedFile.name : `SELECT OR DROP ${reviewType.toUpperCase()} FILE HERE`}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 uppercase tracking-widest">
                        RAW, UNEDITED AND HIGH RESOLUTION MANDATORY
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {/* FORM SUBMIT BUTTON */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group w-full py-3.5 sm:py-4 bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-colors duration-300 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.9)] cursor-pointer backdrop-blur-md active:scale-95"
              >
                <span className="group-hover:text-[#D4AF37] group-active:text-[#D4AF37] transition-colors duration-300">
                  {isSubmitting ? 'PROCESSING PROTOCOL...' : 'TRANSMIT REVIEW & GENERATE CODE'}
                </span>
              </button>

            </form>
          ) : (
            /* Promo Code Unlocked View */
            <div className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-6 sm:p-10 rounded-2xl text-center space-y-5 sm:space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
              <div>
                <span className="text-[10px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] border border-[#D4AF37]/40 px-4 sm:px-5 py-1.5 rounded-full inline-block bg-[#0A0B0D]">
                  REWARD UNLOCKED // SYSTEM AUTOMATION
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black font-monument text-[#E8E2D6] uppercase tracking-tight">
                PROMO CODE ISSUED
              </h2>
              
              <p className="text-[11px] sm:text-xs text-[#E8E2D6]/70 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                YOUR TECHNICAL REVIEW WAS VALIDATED. USE THE AUTHENTICATION CODE BELOW AT CHECKOUT TO REDEEM DISCOUNTS:
              </p>

              <div className="bg-[#0A0B0D] border border-[#2D323E] p-4 sm:p-6 rounded-xl max-w-sm mx-auto shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-[#D4AF37] tracking-widest select-all font-mono break-all">
                  {successCode}
                </span>
              </div>

              <div className="pt-2 sm:pt-4 flex justify-center">
                <Link 
                  href="/batch-001" 
                  className="group w-full sm:w-auto py-3.5 sm:py-4 px-8 sm:px-10 bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-full transition-colors duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95"
                >
                  <span className="group-hover:text-[#D4AF37] group-active:text-[#D4AF37] transition-colors duration-300">
                    APPLY CODE ON BATCH 001
                  </span>
                </Link>
              </div>
            </div>
          )}
        </section>

      </div>

    </div>
  );
}