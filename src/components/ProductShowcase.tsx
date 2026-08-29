'use client';

import Link from "next/link";
import Image from "next/image";

export default function ProductShowcase() {
  return (
    <section id="batch001" className="relative w-full py-12 md:py-16 px-4 md:px-8 border-b border-[#1E2026] bg-[#0A0B0D] overflow-hidden flex justify-center items-center">
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Main Showcase Container */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
          
          {/* Main Product Image */}
          <div className="relative w-full overflow-hidden rounded-lg shadow-2xl">
            <img 
              src="/showcase image.png" 
              alt="KULT ORIGIN Showcase" 
              className="w-full h-auto object-cover max-h-[75vh] md:max-h-[85vh] filter brightness-95 contrast-105"
            />

            {/* LEFT POINTER: Points directly at 'ORIGIN' text near the bottom left */}
            <div className="absolute left-[3%] sm:left-[5%] md:left-[8%] bottom-[28%] sm:bottom-[30%] z-20 flex items-center gap-2 sm:gap-3">
              <p className="text-[9px] min-[400px]:text-[10px] sm:text-xs md:text-sm font-sans font-semibold text-[#E6E6E6] text-right uppercase tracking-wider leading-tight drop-shadow-md">
                500 GSM FLEECE.<br />
                PUMP COVER FIT.<br />
                NO ORDINARY SYMBOLS.
              </p>
              {/* Line ending with a dot on the right side */}
              <div className="flex items-center">
                <div className="w-8 sm:w-16 md:w-24 h-[1px] bg-white/70" />
                <div className="w-2 h-2 rounded-full border border-white bg-black/60 -ml-1" />
              </div>
            </div>

            {/* RIGHT POINTER: Points directly at the top emblem/logo mark */}
            <div className="absolute right-[3%] sm:right-[5%] md:right-[8%] top-[25%] sm:top-[28%] z-20 flex items-center gap-2 sm:gap-3">
              {/* Line starting with a dot on the left side */}
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full border border-white bg-black/60 -mr-1 z-10" />
                <div className="w-8 sm:w-16 md:w-24 h-[1px] bg-white/70" />
              </div>
              <p className="text-[9px] min-[400px]:text-[10px] sm:text-xs md:text-sm font-sans font-semibold text-[#E6E6E6] text-left uppercase tracking-wider leading-tight drop-shadow-md">
                HIGH-BUILD<br />
                MATTE-BLACK<br />
                WORDMARK
              </p>
            </div>

            {/* ACTION BUTTON OVERLAY (Positioned exactly at bottom-center of the image) */}
            <div className="absolute bottom-[8%] sm:bottom-[10%] left-1/2 -translate-x-1/2 z-30">
              <Link 
                href="/checkout" 
                className="bg-white hover:bg-gray-200 text-black font-sans font-bold text-xs sm:text-sm uppercase py-2.5 sm:py-3 px-8 sm:px-10 tracking-widest rounded-md transition-all duration-300 shadow-2xl active:scale-95 inline-block text-center"
              >
                ADD TO BAG
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}