'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c0e] border-t border-white/10 py-12 px-6 md:px-12 text-center flex flex-col items-center justify-center font-mono">
      <h3 className="text-2xl md:text-3xl font-black font-monument tracking-wider text-[#D4AF37] uppercase mb-3">
        KULT ORIGIN
      </h3>

      <p className="text-xs sm:text-sm font-mono text-white/60 max-w-md mx-auto leading-relaxed mb-6 uppercase tracking-widest">
        High-performance engineering crafted in Lahore for a global audience.
      </p>

      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest border-t border-white/5 pt-4 w-full max-w-xs">
        © {new Date().getFullYear()} KULT ORIGIN. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}