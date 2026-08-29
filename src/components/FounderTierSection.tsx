'use client';

import Link from "next/link";

// Single inline SVG component
function GoldenLockIcon() {
  return (
    <div className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#D4AF37" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 filter drop-shadow-[0_0_6px_#D4AF37]"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>
  );
}

export default function FounderTiers() {
  return (
    <section className="relative py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-[#0A0B0D] border-b border-[#2D323E] overflow-hidden">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/modren gym.png"
          alt="Gym Aesthetic Background"
          className="w-full h-full object-cover object-center opacity-75 filter brightness-90 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/80 via-[#0A0B0D]/65 to-[#0A0B0D]/90" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Responsive Grid: 1 Column on Mobile, 2 Columns on Desktop */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 relative z-10">
        
        {/* Tier 1: Absolute Origin Tier */}
        <div className="relative rounded-2xl border border-[#D4AF37]/40 bg-[#12141B]/85 p-5 sm:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(212,175,55,0.08)] hover:border-[#D4AF37] transition-all duration-500 group overflow-hidden backdrop-blur-md">
          
          <div className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 text-5xl sm:text-[70px] font-black font-monument text-[#D4AF37]/[0.05] select-none pointer-events-none uppercase">
            01
          </div>

          <div>
            {/* Header Status */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2.5 sm:px-3 py-1 rounded-full font-bold">
                ACTIVE
              </span>
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]" />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-monument uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF7] via-[#F4E2B1] to-[#D4AF37] mb-3 sm:mb-4 leading-tight">
              ABSOLUTE<br />ORIGIN TIER.
            </h3>
            
            {/* Counter Section */}
            <div className="flex justify-between items-baseline mb-2 font-mono">
              <p className="text-[10px] sm:text-[11px] tracking-wider text-[#E8E2D6] uppercase font-bold">
                REMAINING
              </p>
              <p className="text-xs font-black text-[#D4AF37] tracking-widest">
                14 <span className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 font-normal">/ 25</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#1A1D26] rounded-full overflow-hidden mb-3 sm:mb-4 border border-[#2D323E] p-[1px] relative">
              <div 
                className="h-full bg-gradient-to-r from-[#B8952B] to-[#D4AF37] rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(212,175,55,0.8)]" 
                style={{ width: '56%' }} 
              />
            </div>

            <p className="text-[10px] sm:text-[11px] font-mono text-[#E8E2D6]/85 uppercase tracking-wider mb-5 sm:mb-6 leading-relaxed bg-[#0A0B0D]/75 p-2.5 sm:p-3 rounded-lg border border-[#2D323E]/50">
               50% LIFETIME PRICE ALLOCATION. <br />
              <span className="text-[#E8E2D6]/50 text-[8px] sm:text-[9px]">CAP: RS 200K/YR.</span>
            </p>
          </div>

          {/* Secure Key Button */}
          <Link 
            href="/batch-001" 
            className="w-full bg-[#D4AF37] hover:bg-[#b8952b] text-black font-mono text-xs font-black uppercase py-3 sm:py-3.5 tracking-[0.2em] sm:tracking-[0.25em] transition-all duration-300 rounded-xl text-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] active:scale-[0.98] inline-block"
          >
            SECURE THE KEY →
          </Link>
        </div>

        {/* Tier 2: Sentinel Tier */}
        <div className="relative rounded-2xl border border-[#2D323E] bg-[#12141B]/90 p-5 sm:p-8 flex flex-col justify-between opacity-85 backdrop-blur-md overflow-hidden">
          
          <div className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 text-5xl sm:text-[70px] font-black font-monument text-white/[0.05] select-none pointer-events-none uppercase">
            02
          </div>

          <div>
            {/* Header Status with Golden Lock Badge */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#A1A1AA] bg-[#1A1D26] border border-[#2D323E] px-2.5 sm:px-3 py-1 rounded-full font-bold">
                PHASE 02
              </span>
              <GoldenLockIcon />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-monument uppercase tracking-tight text-[#E4E4E7] mb-3 sm:mb-4 leading-tight">
              SENTINEL<br />TIER.
            </h3>

            {/* Counter Section */}
            <div className="flex justify-between items-baseline mb-2 font-mono">
              <p className="text-[10px] sm:text-[11px] tracking-wider text-[#A1A1AA] uppercase font-bold">
                REMAINING
              </p>
              <p className="text-xs font-black text-[#A1A1AA] tracking-widest">
                0 <span className="text-[9px] sm:text-[10px] text-[#71717A] font-normal">/ 25</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#1A1D26] rounded-full overflow-hidden mb-3 sm:mb-4 border border-[#2D323E]">
              <div className="h-full bg-[#3F3F46] w-0" />
            </div>

            <p className="text-[10px] sm:text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-5 sm:mb-6 leading-relaxed bg-[#0A0B0D]/75 p-2.5 sm:p-3 rounded-lg border border-[#2D323E]/80">
              UNLOCKS AFTER BATCH 001 COMPLETION.
            </p>
          </div>

          <button 
            disabled 
            className="w-full border border-[#2D323E] text-[#71717A] bg-[#0A0B0D]/40 font-mono text-xs font-black uppercase py-3 sm:py-3.5 tracking-[0.2em] sm:tracking-[0.25em] rounded-xl text-center cursor-not-allowed"
          >
            LOCKED
          </button>
        </div>

      </div>
    </section>
  );
}