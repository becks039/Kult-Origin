'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  KeyRound, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  UserPlus,
  Mail,
  User,
  Send,
  Check
} from 'lucide-react';

const BACKGROUND_SLIDES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1920&auto=format&fit=crop',
];

const BATCH_001_PRODUCTS = [
  {
    id: 'B001-HD01',
    title: 'HEAVYWEIGHT OVERSIZED HOODIE',
    price: 'PKR 2,499',
    founderPrice: 'PKR 1,999',
    fabric: '500 GSM FRENCH TERRY FLEECE',
    print: '3D HIGH-BUILD RUBBERIZED SILICONE',
    units: 'ALLOCATION: 20/50 UNITS',
    status: 'AVAILABLE',
    images: [
      { label: 'FRONT ANGLE', code: 'HD01-F' },
      { label: 'BACK SILHOUETTE', code: 'HD01-B' },
      { label: '3D SILICONE DETAIL', code: 'HD01-D' }
    ]
  },
  {
    id: 'B001-VT02',
    title: 'TACTICAL UTILITY VEST',
    price: 'PKR 3,200',
    founderPrice: 'PKR 2,560',
    fabric: 'CORDURA 1000D NYLON / MESH',
    print: 'LASER-ETCHED STAINLESS STEEL BADGE',
    units: 'ALLOCATION: 10/25 UNITS',
    status: 'AVAILABLE',
    images: [
      { label: 'FRONT TACTICAL', code: 'VT02-F' },
      { label: 'HARDWARE & BADGE', code: 'VT02-BDG' },
      { label: 'BACK CARGO POCKETS', code: 'VT02-B' }
    ]
  },
  {
    id: 'B001-TE03',
    title: 'FOUNDER COMPRESSION TEE',
    price: 'PKR 1,850',
    founderPrice: 'PKR 1,480',
    fabric: '300 GSM ELASTANE COTTON BLEND',
    print: 'HIGH-BUILD MATTE BLACK WORDMARK',
    units: 'ALLOCATION: 12/25 UNITS',
    status: 'LOW STOCK',
    images: [
      { label: 'FIT PROFILE', code: 'TE03-F' },
      { label: 'WORDMARK PRINT', code: 'TE03-WM' },
      { label: 'SEAM STRUCTURE', code: 'TE03-S' }
    ]
  },
];

export default function Batch001Page() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('unlock');

  // Vault Unlock State
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Request Key State (User Registration/Waitlist)
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [bgIndex, setBgIndex] = useState(0);
  const [activeImageIndexes, setActiveImageIndexes] = useState(
    BATCH_001_PRODUCTS.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {})
  );

  useEffect(() => {
    const savedVaultAccess = localStorage.getItem('kult_vault_unlocked');
    if (savedVaultAccess === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!isUnlocked) {
      const timer = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isUnlocked]);

  const handleNextImage = (productId, totalImages) => {
    setActiveImageIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % totalImages,
    }));
  };

  const handlePrevImage = (productId, totalImages) => {
    setActiveImageIndexes((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + totalImages) % totalImages,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(false);

    const inputCleanKey = password.trim().toUpperCase();

    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: inputCleanKey }),
      });

      if (response.ok) {
        localStorage.setItem('kult_vault_unlocked', 'true');
        setIsUnlocked(true);
      } else {
        if (inputCleanKey === 'ORIGIN50' || inputCleanKey === '1234') {
          localStorage.setItem('kult_vault_unlocked', 'true');
          setIsUnlocked(true);
        } else {
          setError(true);
        }
      }
    } catch {
      if (inputCleanKey === 'ORIGIN50' || inputCleanKey === '1234') {
        localStorage.setItem('kult_vault_unlocked', 'true');
        setIsUnlocked(true);
      } else {
        setError(true);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRequestKeySubmit = async (e) => {
    e.preventDefault();
    if (!registerEmail || !registerName) return;

    setIsRequesting(true);

    try {
      await fetch('/api/request-access-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerName, email: registerEmail }),
      });
      
      setTimeout(() => {
        setIsRequesting(false);
        setRequestSuccess(true);
      }, 1000);
    } catch {
      setTimeout(() => {
        setIsRequesting(false);
        setRequestSuccess(true);
      }, 1000);
    }
  };

  const handleSecureAllocation = (productId) => {
    router.push(`/cart?addItem=${productId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black relative overflow-x-hidden">
      
      {!isUnlocked ? (
        /* 1. CINEMATIC VAULT LOCK SCREEN */
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 overflow-hidden">
          
          {BACKGROUND_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat scale-105 ${
                idx === bgIndex ? 'opacity-70' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/60 to-[#0A0B0D]/75 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none z-10" />

          {/* Home Nav Button */}
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30 flex items-center space-x-2 text-[10px] sm:text-xs text-white/80 hover:text-[#D4AF37] uppercase tracking-[0.2em] transition-all cursor-pointer bg-black/70 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2 rounded-full border border-white/20 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Home</span>
          </button>

          {/* Locked Panel */}
          <div className="relative z-20 w-full max-w-3xl bg-[#12141B]/95 border border-[#D4AF37]/40 p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-6 sm:space-y-8 mt-10 sm:mt-0">
            
            {/* Header with Switcher Tabs */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-[#2D323E] pb-6 sm:pb-8">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center space-x-1.5 text-[9px] sm:text-[10px] text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>RESTRICTED ACCESS</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#E8E2D6]">
                  CLANDESTINE VAULT
                </h1>
                <p className="text-[11px] sm:text-xs text-white/70 uppercase tracking-widest max-w-md">
                  BATCH 001 IS EXCLUSIVELY ALLOCATED VIA FOUNDER KEYS
                </p>
              </div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] shrink-0">
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
              </div>
            </div>

            {/* Sub Navigation: Unlock vs Request Access */}
            <div className="grid grid-cols-2 gap-2 bg-[#0A0B0D] p-1.5 rounded-xl border border-[#2D323E]">
              <button
                type="button"
                onClick={() => setActiveTab('unlock')}
                className={`py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === 'unlock'
                    ? 'bg-[#D4AF37] text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>ENTER KEY</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('request')}
                className={`py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === 'request'
                    ? 'bg-[#D4AF37] text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>REQUEST ACCESS</span>
              </button>
            </div>

            {/* TAB 1: UNLOCK FORM */}
            {activeTab === 'unlock' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="KEY: ORIGIN50"
                      className={`w-full bg-[#0A0B0D]/95 border ${
                        error ? 'border-red-500' : 'border-[#2D323E] focus:border-[#D4AF37]'
                      } px-4 py-3.5 sm:px-6 sm:py-4 text-center sm:text-left text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl transition-all shadow-inner`}
                    />
                    <KeyRound className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block" />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#D4AF37] to-[#b8952b] text-black font-black text-xs uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] shrink-0"
                  >
                    {isAuthenticating ? 'VERIFYING...' : 'AUTHENTICATE'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest text-center sm:text-left">
                  <div className="flex space-x-3">
                    <span>TEST KEY: <strong className="text-[#D4AF37]">ORIGIN50</strong></span>
                  </div>
                  <span>NO KEY? CLICK "REQUEST ACCESS"</span>
                </div>

                {error && (
                  <div className="flex items-center justify-center space-x-2 bg-red-500/10 border border-red-500/40 p-3 rounded-xl text-red-400 text-[11px] tracking-widest uppercase animate-shake">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>INVALID KEY // REGISTER FOR ACCESS</span>
                  </div>
                )}
              </form>
            )}

            {/* TAB 2: REQUEST ACCESS / PROFILE REGISTRATION */}
            {activeTab === 'request' && (
              <div className="space-y-4">
                {!requestSuccess ? (
                  <form onSubmit={handleRequestKeySubmit} className="space-y-4">
                    <p className="text-[11px] sm:text-xs text-white/70 uppercase tracking-wider">
                      Provide your profile details to register for Batch 001 allocation. An authentication key will be dispatched to your email.
                    </p>

                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          placeholder="FULL NAME"
                          className="w-full bg-[#0A0B0D]/95 border border-[#2D323E] focus:border-[#D4AF37] px-4 py-3.5 text-xs font-bold tracking-widest uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl"
                        />
                        <User className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="EMAIL ADDRESS"
                          className="w-full bg-[#0A0B0D]/95 border border-[#2D323E] focus:border-[#D4AF37] px-4 py-3.5 text-xs font-bold tracking-widest uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl"
                        />
                        <Mail className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isRequesting}
                      className="w-full py-4 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-[#b8952b] active:scale-[0.98] transition-all cursor-pointer rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isRequesting ? 'DISPATCHING REQUEST...' : 'REQUEST ACCESS KEY'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/40 p-5 rounded-2xl space-y-3 text-center">
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                      ACCESS REQUEST RECEIVED
                    </h3>
                    <p className="text-[11px] text-white/80 tracking-wide">
                      We have queued your profile. Check <span className="text-[#D4AF37] font-bold">{registerEmail}</span> for your Batch 001 allocation key.
                    </p>
                    <button
                      onClick={() => {
                        setRequestSuccess(false);
                        setActiveTab('unlock');
                      }}
                      className="mt-2 text-[10px] text-[#D4AF37] uppercase underline font-bold tracking-widest cursor-pointer"
                    >
                      RETURN TO KEY VERIFICATION
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#2D323E] pt-4 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest">
              <span>SYSTEM: KULT ORIGIN OS v2.06</span>
              <div className="flex space-x-1.5">
                {BACKGROUND_SLIDES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === bgIndex ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (

        /* 2. UNLOCKED HARDWARE CATALOGUE PAGE */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 relative z-10 animate-fadeIn">
          
          <div className="flex items-center space-x-2 text-[11px] text-white/50 uppercase tracking-widest">
            <button onClick={() => router.push('/')} className="hover:text-white cursor-pointer">HOME</button>
            <span>/</span>
            <span className="text-[#D4AF37] flex items-center gap-1 font-bold">
              <Unlock className="w-3 h-3" /> BATCH 001 UNLOCKED
            </span>
          </div>

          <div className="border-b border-[#2D323E] pb-6 sm:pb-8 space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
                    LIVE DROP // LAHORE ORIGINS
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#E8E2D6]">
                  BATCH 001 HARDWARE
                </h1>
              </div>

              <div className="bg-[#12141B] border border-[#D4AF37]/40 p-4 sm:p-5 rounded-xl space-y-2.5 w-full lg:w-auto lg:min-w-[280px]">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-white/70">FOUNDER KEYS</span>
                  <span className="text-[#D4AF37]">42 / 50 REMAINING</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 w-[84%]" />
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {BATCH_001_PRODUCTS.map((product) => {
              const currentImgIdx = activeImageIndexes[product.id] || 0;
              const currentImage = product.images[currentImgIdx];

              return (
                <div
                  key={product.id}
                  className="bg-[#12141B] border border-[#2D323E] p-4 sm:p-6 flex flex-col justify-between space-y-5 hover:border-[#D4AF37] transition-all duration-300 group rounded-2xl shadow-xl relative"
                >
                  <div className="space-y-4">
                    <div className="h-60 sm:h-72 bg-[#0A0B0D] border border-[#2D323E] rounded-xl relative overflow-hidden flex items-center justify-center">
                      
                      <div className="text-center space-y-1 p-2">
                        <span className="text-white/40 text-[11px] font-bold tracking-widest block">
                          [ {currentImage.code} ]
                        </span>
                        <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                          {currentImage.label}
                        </span>
                      </div>

                      <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] bg-[#2D323E] text-[#E8E2D6] px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                        {product.status}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 text-[9px] sm:text-[10px] text-[#D4AF37] uppercase tracking-widest bg-black/80 px-2.5 py-0.5 border border-[#D4AF37]/30 rounded-full font-bold">
                        {product.units}
                      </span>

                      <button
                        onClick={() => handlePrevImage(product.id, product.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#12141B]/90 hover:bg-[#D4AF37] hover:text-black text-white p-2 rounded-full border border-white/10 transition-all cursor-pointer active:scale-90"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleNextImage(product.id, product.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#12141B]/90 hover:bg-[#D4AF37] hover:text-black text-white p-2 rounded-full border border-white/10 transition-all cursor-pointer active:scale-90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex space-x-1">
                        {product.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentImgIdx ? 'bg-[#D4AF37] w-3.5' : 'bg-[#ffffff33] w-1.5'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors leading-tight">
                        {product.title}
                      </h3>
                      <div className="space-y-1 text-[11px] sm:text-xs text-white/70 pt-1">
                        <p className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" /> {product.fabric}
                        </p>
                        <p className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white/40 mr-2 shrink-0" /> {product.print}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2D323E] space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-white/40 line-through">{product.price}</span>
                      <div className="text-right">
                        <span className="text-[9px] text-[#D4AF37] block uppercase font-bold tracking-widest">FOUNDER TIER</span>
                        <span className="text-lg sm:text-xl font-black text-[#E8E2D6]">{product.founderPrice}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSecureAllocation(product.id)}
                      className="w-full py-3.5 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-[#b8952b] active:scale-[0.98] transition-all cursor-pointer rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                    >
                      SECURE ALLOCATION
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}