'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowLeft, 
  ShoppingCart, 
  ChevronRight, 
  Check,
  X 
} from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1920&auto=format&fit=crop',
];

const CATALOGUE_PRODUCTS = [
  {
    id: 'B001-HD01',
    title: 'TYPE 1: HEAVYWEIGHT OVERSIZED HOODIE',
    msrp: 'PKR 2,499',
    founderPrice: 'PKR 1,999',
    gsm: '500 GSM',
    fabric: 'FRENCH TERRY FLEECE',
    category: 'HOODIES',
    status: 'IN STOCK',
    specs: 'PUMP COVER FIT // 3D HIGH-BUILD RUBBERIZED SILICONE',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-HD02',
    title: 'TYPE 2: ARCHITECTURAL ZIP-UP HOODIE',
    msrp: 'PKR 2,899',
    founderPrice: 'PKR 2,319',
    gsm: '520 GSM',
    fabric: 'HEAVY COTTON FLEECE',
    category: 'HOODIES',
    status: 'IN STOCK',
    specs: 'DOUBLE-HEADED MATTE BLACK ZIPPER // DROP SHOULDER',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-HD03',
    title: 'TYPE 3: BALACLAVA TACTICAL HOODIE',
    msrp: 'PKR 3,100',
    founderPrice: 'PKR 2,480',
    gsm: '480 GSM',
    fabric: 'THERMAL FLEECE BLEND',
    category: 'HOODIES',
    status: 'LOW STOCK',
    specs: 'INTEGRATED MASK SYSTEM // REINFORCED ELBOW COLLAR',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-TE01',
    title: 'TYPE 1: STRUCTURAL COMPRESSION TEE',
    msrp: 'PKR 2,499',
    founderPrice: 'PKR 1,999',
    gsm: '300 GSM',
    fabric: 'ELASTANE COTTON BLEND',
    category: 'TEES',
    status: 'IN STOCK',
    specs: 'TECH-COMPRESSION // HIGH-BUILD MATTE BLACK WORDMARK',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-TE02',
    title: 'TYPE 2: OVERSIZED DROP-SHOULDER TEE',
    msrp: 'PKR 1,899',
    founderPrice: 'PKR 1,519',
    gsm: '280 GSM',
    fabric: 'COMBED ORGANIC COTTON',
    category: 'TEES',
    status: 'IN STOCK',
    specs: 'RAW HEM DETAIL // EMBOSSED LOGO STAMP',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-TE03',
    title: 'TYPE 3: ACID WASH TACTICAL SHIRT',
    msrp: 'PKR 2,199',
    founderPrice: 'PKR 1,759',
    gsm: '320 GSM',
    fabric: 'VINTAGE WASH COTTON',
    category: 'TEES',
    status: 'LOW STOCK',
    specs: 'DISTRESSED SEAMS // TACTICAL CHEST POCKET',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-VT01',
    title: 'TYPE 1: TACTICAL UTILITY VEST',
    msrp: 'PKR 3,200',
    founderPrice: 'PKR 2,560',
    gsm: 'CORDURA 1000D',
    fabric: 'REINFORCED NYLON / MESH',
    category: 'OUTERWEAR',
    status: 'LOW STOCK',
    specs: 'LASER-ETCHED STAINLESS STEEL CREST // MODULAR POCKETS',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-JK02',
    title: 'TYPE 2: ARCHITECTURAL BOMBER JACKET',
    msrp: 'PKR 4,500',
    founderPrice: 'PKR 3,600',
    gsm: 'WATERPROOF MESH',
    fabric: 'BALLISTIC NYLON SHELL',
    category: 'OUTERWEAR',
    status: 'PRE-ORDER',
    specs: 'THERMAL INSULATION // HARDWARE MOLLE SYSTEM',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-JK03',
    title: 'TYPE 3: HEAVY ANORAK WINDSTOPPER',
    msrp: 'PKR 3,999',
    founderPrice: 'PKR 3,199',
    gsm: 'WEATHER-PROOF',
    fabric: 'RIPSTOP POLYESTER',
    category: 'OUTERWEAR',
    status: 'IN STOCK',
    specs: 'HALF-ZIP DISPATCH ENCLOSURE // REFLECTIVE PIPING',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-SW01',
    title: 'TYPE 1: HEAVY FLEECE SWEATPANTS',
    msrp: 'PKR 2,499',
    founderPrice: 'PKR 1,999',
    gsm: '500 GSM',
    fabric: 'FRENCH TERRY FLEECE',
    category: 'BOTTOMS',
    status: 'IN STOCK',
    specs: 'STRUCTURAL ARMOR // DEEP CORDED ANKLE CINCH',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-PT02',
    title: 'TYPE 2: MODULAR CARGO PANT',
    msrp: 'PKR 3,199',
    founderPrice: 'PKR 2,559',
    gsm: '350 GSM',
    fabric: 'COTTON TWILL RIPSTOP',
    category: 'BOTTOMS',
    status: 'IN STOCK',
    specs: '8-POCKET CONFIGURATION // ADJUSTABLE KNEE STRAPS',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-SH03',
    title: 'TYPE 3: TACTICAL TRAINING SHORTS',
    msrp: 'PKR 1,799',
    founderPrice: 'PKR 1,439',
    gsm: '240 GSM',
    fabric: 'STRETCH NYLON BLEND',
    category: 'BOTTOMS',
    status: 'IN STOCK',
    specs: 'BUILT-IN COMPRESSION LINER // ZIPPERED KEY POCKET',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-AC01',
    title: 'OBSIDIAN ALLOY KEYCHAIN',
    msrp: 'PKR 1,299',
    founderPrice: 'PKR 1,039',
    gsm: 'HARDWARE',
    fabric: 'ZINC ALLOY / STEEL',
    category: 'ACCESSORIES',
    status: 'IN STOCK',
    specs: 'LASER-ETCHED SERIAL // HEAVY-DUTY CARABINER',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-AC02',
    title: 'TACTICAL CHEST RIG SLING',
    msrp: 'PKR 2,299',
    founderPrice: 'PKR 1,839',
    gsm: 'CORDURA 500D',
    fabric: 'WATER-RESISTANT NYLON',
    category: 'ACCESSORIES',
    status: 'LOW STOCK',
    specs: 'FIDLOCK MAGNETIC BUCKLE // MODULAR STRAPS',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'B001-AC03',
    title: '500 GSM FLEECE BALACLAVA',
    msrp: 'PKR 1,199',
    founderPrice: 'PKR 959',
    gsm: '500 GSM',
    fabric: 'FRENCH TERRY FLEECE',
    category: 'ACCESSORIES',
    status: 'IN STOCK',
    specs: 'EMBROIDERED CREST // ERGONOMIC CONTOUR CUT',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
  },
];

const CATEGORIES = ['ALL', 'HOODIES', 'TEES', 'OUTERWEAR', 'BOTTOMS', 'ACCESSORIES'];

export default function ShopPage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [toastNotification, setToastNotification] = useState<{ show: boolean; title: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const existingCart = JSON.parse(localStorage.getItem('kult_cart') || '[]');
    const totalItems = existingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: typeof CATALOGUE_PRODUCTS[0]) => {
    const existingCart = JSON.parse(localStorage.getItem('kult_cart') || '[]');
    const numericPrice = parseInt(product.founderPrice.replace(/[^0-9]/g, ''), 10);
    const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        title: product.title,
        price: numericPrice,
        quantity: 1,
        gsm: product.gsm,
        fabric: product.fabric,
        image: product.image,
      });
    }

    localStorage.setItem('kult_cart', JSON.stringify(existingCart));

    updateCartCount();

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);

    setToastNotification({
      show: true,
      title: product.title,
    });

    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  const filteredProducts =
    selectedCategory === 'ALL'
      ? CATALOGUE_PRODUCTS
      : CATALOGUE_PRODUCTS.filter((item) => item.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN STOCK':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3" />
            IN STOCK
          </span>
        );
      case 'LOW STOCK':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 backdrop-blur-md">
            <ShieldAlert className="w-3 h-3" />
            LOW STOCK
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest font-bold text-sky-400 bg-sky-950/80 border border-sky-500/40 backdrop-blur-md">
            <Clock className="w-3 h-3" />
            PRE-ORDER
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      {/* Dynamic Toast Popup Notification */}
      <AnimatePresence>
        {toastNotification?.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-20 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm bg-[#12141B]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex items-start gap-3"
          >
            <div className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                  PRODUCT ALLOCATED
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#E8E2D6] uppercase tracking-wide truncate mt-1">
                {toastNotification.title}
              </h4>
              <p className="text-[10px] text-[#E8E2D6]/60 uppercase tracking-widest mt-0.5">
                ADDED TO TACTICAL DISPATCH CART
              </p>
            </div>

            <button
              onClick={() => setToastNotification(null)}
              className="text-[#E8E2D6]/40 hover:text-[#D4AF37] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Hero Slider */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 0.65, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentSlide]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/80 via-[#0A0B0D]/60 to-[#0A0B0D]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#2D323E] bg-[#12141B]/90 hover:border-[#3A3F44] transition-all duration-200 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-all" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors">
                HOME
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#E8E2D6]/50">
              <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                KULT
              </Link>
              <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold">CATALOGUE</span>
            </div>
                  
            <Link
              href="/Cart"
              className="relative flex items-center gap-2.5 px-3 sm:px-5 py-2 rounded-full border border-[#2D323E] bg-[#12141B]/90 hover:border-[#2D323E] transition-all duration-200 group cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#D4AF37] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.2em] text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors">
                CART
              </span>
            </Link>
          </div>
        </nav>

        {/* Header Section */}
        <header className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/60 backdrop-blur-md px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[9px] text-[#D4AF37] border border-[#D4AF37]/60 bg-[#0A0B0D]/90 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    PUBLIC RELEASE // BATCH 001
                  </span>
                  <span className="text-[10px] text-[#E8E2D6]/70 tracking-widest uppercase font-semibold">
                    15 ACTIVE UNITS
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#E8E2D6] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  ARCHITECTURAL HARDWARE
                </h1>
              </div>

              <p className="text-xs text-[#E8E2D6]/80 uppercase tracking-widest max-w-sm leading-relaxed border-l-2 border-[#D4AF37] pl-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                HEAVYWEIGHT COMPRESSION & STRUCTURAL ARMOR CRAFTED FOR RESISTANCE AND UNYIELDING DURABILITY.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2D323E]/60">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border border-[#2D323E] bg-[#12141B]/80 transition-colors cursor-pointer ${
                        isActive
                          ? 'text-[#D4AF37] border-[#D4AF37]/50'
                          : 'text-[#E8E2D6]/60 hover:text-[#E8E2D6]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2">
                {HERO_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-[#2D323E] hover:bg-[#D4AF37]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Product Grid Layout */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-6 flex flex-col justify-between space-y-6 hover:border-[#D4AF37] transition-all duration-300 group rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)]"
                >
                  <div className="space-y-4">
                    {/* Visual Product Showcase Box */}
                    <div className="h-72 bg-[#0A0B0D]/95 border border-[#2D323E] rounded-xl relative overflow-hidden group-hover:border-[#D4AF37]/40 transition-colors">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-transparent to-black/30 opacity-70" />

                      <span className="absolute top-3 left-3 text-[10px] bg-[#2D323E]/90 backdrop-blur-md text-[#E8E2D6] px-3 py-1 rounded-md uppercase tracking-widest font-bold border border-[#3A3F44]">
                        {product.gsm}
                      </span>
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(product.status)}
                      </div>
                      <span className="absolute bottom-3 left-3 text-[9px] text-[#E8E2D6]/60 font-bold uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
                        [ {product.id} ]
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest">
                        {product.specs}
                      </p>
                      <p className="text-[11px] text-[#E8E2D6]/50 uppercase tracking-widest">
                        FABRIC: {product.fabric}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2D323E] space-y-3">
                    <div className="flex justify-between items-baseline bg-[#0A0B0D]/90 p-3 rounded-xl border border-[#2D323E]">
                      <div>
                        <span className="text-[9px] text-[#E8E2D6]/40 block uppercase tracking-widest font-bold">
                          RETAIL MSRP
                        </span>
                        <span className="text-base font-black text-[#E8E2D6]">{product.msrp}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-[#D4AF37] block font-bold uppercase tracking-widest">
                          FOUNDER TIER
                        </span>
                        <span className="text-xs font-bold text-[#D4AF37]">{product.founderPrice}</span>
                      </div>
                    </div>

                    {/* Secure Allocation Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-3.5 font-black text-xs uppercase tracking-[0.25em] transition-all cursor-pointer rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.25)] ${
                        addedId === product.id
                          ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                          : 'bg-[#D4AF37] hover:bg-[#b8952b] text-black hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)]'
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Secure Allocation</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>SECURE ALLOCATION</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* About Product Navigation Link */}
                    <Link
                      href={`/shop/${product.id}`}
                      className="w-full py-3 font-bold text-xs uppercase tracking-[0.2em] transition-all rounded-xl border border-[#2D323E] bg-[#0A0B0D]/80 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] text-[#E8E2D6]/80 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>ABOUT PRODUCT</span>
                      <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}