'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

const SLIDING_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop',
];

export default function Founder50Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [founderCount, setFounderCount] = useState(0);
  const [founderCap, setFounderCap] = useState(50);
  const [loadingFounderCount, setLoadingFounderCount] = useState(true);

  // Form input states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const fetchBatchStatus = async () => {
      try {
        setLoadingFounderCount(true);

        const response = await fetch('/api/batch-status', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch batch status');
        }

        const data = await response.json();

        setFounderCount(data.currentFounderCount ?? 0);
        setFounderCap(data.founderCap ?? 50);
      } catch (error) {
        console.error('BATCH STATUS ERROR:', error);

        // Safe fallback
        setFounderCount(0);
        setFounderCap(50);
      } finally {
        setLoadingFounderCount(false);
      }
    };

    fetchBatchStatus();

    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % SLIDING_IMAGES.length
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage('');

    try {
      const res = await fetch('/api/founder-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          birthDate,
        }),
      });

      if (res.ok) {
        setFormMessage('FOUNDER DETAILS REGISTERED SUCCESSFULLY.');
      } else {
        setFormMessage('FAILED TO REGISTER DETAILS. PLEASE TRY AGAIN.');
      }
    } catch (err) {
      console.error(err);
      setFormMessage('AN ERROR OCCURRED. PLEASE TRY AGAIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingKeys = Math.max(
    founderCap - founderCount,
    0
  );

  const progressPercentage =
    founderCap > 0
      ? Math.min(
          (founderCount / founderCap) * 100,
          100
        )
      : 0;

  const displayedFounderNumber =
    founderCount > 0
      ? String(founderCount).padStart(3, '0')
      : '---';

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {SLIDING_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-50 scale-105'
                : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              transition:
                'opacity 1000ms ease-in-out, transform 10000ms ease-in-out',
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/70 via-[#0A0B0D]/60 to-[#0A0B0D]/80" />
      </div>

      {/* TECHNICAL GRID */}
      <div className="fixed inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none z-10" />

      {/* MAIN CONTAINER */}
      <div className="relative z-20">

        {/* TOP NAVIGATION */}
        <header className="pt-6 sm:pt-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center max-w-5xl mx-auto gap-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-all duration-300" />
              <span className="group-hover:text-[#D4AF37] transition-colors duration-300">
                HOME
              </span>
            </Link>

            <Link
              href="/batch-001"
              className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="group-hover:text-[#D4AF37] transition-colors duration-300">
                BATCH 001
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-8 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#2D323E]/60 space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 text-center max-w-4xl mx-auto">
            <div>
              <span className="text-[10px] sm:text-xs text-[#D4AF37] border border-[#D4AF37]/40 bg-[#12141B]/80 px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold inline-block backdrop-blur-md shadow-md">
                CONFIDENTIAL // ELITE ALLIANCE
              </span>
            </div>

            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black font-monument uppercase tracking-tight leading-tight text-[#E8E2D6] drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)]">
              THE FOUNDER 50
            </h1>

            <p className="text-[11px] sm:text-sm text-[#E8E2D6]/90 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed font-mono drop-shadow-md">
              NOT A MEMBERSHIP PROGRAM. A LIFETIME ARCHITECTURAL ALLIANCE LIMITED TO THE FIRST 50 INDIVIDUALS OF BATCH 001.
            </p>
          </div>

          {/* LIVE FOUNDER ALLOCATION */}
          <div className="max-w-md mx-auto bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-4 sm:p-5 rounded-2xl space-y-3 shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <span className="text-[#E8E2D6]/80">
                ALLOCATED KEYS
              </span>

              <span className="text-[#D4AF37]">
                {loadingFounderCount
                  ? 'LOADING...'
                  : `${founderCount} / ${founderCap} ISSUED`}
              </span>
            </div>

            <div className="w-full h-2 bg-[#0A0B0D] rounded-full overflow-hidden p-[1px] border border-[#2D323E]">
              <div
                className="h-full bg-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <p className="text-[9px] sm:text-[10px] text-[#E8E2D6]/50 uppercase tracking-widest text-center pt-0.5 font-bold">
              {loadingFounderCount
                ? 'VERIFYING FOUNDER ALLOCATION'
                : `${remainingKeys} KEYS REMAINING BEFORE TIER LOCK`}
            </p>
          </div>
        </section>

        {/* ARTIFACT SPEC */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#2D323E]/60">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* OBSIDIAN KEY CARD */}
            <div className="relative group flex justify-center">
              <div className="w-full max-w-md min-h-[260px] bg-[#12141B]/95 backdrop-blur-md border border-[#D4AF37]/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.95)] relative overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#D4AF37]/25 via-transparent to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black font-monument tracking-wider text-[#D4AF37]">
                      KULT ORIGIN
                    </h3>

                    <p className="text-[9px] sm:text-[10px] text-[#E8E2D6]/50 uppercase tracking-widest pt-0.5">
                      OBSIDIAN KEY // ALLIANCE ARTIFACT
                    </p>
                  </div>

                  <span className="text-[10px] sm:text-xs font-mono font-bold text-[#E8E2D6] border border-[#D4AF37]/40 px-2.5 py-1 rounded-full bg-[#0A0B0D]">
                    {displayedFounderNumber} /{' '}
                    {String(founderCap).padStart(3, '0')}
                  </span>
                </div>

                <div className="space-y-1 z-10 my-6">
                  <p className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 uppercase tracking-widest">
                    MATERIAL SPEC
                  </p>

                  <p className="text-xs font-bold text-[#E8E2D6] uppercase tracking-wider">
                    3MM LASER-ETCHED BLACK ACRYLIC
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-[#2D323E] pt-4 z-10">
                  <span className="text-[9px] sm:text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
                    PERPETUAL ALLOCATION
                  </span>

                  <span className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 tracking-widest uppercase">
                    AUTHENTICATED
                  </span>
                </div>
              </div>
            </div>

            {/* ARTIFACT INFORMATION */}
            <div className="space-y-4 sm:space-y-6">
              <span className="text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-widest font-bold">
                MODULE 3.1 // ARTIFACT SPEC
              </span>

              <h2 className="text-2xl sm:text-4xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
                THE OBSIDIAN KEY
              </h2>

              <p className="text-xs sm:text-sm text-[#E8E2D6]/80 uppercase tracking-widest leading-relaxed">
                EVERY FOUNDER RECEIVES A PHYSICAL 3MM THICK LASER-ETCHED BLACK ACRYLIC CARD BEARING THE SENTINEL CREST AND AN INDIVIDUAL ALLOCATION NUMBER.
              </p>

              <ul className="space-y-3 text-xs uppercase tracking-wider text-[#E8E2D6]/90 font-mono">
                <li className="flex items-center space-x-3">
                  <span className="text-[#D4AF37]">■</span>
                  <span>CUSTOM MEMBER NUMBERING (001 TO 050)</span>
                </li>

                <li className="flex items-center space-x-3">
                  <span className="text-[#D4AF37]">■</span>
                  <span>PHYSICAL PROOF OF PERPETUAL FOUNDER PRIVILEGES</span>
                </li>

                <li className="flex items-center space-x-3">
                  <span className="text-[#D4AF37]">■</span>
                  <span>DESPATCHED AUTOMATICALLY WITH BATCH 001 DELIVERY</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ALLIANCE PRIVILEGES */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#2D323E]/60 space-y-8 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
              ALLIANCE PRIVILEGES
            </h2>

            <p className="text-[10px] sm:text-xs text-[#E8E2D6]/60 uppercase tracking-widest">
              FOUR CORE FOUNDATION PILLARS OF THE FOUNDER TIER
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-4 sm:p-6 rounded-xl flex flex-col justify-between space-y-2 sm:space-y-3 hover:border-[#D4AF37]/50 transition-colors shadow-lg">
              <span className="text-[9px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                01 // FINANCIAL
              </span>

              <h3 className="text-sm sm:text-lg font-bold uppercase tracking-wider text-[#E8E2D6]">
                20% FLAT DISCOUNT
              </h3>

              <p className="text-[10px] sm:text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed">
                LOCKED TO YOUR ACCOUNT ON ALL FUTURE BATCH RELEASES. ANNUAL SPEND CAPPED AT RS 100,000.
              </p>
            </div>

            <div className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-4 sm:p-6 rounded-xl flex flex-col justify-between space-y-2 sm:space-y-3 hover:border-[#D4AF37]/50 transition-colors shadow-lg">
              <span className="text-[9px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                02 // BRIEFING
              </span>

              <h3 className="text-sm sm:text-lg font-bold uppercase tracking-wider text-[#E8E2D6]">
                LAHORE GATHERING
              </h3>

              <p className="text-[10px] sm:text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed">
                ANNUAL INVITE-ONLY MEETING HELD IN A RAW INDUSTRIAL VENUE IN LAHORE.
              </p>
            </div>

            <div className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-4 sm:p-6 rounded-xl flex flex-col justify-between space-y-2 sm:space-y-3 hover:border-[#D4AF37]/50 transition-colors shadow-lg">
              <span className="text-[9px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                03 // BIRTHDAY
              </span>

              <h3 className="text-sm sm:text-lg font-bold uppercase tracking-wider text-[#E8E2D6]">
                PROTOTYPE SHIPMENT
              </h3>

              <p className="text-[10px] sm:text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed">
                10 DAYS PRIOR TO YOUR BIRTHDAY, AN UNRELEASED HARDWARE PROTOTYPE IS DISPATCHED.
              </p>
            </div>

            <div className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-4 sm:p-6 rounded-xl flex flex-col justify-between space-y-2 sm:space-y-3 hover:border-[#D4AF37]/50 transition-colors shadow-lg">
              <span className="text-[9px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                04 // PRIORITY
              </span>

              <h3 className="text-sm sm:text-lg font-bold uppercase tracking-wider text-[#E8E2D6]">
                EARLY DROP GATE
              </h3>

              <p className="text-[10px] sm:text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed">
                72-HOUR ADVANCE WINDOW FOR ALL FUTURE BATCH RELEASES BEFORE PUBLIC MARKET.
              </p>
            </div>
          </div>
        </section>

        {/* FOUNDER REGISTRATION FORM */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-2xl mx-auto border-b border-[#2D323E]/60 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-widest font-bold">
              PROFILE VERIFICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
              REGISTER FOUNDER DETAILS
            </h2>
            <p className="text-[10px] sm:text-xs text-[#E8E2D6]/60 uppercase tracking-widest">
              REQUIRED FOR BIRTHDAY PROTOTYPE DISPATCH & SMS NOTIFICATIONS
            </p>
          </div>

          <form onSubmit={handleProfileUpdate} className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-6 sm:p-8 rounded-2xl space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs text-[#E8E2D6]/80 font-bold uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                PHONE NUMBER
              </label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-[#0A0B0D] border border-[#2D323E] rounded-xl px-4 py-3 text-xs text-[#E8E2D6] placeholder-[#E8E2D6]/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs text-[#E8E2D6]/80 font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                DATE OF BIRTH
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full bg-[#0A0B0D] border border-[#2D323E] rounded-xl px-4 py-3 text-xs text-[#E8E2D6] focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {formMessage && (
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest text-center pt-2">
                {formMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:bg-[#b8952d] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'SAVING...' : 'SAVE DETAILS'}
            </button>
          </form>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
            INITIATE YOUR ALLIANCE
          </h2>

          <p className="text-[11px] sm:text-sm text-[#E8E2D6]/70 uppercase tracking-widest max-w-xl mx-auto">
            PURCHASE ANY PIECE FROM BATCH 001 TO AUTOMATICALLY CLAIM ONE OF THE REMAINING FOUNDER KEYS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="/batch-001"
              className="group w-full sm:w-auto py-3.5 sm:py-4 px-8 sm:px-10 bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-black text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.9)] cursor-pointer backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="group-hover:text-[#D4AF37] transition-colors duration-300">
                SECURE ALLOCATION NOW
              </span>
            </Link>

            <Link
              href="/"
              className="group w-full sm:w-auto py-3.5 sm:py-4 px-8 border border-[#2D323E] bg-[#12141B]/95 text-[#E8E2D6] font-bold text-xs uppercase tracking-widest rounded-full cursor-pointer backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="group-hover:text-[#D4AF37] transition-colors duration-300">
                RETURN TO HOMEPAGE
              </span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}