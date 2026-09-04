
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  LogOut,
} from 'lucide-react';

import {
  getCartStorageKey,
  getCartData,
  saveCartData,
  getActiveCartCount,
} from '@/lib/cart';

interface PageProps {
  params: Promise<{ id: string }>;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1920&auto=format&fit=crop',
];

export default function SingleProductPage({ params }: PageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [relevantProducts, setRelevantProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    title: string;
  } | null>(null);

  const [cartCount, setCartCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [currentSlide, setCurrentSlide] = useState(0);

  // ==========================================================
  // FETCH PRODUCT FROM PAYLOAD CMS
  // ==========================================================

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);

        let raw: any = null;

        // First try to find product using slug
        const slugRes = await fetch(
          `/api/products?where[slug][equals]=${encodeURIComponent(id)}&depth=2`,
        );

        if (slugRes.ok) {
          const slugData = await slugRes.json();

          if (slugData.docs && slugData.docs.length > 0) {
            raw = slugData.docs[0];
          }
        }

        // Fallback: find product directly by ID
        if (!raw) {
          const idRes = await fetch(`/api/products/${id}?depth=2`);

          if (idRes.ok) {
            raw = await idRes.json();
          }
        }

        if (!raw) {
          throw new Error('Product not found');
        }

        // ======================================================
        // IMAGE HANDLING
        // ======================================================

        const imgs = (raw.images || [])
          .map((item: any) =>
            typeof item.image === 'object'
              ? item.image?.url
              : null,
          )
          .filter(Boolean);

        const mainImg =
          imgs[0] ||
          raw.image?.url ||
          raw.image ||
          '/placeholder.png';

        // ======================================================
        // RICHTEXT DESCRIPTION
        // ======================================================

        const descText =
          typeof raw.description === 'string'
            ? raw.description
            : raw.description?.root?.children
                ?.map((block: any) =>
                  block.children
                    ?.map((child: any) => child.text)
                    .join(''),
                )
                .join('\n') || '';

        // ======================================================
        // CATEGORY
        // ======================================================

        const catName =
          typeof raw.category === 'object'
            ? raw.category?.title ||
              raw.category?.name ||
              'COLLECTION'
            : 'COLLECTION';

        // ======================================================
        // AVAILABLE SIZES
        // ======================================================

        const availableSizes =
          Array.isArray(raw.sizes) && raw.sizes.length > 0
            ? raw.sizes
            : ['SMALL', 'MEDIUM', 'LARGE', 'X-LARGE'];

        // ======================================================
        // FORMAT PRODUCT
        // ======================================================

        const formattedProduct = {
          id: String(raw.id),
          slug: raw.slug || String(raw.id),

          title:
            raw.title ||
            raw.name ||
            'UNTITLED PRODUCT',

          batch: raw.batch || 'BATCH-001',

          isFounderEdition:
            raw.isFounderEdition ?? true,

          msrp: `PKR ${
            raw.msrp?.toLocaleString() || 0
          }`,

          founderPrice: `PKR ${
            raw.founderPrice?.toLocaleString() || 0
          }`,

          rawFounderPrice:
            raw.founderPrice || raw.price || 0,

          gsm: raw.gsm
            ? `${raw.gsm} GSM`
            : '200+ GSM',

          fabric:
            raw.fabric ||
            '200+ GSM Heavy-Fleece Technical Fabric',

          category: catName,

          status:
            raw.status ||
            'AVAILABLE',

          sizes: availableSizes,

          specs:
            raw.printType ||
            '3D High-Build Silicone/Rubberized Print',

          description: descText,

          image: mainImg,

          images:
            imgs.length > 0
              ? imgs
              : [mainImg],
        };

        setProduct(formattedProduct);
        setSelectedImage(mainImg);

        // Default size
        setSelectedSize(availableSizes[0]);

        // ======================================================
        // FETCH RELATED PRODUCTS
        // ======================================================

        const catId =
          typeof raw.category === 'object'
            ? raw.category.id
            : raw.category;

        if (catId) {
          const relRes = await fetch(
            `/api/products?where[category][equals]=${catId}&where[id][not_equals]=${raw.id}&limit=3&depth=2`,
          );

          if (relRes.ok) {
            const relData = await relRes.json();

            const formattedRel = (
              relData.docs || []
            ).map((doc: any) => {
              const relImg =
                doc.images?.[0]?.image?.url ||
                doc.image?.url ||
                doc.image ||
                '/placeholder.png';

              return {
                id: String(doc.slug || doc.id),

                title:
                  doc.title ||
                  doc.name ||
                  'UNTITLED PRODUCT',

                msrp: `PKR ${
                  doc.msrp?.toLocaleString() || 0
                }`,

                founderPrice: `PKR ${
                  doc.founderPrice?.toLocaleString() || 0
                }`,

                gsm: doc.gsm
                  ? `${doc.gsm} GSM`
                  : '200+ GSM',

                specs:
                  doc.printType ||
                  'TACTICAL FIT // LIMITED EDITION',

                fabric:
                  doc.fabric ||
                  'PREMIUM COTTON',

                image: relImg,

                status:
                  doc.status ||
                  'AVAILABLE',
              };
            });

            setRelevantProducts(formattedRel);
          }
        }
      } catch (error) {
        console.error(
          'Error fetching product:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
    updateCartCount();
  }, [id]);

  // ==========================================================
  // CART COUNT
  // ==========================================================

  const updateCartCount = () => {
    setCartCount(getActiveCartCount());
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getActiveCartCount());
    };

    window.addEventListener(
      'cart-updated',
      handleCartUpdate,
    );

    window.addEventListener(
      'storage',
      handleCartUpdate,
    );

    return () => {
      window.removeEventListener(
        'cart-updated',
        handleCartUpdate,
      );

      window.removeEventListener(
        'storage',
        handleCartUpdate,
      );
    };
  }, []);

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = () => {
    if (
      !product ||
      product.status === 'SOLD_OUT'
    ) {
      return;
    }

    const {
      items: existingCart,
    } = getCartData();

    const numericPrice =
      parseInt(
        String(product.founderPrice).replace(
          /[^0-9]/g,
          '',
        ),
        10,
      ) || 0;

    // Same product + same size = increase quantity
    const existingIndex =
      existingCart.findIndex(
        (item: any) =>
          item.id === product.id &&
          item.size === selectedSize,
      );

    if (existingIndex > -1) {
      existingCart[existingIndex] = {
        ...existingCart[existingIndex],

        quantity:
          (existingCart[existingIndex]
            .quantity || 1) + quantity,
      };
    } else {
      existingCart.push({
        id: String(product.id),

        title: product.title,

        price: numericPrice,

        quantity,

        size: selectedSize,

        gsm: product.gsm,

        fabric: product.fabric,

        category: product.category,

        image: selectedImage,
      });
    }

    saveCartData(existingCart);

    updateCartCount();

    window.dispatchEvent(
      new Event('cart-updated'),
    );

    setAddedId(product.id);

    setToastNotification({
      show: true,
      title: product.title,
    });

    setTimeout(() => {
      setAddedId(null);
    }, 1800);

    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // ==========================================================
  // REVOKE ACCESS / EXIT VAULT
  // ==========================================================

  const handleRevokeAccess = () => {
    const activeCartKey =
      getCartStorageKey();

    if (activeCartKey) {
      localStorage.removeItem(
        activeCartKey,
      );
    }

    Object.keys(localStorage).forEach(
      (key) => {
        if (
          key.startsWith('kult_cart') ||
          key.includes('cart') ||
          key.startsWith(
            'kult_batch001',
          ) ||
          key.startsWith('kult_vault') ||
          key.startsWith(
            'kult_founder',
          )
        ) {
          localStorage.removeItem(key);
        }
      },
    );

    setCartCount(0);

    window.dispatchEvent(
      new Event('cart-updated'),
    );

    window.location.href =
      '/batch-001';
  };

  // ==========================================================
  // HERO SLIDER
  // ==========================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) =>
          (prev + 1) %
          HERO_IMAGES.length,
      );
    }, 5000);

    return () =>
      clearInterval(timer);
  }, []);

  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const getStatusBadge = (
    status: string,
  ) => {
    const normalized =
      status?.toUpperCase();

    switch (normalized) {
      case 'AVAILABLE':
      case 'IN STOCK':
        return (
          <span className="flex items-center gap-1.5 text-[9px] px-3 py-1.5 rounded-md uppercase tracking-widest font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3" />
            IN STOCK
          </span>
        );

      case 'LOW STOCK':
        return (
          <span className="flex items-center gap-1.5 text-[9px] px-3 py-1.5 rounded-md uppercase tracking-widest font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 backdrop-blur-md">
            <ShieldAlert className="w-3 h-3" />
            LOW STOCK
          </span>
        );

      case 'SOLD_OUT':
      case 'SOLD OUT':
        return (
          <span className="flex items-center gap-1.5 text-[9px] px-3 py-1.5 rounded-md uppercase tracking-widest font-bold text-rose-400 bg-rose-950/80 border border-rose-500/40 backdrop-blur-md">
            <X className="w-3 h-3" />
            SOLD OUT
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1.5 text-[9px] px-3 py-1.5 rounded-md uppercase tracking-widest font-bold text-sky-400 bg-sky-950/80 border border-sky-500/40 backdrop-blur-md">
            <Clock className="w-3 h-3" />
            PRE-ORDER
          </span>
        );
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/80 via-[#0A0B0D]/90 to-[#0A0B0D]" />
        </div>

        <div className="relative z-10 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#2D323E] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />

          <p className="text-xs text-[#D4AF37] uppercase tracking-[0.3em] animate-pulse">
            [ LOADING PRODUCT MATRIX... ]
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PRODUCT NOT FOUND
  // ==========================================================

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono flex flex-col items-center justify-center gap-5">
        <div className="text-[9px] text-rose-400 border border-rose-500/30 bg-rose-950/20 px-4 py-2 rounded-full uppercase tracking-[0.25em]">
          SYSTEM ERROR
        </div>

        <h1 className="text-2xl font-black uppercase tracking-widest text-rose-500">
          PRODUCT NOT FOUND
        </h1>

        <Link
          href="/shop"
          className="flex items-center gap-2 text-xs text-[#D4AF37] underline tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO CATALOGUE
        </Link>
      </div>
    );
  }

  const isSoldOut =
    product.status ===
      'SOLD_OUT' ||
    product.status ===
      'SOLD OUT';

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* ======================================================
          BACKGROUND HERO
      ====================================================== */}

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{
              opacity: 0,
              scale: 1,
            }}
            animate={{
              opacity: 0.45,
              scale: 1.05,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${HERO_IMAGES[currentSlide]})`,
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/80 via-[#0A0B0D]/75 to-[#0A0B0D]/98" />

        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="relative z-10">
        {/* ====================================================
            TOAST
        ==================================================== */}

        <AnimatePresence>
          {toastNotification?.show && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                x: '-50%',
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                x: '-50%',
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                x: '-50%',
                scale: 0.9,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
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
                onClick={() =>
                  setToastNotification(
                    null,
                  )
                }
                className="text-[#E8E2D6]/40 hover:text-[#D4AF37] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <nav className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <Link
              href="/shop"
              className="flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#2D323E] bg-[#12141B]/90 hover:border-[#D4AF37]/50 transition-all duration-200 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-all" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors">
                BACK TO SHOP
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#E8E2D6]/50">
              <Link
                href="/"
                className="hover:text-[#D4AF37] transition-colors"
              >
                KULT
              </Link>

              <ChevronRight className="w-3 h-3 text-[#D4AF37]" />

              <Link
                href="/shop"
                className="hover:text-[#D4AF37] transition-colors"
              >
                CATALOGUE
              </Link>

              <ChevronRight className="w-3 h-3 text-[#D4AF37]" />

              <span className="text-[#D4AF37] font-bold">
                UNIT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={
                  handleRevokeAccess
                }
                className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full border border-red-500/30 bg-[#12141B]/90 hover:border-red-500/70 hover:text-red-400 transition-all duration-200 group cursor-pointer"
              >
                <LogOut className="w-4 h-4" />

                <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.2em]">
                  EXIT VAULT
                </span>
              </button>

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
          </div>
        </nav>

        {/* ====================================================
            PRODUCT HEADER
        ==================================================== */}

        <header className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/50 backdrop-blur-md px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[9px] text-[#D4AF37] border border-[#D4AF37]/60 bg-[#0A0B0D]/90 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                BATCH 001 // PRODUCT DETAIL
              </span>

              <span className="text-[10px] text-[#E8E2D6]/50 tracking-widest uppercase">
                UNIT ID: {product.id}
              </span>

              <span className="text-[10px] text-[#E8E2D6]/50 tracking-widest uppercase">
                //
              </span>

              <span className="text-[10px] text-[#D4AF37] tracking-widest uppercase font-bold">
                {product.category}
              </span>
            </div>
          </div>
        </header>

        {/* ====================================================
            MAIN PRODUCT AREA
        ==================================================== */}

        <main className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* ==================================================
                PRODUCT GALLERY
            ================================================== */}

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                <div className="h-[430px] sm:h-[600px] bg-[#0A0B0D]/95 border border-[#2D323E] rounded-xl relative overflow-hidden group">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D]/70 via-transparent to-black/20 pointer-events-none" />

                  <span className="absolute top-4 left-4 text-[10px] bg-[#2D323E]/90 backdrop-blur-md text-[#E8E2D6] px-3 py-1.5 rounded-md uppercase tracking-widest font-bold border border-[#3A3F44]">
                    {product.gsm}
                  </span>

                  <div className="absolute top-4 right-4">
                    {getStatusBadge(
                      product.status,
                    )}
                  </div>

                  <span className="absolute bottom-4 left-4 text-[9px] text-[#E8E2D6]/70 font-bold uppercase tracking-widest bg-black/70 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md">
                    [ {product.id} ]
                  </span>

                  {product.isFounderEdition && (
                    <span className="absolute bottom-4 right-4 text-[9px] bg-[#D4AF37]/90 text-black px-3 py-1.5 rounded uppercase tracking-widest font-black">
                      FOUNDER EDITION
                    </span>
                  )}
                </div>

                {/* ==================================================
                    THUMBNAILS
                ================================================== */}

                {product.images.length >
                  1 && (
                  <div className="flex gap-3 overflow-x-auto pt-4 pb-1">
                    {product.images.map(
                      (
                        imgUrl: string,
                        idx: number,
                      ) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setSelectedImage(
                              imgUrl,
                            )
                          }
                          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 bg-[#0A0B0D] transition-all ${
                            selectedImage ===
                            imgUrl
                              ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                              : 'border-[#2D323E] opacity-60 hover:opacity-100 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* ==================================================
                  PRODUCT SPECIFICATIONS
              ================================================== */}

              <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-bold">
                      TECHNICAL PROFILE
                    </p>

                    <h2 className="text-lg font-black uppercase tracking-wide mt-1">
                      UNIT SPECIFICATIONS
                    </h2>
                  </div>

                  <div className="w-9 h-9 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-[#0A0B0D]/80 border border-[#2D323E] rounded-xl p-4">
                    <span className="block text-[8px] text-[#E8E2D6]/40 uppercase tracking-widest mb-1">
                      BATCH
                    </span>

                    <span className="text-[11px] font-bold uppercase text-[#E8E2D6]">
                      {product.batch}
                    </span>
                  </div>

                  <div className="bg-[#0A0B0D]/80 border border-[#2D323E] rounded-xl p-4">
                    <span className="block text-[8px] text-[#E8E2D6]/40 uppercase tracking-widest mb-1">
                      GSM
                    </span>

                    <span className="text-[11px] font-bold uppercase text-[#E8E2D6]">
                      {product.gsm}
                    </span>
                  </div>

                  <div className="bg-[#0A0B0D]/80 border border-[#2D323E] rounded-xl p-4">
                    <span className="block text-[8px] text-[#E8E2D6]/40 uppercase tracking-widest mb-1">
                      CATEGORY
                    </span>

                    <span className="text-[11px] font-bold uppercase text-[#E8E2D6]">
                      {product.category}
                    </span>
                  </div>

                  <div className="col-span-2 md:col-span-1 bg-[#0A0B0D]/80 border border-[#2D323E] rounded-xl p-4">
                    <span className="block text-[8px] text-[#E8E2D6]/40 uppercase tracking-widest mb-1">
                      FABRIC
                    </span>

                    <span className="text-[10px] font-bold uppercase text-[#E8E2D6]">
                      {product.fabric}
                    </span>
                  </div>

                  <div className="col-span-2 md:col-span-2 bg-[#0A0B0D]/80 border border-[#2D323E] rounded-xl p-4">
                    <span className="block text-[8px] text-[#E8E2D6]/40 uppercase tracking-widest mb-1">
                      PRINT / CONSTRUCTION
                    </span>

                    <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
                      {product.specs}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                PRODUCT INFORMATION
            ================================================== */}

            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-5">
                <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                  {/* CATEGORY + BATCH */}

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
                      {product.category}
                    </span>

                    <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded font-bold tracking-wider uppercase">
                      {product.batch}
                    </span>

                    {product.isFounderEdition && (
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded font-bold tracking-wider uppercase">
                        FOUNDER EDITION
                      </span>
                    )}
                  </div>

                  {/* TITLE */}

                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#E8E2D6] leading-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-2 mt-3">
                    {getStatusBadge(
                      product.status,
                    )}
                  </div>

                  {/* DIVIDER */}

                  <div className="border-t border-[#2D323E] my-6" />

                  {/* PRICE */}

                  <div className="bg-[#0A0B0D]/90 p-5 rounded-xl border border-[#2D323E]">
                    <div className="flex justify-between items-end gap-4">
                      <div>
                        <span className="text-[9px] text-[#E8E2D6]/40 block uppercase tracking-widest font-bold mb-1">
                          RETAIL MSRP
                        </span>

                        <span className="text-xl font-black text-[#E8E2D6] line-through">
                          {product.msrp}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-[#D4AF37] block font-bold uppercase tracking-widest mb-1">
                          FOUNDER TIER
                        </span>

                        <span className="text-xl font-black text-[#D4AF37]">
                          {product.founderPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-6">
                    <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mb-3">
                      UNIT BRIEF
                    </p>

                    <p className="text-xs text-[#E8E2D6]/65 uppercase leading-relaxed border-l-2 border-[#D4AF37] pl-4 whitespace-pre-line">
                      {product.description ||
                        'Heavyweight technical garment built for durability.'}
                    </p>
                  </div>

                  {/* SIZE */}

                  <div className="mt-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#E8E2D6]/70 uppercase font-bold tracking-widest">
                        SELECT SIZE
                      </label>

                      <span className="text-[9px] text-[#E8E2D6]/30 uppercase tracking-widest">
                        REQUIRED
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map(
                        (
                          size: string,
                        ) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSelectedSize(
                                size,
                              )
                            }
                            disabled={isSoldOut}
                            className={`py-3 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                              selectedSize ===
                              size
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                : 'bg-[#0A0B0D] text-[#E8E2D6] border-[#2D323E] hover:border-[#D4AF37]/60 hover:text-[#D4AF37]'
                            } ${
                              isSoldOut
                                ? 'opacity-40 cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                          >
                            {size}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* QUANTITY */}

                  <div className="mt-6 space-y-3">
                    <label className="text-[10px] text-[#E8E2D6]/70 uppercase font-bold tracking-widest">
                      QUANTITY
                    </label>

                    <div className="flex items-center justify-between bg-[#0A0B0D] p-2 rounded-xl border border-[#2D323E]">
                      <button
                        onClick={() =>
                          setQuantity(
                            (prev) =>
                              Math.max(
                                1,
                                prev - 1,
                              ),
                          )
                        }
                        disabled={isSoldOut}
                        className="w-10 h-10 rounded-lg bg-[#12141B] border border-[#2D323E] flex items-center justify-center hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="text-center">
                        <span className="block text-[8px] text-[#E8E2D6]/30 uppercase tracking-widest">
                          UNITS
                        </span>

                        <span className="text-base font-black">
                          {quantity}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setQuantity(
                            (prev) =>
                              prev + 1,
                          )
                        }
                        disabled={isSoldOut}
                        className="w-10 h-10 rounded-lg bg-[#12141B] border border-[#2D323E] flex items-center justify-center hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* ACTION */}

                  <button
                    onClick={
                      handleAddToCart
                    }
                    disabled={isSoldOut}
                    className={`w-full mt-6 py-4 font-black text-xs uppercase tracking-[0.25em] transition-all rounded-xl flex items-center justify-center gap-2 ${
                      isSoldOut
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                        : addedId ===
                            product.id
                          ? 'bg-emerald-500 text-black shadow-[0_5px_25px_rgba(16,185,129,0.2)]'
                          : 'bg-[#D4AF37] hover:bg-[#b8952b] text-black shadow-[0_5px_25px_rgba(212,175,55,0.25)] hover:shadow-[0_5px_35px_rgba(212,175,55,0.4)] cursor-pointer'
                    }`}
                  >
                    {addedId ===
                    product.id ? (
                      <>
                        <Check className="w-4 h-4" />

                        <span>
                          ALLOCATION SECURED
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />

                        <span>
                          {isSoldOut
                            ? 'ALLOCATION CLOSED'
                            : 'SECURE ALLOCATION'}
                        </span>

                        {!isSoldOut && (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>

                  {/* CART */}

                  <Link
                    href="/Cart"
                    className="w-full mt-3 py-3.5 font-bold text-xs uppercase tracking-[0.2em] rounded-xl border border-[#2D323E] bg-[#0A0B0D]/80 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] text-[#E8E2D6]/80 flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />

                    <span>
                      VIEW DISPATCH CART
                    </span>

                    {cartCount > 0 && (
                      <span className="bg-[#D4AF37] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* SECURITY INFO */}

                <div className="bg-[#12141B]/70 backdrop-blur-md border border-[#2D323E] rounded-2xl p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold">
                        LIMITED
                      </div>

                      <div className="text-[8px] text-[#E8E2D6]/40 uppercase tracking-wider mt-1">
                        BATCH RELEASE
                      </div>
                    </div>

                    <div className="text-center border-x border-[#2D323E]">
                      <div className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold">
                        SECURE
                      </div>

                      <div className="text-[8px] text-[#E8E2D6]/40 uppercase tracking-wider mt-1">
                        CHECKOUT
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold">
                        FOUNDER
                      </div>

                      <div className="text-[8px] text-[#E8E2D6]/40 uppercase tracking-wider mt-1">
                        TIER PRICING
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              RELATED PRODUCTS
          ================================================== */}

          {relevantProducts.length >
            0 && (
            <section className="pt-14 mt-14 border-t border-[#2D323E]/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />

                    <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-bold">
                      RELATED UNITS
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                    COMPLETE THE RELEASE
                  </h2>
                </div>

                <Link
                  href="/shop"
                  className="flex items-center gap-2 text-[10px] text-[#E8E2D6]/60 hover:text-[#D4AF37] uppercase tracking-widest font-bold transition-colors"
                >
                  VIEW FULL CATALOGUE
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {relevantProducts.map(
                    (rel) => (
                      <motion.div
                        key={rel.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-5 flex flex-col justify-between space-y-5 hover:border-[#D4AF37] transition-all duration-300 group rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)]"
                      >
                        <Link
                          href={`/shop/${rel.id}`}
                          className="block"
                        >
                          <div className="h-64 bg-[#0A0B0D]/95 border border-[#2D323E] rounded-xl relative overflow-hidden group-hover:border-[#D4AF37]/40 transition-colors">
                            <img
                              src={
                                rel.image
                              }
                              alt={
                                rel.title
                              }
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-transparent to-black/20 opacity-70" />

                            <span className="absolute top-3 left-3 text-[9px] bg-[#2D323E]/90 backdrop-blur-md text-[#E8E2D6] px-2.5 py-1 rounded-md uppercase tracking-widest font-bold border border-[#3A3F44]">
                              {rel.gsm}
                            </span>

                            <span className="absolute bottom-3 right-3 text-[9px] text-[#E8E2D6]/70 font-bold uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
                              {rel.id}
                            </span>
                          </div>
                        </Link>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors leading-snug">
                              {
                                rel.title
                              }
                            </h3>

                            <p className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-widest mt-2">
                              {
                                rel.specs
                              }
                            </p>

                            <p className="text-[9px] text-[#E8E2D6]/40 uppercase tracking-widest mt-1">
                              FABRIC:{' '}
                              {
                                rel.fabric
                              }
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[#2D323E]">
                            <div className="flex justify-between items-baseline bg-[#0A0B0D]/90 p-3 rounded-xl border border-[#2D323E]">
                              <div>
                                <span className="text-[8px] text-[#E8E2D6]/40 block uppercase tracking-widest font-bold">
                                  MSRP
                                </span>

                                <span className="text-sm font-black text-[#E8E2D6] line-through">
                                  {
                                    rel.msrp
                                  }
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[8px] text-[#D4AF37] block font-bold uppercase tracking-widest">
                                  FOUNDER
                                </span>

                                <span className="text-xs font-bold text-[#D4AF37]">
                                  {
                                    rel.founderPrice
                                  }
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/shop/${rel.id}`}
                              className="w-full mt-3 py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl border border-[#2D323E] bg-[#0A0B0D]/80 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] text-[#E8E2D6]/80 flex items-center justify-center gap-2 transition-all"
                            >
                              VIEW UNIT

                              <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>
              </motion.div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

