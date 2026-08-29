'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowLeft, 
  ShoppingCart, 
  ChevronRight, 
  Check,
  X,
  Layers,
  Ruler,
  Plus,
  Minus
} from 'lucide-react';

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
    description: 'Engineered with double-faced 500 GSM French Terry Fleece for absolute thermal retention and heavy-duty structural drop. Built to maintain form under heavy physical output with reinforced twin-needle stitching across key stress contours.',
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
    description: 'Featuring dual-axis matte black hardware and extended drop-shoulder silhouette. Tailored for full tactical mobility while maintaining structured geometric drape.',
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
    description: 'Tactical cold-weather garment featuring a integrated contour neck gaiter mask and abrasion-resistant elbow overlays for harsh field conditions.',
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
    description: 'High-density 300 GSM active compression weave designed to restrict muscle lateral displacement and improve blood circulation during high intensity training.',
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
    description: 'Ultra-heavy combed organic cotton base cut in an architectural boxy fit. Features raw edge seam finishes and micro-embossed insignia on chest.',
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
    description: 'Custom mineral wash finish creating individual patina patterns per unit. Equipped with a reinforced ballistic nylon pocket array on left chest.',
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
    description: 'Modular load-bearing outer frame fabricated from ultra-durable Cordura 1000D. Features quick-release hardware and laser-etched stainless crest.',
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
    description: 'Heavy weather-shield shell built with thermal retention quilting and modular exterior strap webbing for custom module attachment.',
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
    description: 'Windproof ripstop outer shell designed for climate transition protection. Features high-visibility 3M reflective accent seam lines.',
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
    description: '500 GSM tailored joggers with knee articulation darting and heavy-duty elastic ankle cinch cords to adjust fit profiles on demand.',
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
    description: 'Reinforced 8-pocket tactical trousers constructed with cotton twill ripstop weave and double-stitched stress zones.',
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
    description: 'High-mobility athletic shorts with built-in moisture-wicking inner liner and heat-sealed zippered pockets.',
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
    description: 'Precision CNC-milled zinc alloy keyclip etched with individual batch sequence identification numbers.',
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
    description: 'Compact chest carrier with Fidlock magnetic rapid-release latch and waterproof zip enclosures.',
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
    description: 'Heavyweight headwear designed to contour precisely around head and neck contours for extreme element isolation.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{ show: boolean; title: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState('LARGE');
  const [quantity, setQuantity] = useState(1);

  const product = CATALOGUE_PRODUCTS.find((p) => p.id === productId) || CATALOGUE_PRODUCTS[0];

  // Guaranteed Unique Duplicate-Safe extraction:
  const categoryMatches = CATALOGUE_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const fallbackMatches = CATALOGUE_PRODUCTS.filter((p) => p.id !== product.id);
  const combinedList = [...categoryMatches, ...fallbackMatches];

  const uniqueProductsMap = new Map();
  combinedList.forEach((item) => {
    if (!uniqueProductsMap.has(item.id)) {
      uniqueProductsMap.set(item.id, item);
    }
  });

  const relevantProducts = Array.from(uniqueProductsMap.values()).slice(0, 3);

  const updateCartCount = () => {
    const existingCart = JSON.parse(localStorage.getItem('kult_cart') || '[]');
    const totalItems = existingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = (targetProduct: typeof CATALOGUE_PRODUCTS[0]) => {
    const existingCart = JSON.parse(localStorage.getItem('kult_cart') || '[]');
    const numericPrice = parseInt(targetProduct.founderPrice.replace(/[^0-9]/g, ''), 10);
    const existingIndex = existingCart.findIndex((item: any) => item.id === targetProduct.id && item.size === selectedSize);

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push({
        id: targetProduct.id,
        title: targetProduct.title,
        price: numericPrice,
        quantity: quantity,
        size: selectedSize,
        gsm: targetProduct.gsm,
        fabric: targetProduct.fabric,
        image: targetProduct.image,
      });
    }

    localStorage.setItem('kult_cart', JSON.stringify(existingCart));
    updateCartCount();

    setAddedId(targetProduct.id);
    setToastNotification({ show: true, title: targetProduct.title });

    setTimeout(() => {
      setAddedId(null);
    }, 2500);

    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

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
      
      {/* Toast Notification */}
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

      {/* Navigation Bar */}
      <nav className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#2D323E] bg-[#12141B]/90 hover:border-[#3A3F44] transition-all duration-200 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-all" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors">
              BACK TO CATALOGUE
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#E8E2D6]/50">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              KULT
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
            <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
              CATALOGUE
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-bold">{product.id}</span>
          </div>

          {/* Lowercase Nav Cart Link */}
          <Link
            href="/Cart"
            className="relative flex items-center gap-2.5 px-3 sm:px-5 py-2 rounded-full border border-[#2D323E] bg-[#12141B]/90 hover:border-[#D4AF37]/50 transition-all duration-200 group cursor-pointer"
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

      {/* Main Product Detail Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Visual Matrix */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-[450px] sm:h-[550px] bg-[#12141B]/90 border border-[#2D323E] rounded-2xl relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-transparent to-black/20" />

              <span className="absolute top-4 left-4 text-xs bg-[#2D323E]/90 backdrop-blur-md text-[#E8E2D6] px-4 py-1.5 rounded-lg uppercase tracking-widest font-bold border border-[#3A3F44]">
                {product.gsm}
              </span>

              <div className="absolute top-4 right-4">
                {getStatusBadge(product.status)}
              </div>

              <span className="absolute bottom-4 left-4 text-xs text-[#E8E2D6]/70 font-bold uppercase tracking-widest bg-black/70 px-3 py-1.5 rounded-md border border-white/10 backdrop-blur-md">
                [ SPECIFICATION MATRIX ID: {product.id} ]
              </span>
            </div>
          </div>

          {/* Right Column: Technical Details & Allocation Actions */}
          <div className="lg:col-span-5 space-y-8 bg-[#12141B]/60 border border-[#2D323E] p-8 rounded-2xl backdrop-blur-md shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37]/60 bg-[#0A0B0D] px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold">
                  {product.category} ARCHITECTURE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#E8E2D6] leading-snug">
                {product.title}
              </h1>
              <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">
                {product.specs}
              </p>
            </div>

            {/* Pricing Panel */}
            <div className="flex justify-between items-center bg-[#0A0B0D] p-4 rounded-xl border border-[#2D323E]">
              <div>
                <span className="text-[9px] text-[#E8E2D6]/40 block uppercase tracking-widest font-bold">
                  RETAIL MSRP
                </span>
                <span className="text-xl font-black text-[#E8E2D6]">{product.msrp}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#D4AF37] block font-bold uppercase tracking-widest">
                  FOUNDER TIER
                </span>
                <span className="text-base font-bold text-[#D4AF37]">{product.founderPrice}</span>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E8E2D6]/80 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                PRODUCT BREAKDOWN
              </h3>
              <p className="text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                {product.description || 'Heavyweight compression & structural armor crafted for resistance and unyielding durability.'}
              </p>
            </div>

            {/* Tactical Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#0A0B0D]/80 p-3 rounded-xl border border-[#2D323E]">
                <span className="text-[9px] text-[#E8E2D6]/40 block uppercase font-bold">FABRIC WEAVE</span>
                <span className="text-xs font-bold text-[#E8E2D6] uppercase tracking-wider">{product.fabric}</span>
              </div>
              <div className="bg-[#0A0B0D]/80 p-3 rounded-xl border border-[#2D323E]">
                <span className="text-[9px] text-[#E8E2D6]/40 block uppercase font-bold">DENSITY WEIGHT</span>
                <span className="text-xs font-bold text-[#E8E2D6] uppercase tracking-wider">{product.gsm}</span>
              </div>
            </div>

            {/* Size Configuration */}
            <div className="space-y-3">
              <label className="text-[10px] text-[#E8E2D6]/70 uppercase font-bold tracking-widest flex items-center gap-2">
                <Ruler className="w-3.5 h-3.5 text-[#D4AF37]" />
                SELECT SIZE CONFIGURATION
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['SMALL', 'MEDIUM', 'LARGE', 'X-LARGE'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-lg border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#0A0B0D] text-[#E8E2D6]/70 border-[#2D323E] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-[10px] text-[#E8E2D6]/70 uppercase font-bold tracking-widest flex items-center gap-2">
                QUANTITY ALLOCATION
              </label>
              <div className="flex items-center gap-4 bg-[#0A0B0D] p-2 rounded-xl border border-[#2D323E] w-max">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-[#12141B] border border-[#2D323E] text-[#E8E2D6] hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-6 text-center text-[#E8E2D6]">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-[#12141B] border border-[#2D323E] text-[#E8E2D6] hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Allocation CTA Button */}
            <button
              onClick={() => handleAddToCart(product)}
              className={`w-full py-4 font-black text-xs uppercase tracking-[0.25em] transition-all cursor-pointer rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.25)] ${
                addedId === product.id
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                  : 'bg-[#D4AF37] hover:bg-[#b8952b] text-black hover:shadow-[0_4px_30px_rgba(212,175,55,0.4)]'
              }`}
            >
              {addedId === product.id ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ALLOCATION SECURED</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>SECURE ALLOCATION</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Relevant Products Section */}
        <div className="pt-12 border-t border-[#2D323E]/80 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">RELEVANT UNITS</span>
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#E8E2D6]">
                COMPATIBLE HARDWARE
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              VIEW FULL CATALOGUE <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relevantProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-6 flex flex-col justify-between space-y-6 hover:border-[#D4AF37] transition-all duration-300 group rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
              >
                <div className="space-y-4">
                  <div className="h-60 bg-[#0A0B0D]/95 border border-[#2D323E] rounded-xl relative overflow-hidden group-hover:border-[#D4AF37]/40 transition-colors">
                    <img
                      src={relProduct.image}
                      alt={relProduct.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <span className="absolute top-3 left-3 text-[10px] bg-[#2D323E]/90 backdrop-blur-md text-[#E8E2D6] px-3 py-1 rounded-md uppercase tracking-widest font-bold">
                      {relProduct.gsm}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {relProduct.title}
                    </h3>
                    <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest">
                      {relProduct.specs}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2D323E] space-y-3">
                  <div className="flex justify-between items-baseline bg-[#0A0B0D] p-3 rounded-xl border border-[#2D323E]">
                    <span className="text-xs font-black text-[#E8E2D6]">{relProduct.msrp}</span>
                    <span className="text-xs font-bold text-[#D4AF37]">{relProduct.founderPrice}</span>
                  </div>

                  <Link
                    href={`/shop/${relProduct.id}`}
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-[#2D323E] bg-[#0A0B0D] hover:border-[#D4AF37] text-[#E8E2D6] hover:text-[#D4AF37] flex items-center justify-center gap-1 transition-all"
                  >
                    <span>INSPECT UNIT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}