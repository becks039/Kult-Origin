'use client';

export default function FoundationSection() {
  return (
    <section className="relative w-full max-h-[220px] sm:max-h-[350px] md:max-h-none border-b border-[#2D323E] overflow-hidden flex items-center bg-[#0A0B0D]">
      {/* Container Height Controlled Image */}
      <img 
        src="/foundation image.jpg" 
        alt="Type 1 Foundation" 
        className="w-full h-[220px] sm:h-[350px] md:h-auto object-cover object-center block opacity-85 filter contrast-110"
      />

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0D]/90 via-[#0A0B0D]/50 to-transparent z-10" />

      {/* Text Layer */}
      <div className="absolute inset-0 p-4 sm:p-6 md:p-16 flex flex-col justify-center z-20">
        <div className="max-w-6xl space-y-2 sm:space-y-4">
          <span className="inline-block text-[9px] sm:text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 rounded-full uppercase tracking-[0.25em]">
            CORE ARCHITECTURE
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-black font-monument uppercase tracking-tighter leading-none text-[#E8E2D6] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            TYPE 1:<br />THE FOUNDATION.
          </h2>

          <p className="text-[10px] sm:text-xs md:text-base font-mono text-white/80 tracking-[0.15em] sm:tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            OVERSUITS. TECH-COMPRESSION. STRUCTURAL ARMOR.
          </p>
        </div>
      </div>
    </section>
  );
}