'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Lock,
  ChevronRight,
  Sparkles,
  Package,
} from 'lucide-react';

import {
  CartItem,
  PRODUCTS_LOOKUP,
  getCartData,
  saveCartData,
} from '@/lib/cart';

function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // ==========================================================
  // SYNC CART
  // ==========================================================

  const syncCart = () => {
    const { items, isExpired } = getCartData();

    setCartItems(isExpired ? [] : items);
  };

  // ==========================================================
  // LOAD CART
  // ==========================================================

  useEffect(() => {
    const { items: currentItems, isExpired } = getCartData();

    let updatedCart = isExpired ? [] : [...currentItems];

    const addItemId = searchParams.get('addItem');
    const requestedSize = searchParams.get('size') || 'M';

    if (addItemId && PRODUCTS_LOOKUP[addItemId]) {
      const product = PRODUCTS_LOOKUP[addItemId];

      const existingIdx = updatedCart.findIndex(
        (item) =>
          item.id === addItemId &&
          (item.size === requestedSize || !item.size)
      );

      if (existingIdx > -1) {
        updatedCart[existingIdx].quantity += 1;
      } else {
        updatedCart.push({
          ...product,
          quantity: 1,
          size: requestedSize,
        });
      }

      saveCartData(updatedCart);

      router.replace('/Cart', {
        scroll: false,
      });
    } else {
      setCartItems(updatedCart);
    }

    setIsLoaded(true);

    window.addEventListener('kult_cart_updated', syncCart);

    return () => {
      window.removeEventListener(
        'kult_cart_updated',
        syncCart
      );
    };
  }, [searchParams, router]);

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const updateQuantity = (
    id: string,
    delta: number,
    size?: string
  ) => {
    const updated = cartItems
      .map((item) => {
        if (
          item.id === id &&
          item.size === size
        ) {
          const newQty = item.quantity + delta;

          return newQty > 0
            ? {
                ...item,
                quantity: newQty,
              }
            : null;
        }

        return item;
      })
      .filter(
        (item): item is CartItem =>
          item !== null
      );

    setCartItems(updated);
    saveCartData(updated);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeItem = (
    id: string,
    size?: string
  ) => {
    const updated = cartItems.filter(
      (item) =>
        !(
          item.id === id &&
          item.size === size
        )
    );

    setCartItems(updated);
    saveCartData(updated);
  };

  // ==========================================================
  // TOTALS
  // ==========================================================

  const itemCount = cartItems.reduce(
    (acc, item) =>
      acc + (item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.price || 0) *
        item.quantity,
    0
  );

  const shipping =
    subtotal > 20000 ||
    cartItems.length === 0
      ? 0
      : 250;

  const total = subtotal + shipping;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#2D323E] border-t-[#D4AF37] rounded-full animate-spin" />

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#E8E2D6]/50">
            LOADING ALLOCATION BAG...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 z-0 pointer-events-none">

        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.045]" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D] via-[#0A0B0D]/95 to-[#0A0B0D]" />

      </div>

      <div className="relative z-10">

        {/* ====================================================
            TOP STATUS BAR
        ==================================================== */}

        <div className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/90 backdrop-blur-md px-4 sm:px-6 py-2.5">

          <div className="max-w-7xl mx-auto flex items-center justify-between text-[9px] sm:text-[10px] tracking-widest text-[#E8E2D6]/50">

            <span className="flex items-center gap-2 uppercase">

              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />

              <span>
                BATCH-001 // VAULT ALLOCATION SYSTEM
              </span>

            </span>

            <span className="hidden md:block text-[#D4AF37] font-bold whitespace-nowrap">
              COMPLIMENTARY FREIGHT OVER RS 20,000
            </span>

          </div>

        </div>

        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <nav className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/90 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">

          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* HOME */}

            <Link
              href="/"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-[#2D323E] bg-[#12141B]/90 hover:border-[#D4AF37]/50 transition-all duration-200 group"
            >

              <ArrowLeft className="w-4 h-4 text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-all" />

              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#E8E2D6] group-hover:text-[#D4AF37]">
                HOME
              </span>

            </Link>

            {/* BREADCRUMB */}

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
                MY BAG
              </span>

            </div>

            {/* NO CART BUTTON HERE */}

          </div>

        </nav>

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <header className="w-full border-b border-[#2D323E]/80 bg-[#0A0B0D]/70 backdrop-blur-md px-4 sm:px-6 py-8 sm:py-10">

          <div className="max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

              <div className="space-y-4 min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <span className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] text-[#D4AF37] border border-[#D4AF37]/60 bg-[#0A0B0D]/90 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold">

                    <Sparkles className="w-3 h-3" />

                    VAULT ALLOCATION

                  </span>

                  <span className="text-[9px] sm:text-[10px] text-[#E8E2D6]/50 tracking-widest uppercase font-semibold">

                    {itemCount} ACTIVE UNITS

                  </span>

                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#E8E2D6] leading-none">

                  MY BAG{' '}

                  <span className="text-[#D4AF37]">
                    [{itemCount}]
                  </span>

                </h1>

                <p className="text-[10px] sm:text-xs text-[#E8E2D6]/60 uppercase tracking-widest leading-relaxed border-l-2 border-[#D4AF37] pl-4 max-w-xl">

                  RESERVED UNITS READY FOR SECURE DISPATCH.

                </p>

              </div>

             

            </div>

          </div>

        </header>

        {/* ====================================================
            MAIN
        ==================================================== */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10">

          {/* ==================================================
              EMPTY CART
          ================================================== */}

          {cartItems.length === 0 ? (

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="min-h-[400px] sm:min-h-[430px] rounded-2xl border border-[#2D323E] bg-[#12141B]/90 backdrop-blur-md p-6 sm:p-16 flex flex-col items-center justify-center text-center space-y-7 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
            >

              <div className="w-20 h-20 rounded-2xl border border-[#D4AF37]/40 bg-[#0A0B0D] flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.12)]">

                <ShoppingBag className="w-8 h-8" />

              </div>

              <div className="space-y-3 max-w-md">

                <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-bold">
                  [ NO ACTIVE ALLOCATIONS ]
                </span>

                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#E8E2D6]">
                  BAG IS EMPTY
                </h2>

                <p className="text-[10px] text-[#E8E2D6]/50 uppercase tracking-widest leading-relaxed">
                  NO TACTICAL PIECES HAVE BEEN RESERVED YET.
                  ENTER THE CATALOGUE TO SECURE YOUR ALLOCATION.
                </p>

              </div>

              <Link
                href="/shop"
                className="px-7 sm:px-8 py-4 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] group"
              >

                ENTER THE CATALOGUE

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

              </Link>

            </motion.div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8">

              {/* ==================================================
                  CART ITEMS
              ================================================== */}

              <div className="lg:col-span-8 space-y-5">

                <div className="flex items-center justify-between pb-3 border-b border-[#2D323E]">

                  <div className="flex items-center gap-2">

                    <Package className="w-4 h-4 text-[#D4AF37]" />

                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/60">
                      RESERVED UNITS
                    </span>

                  </div>

                  <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37]">
                    {cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''}
                  </span>

                </div>

                <AnimatePresence>

                  {cartItems.map((item, index) => (

                    <motion.div
                      key={`${item.id}-${item.size || 'M'}-${index}`}
                      layout
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -30,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] rounded-2xl p-4 sm:p-6 hover:border-[#D4AF37]/60 transition-all duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    >

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                        {/* ==================================================
                            PRODUCT IMAGE
                        ================================================== */}

                        <div className="w-full sm:w-28 sm:h-28 aspect-[4/3] sm:aspect-square shrink-0 rounded-xl border border-[#2D323E] bg-[#0A0B0D] overflow-hidden flex items-center justify-center">

                          {item.image ? (

                            <img
                              src={item.image}
                              alt={item.title || 'KULT ITEM'}
                              className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                          ) : (

                            <ShoppingBag className="w-8 h-8 text-[#D4AF37]/60" />

                          )}

                        </div>

                        {/* ==================================================
                            PRODUCT DETAILS
                        ================================================== */}

                        <div className="flex-1 min-w-0 flex flex-col justify-between gap-5">

                          <div className="space-y-2.5">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="text-[8px] sm:text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold break-all">
                                [{item.id}]
                              </span>

                              {item.gsm && (

                                <span className="text-[8px] sm:text-[9px] text-[#E8E2D6]/50 uppercase tracking-widest">
                                  // {item.gsm}
                                </span>

                              )}

                              {item.size && (

                                <span className="bg-[#0A0B0D] text-[#D4AF37] px-2 py-1 rounded-md border border-[#D4AF37]/30 text-[8px] font-bold uppercase tracking-wider">
                                  SIZE: {item.size}
                                </span>

                              )}

                            </div>

                            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#E8E2D6] group-hover:text-[#D4AF37] transition-colors leading-snug">
                              {item.title || 'KULT ITEM'}
                            </h3>

                            <p className="text-[8px] sm:text-[9px] text-[#E8E2D6]/45 uppercase tracking-widest leading-relaxed">
                              FABRIC: {item.fabric || 'PREMIUM FABRIC'}
                            </p>

                          </div>

                          {/* ==================================================
                              ACTIONS
                          ================================================== */}

                          <div className="flex flex-col xs:flex-row sm:flex-row items-start sm:items-center justify-between gap-4">

                            {/* QUANTITY */}

                            <div className="flex items-center border border-[#2D323E] bg-[#0A0B0D] rounded-xl overflow-hidden">

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    -1,
                                    item.size
                                  )
                                }
                                className="p-2.5 text-[#E8E2D6]/50 hover:text-[#D4AF37] hover:bg-[#12141B] transition-colors cursor-pointer"
                              >

                                <Minus className="w-3.5 h-3.5" />

                              </button>

                              <span className="px-4 text-xs font-bold text-[#E8E2D6] min-w-[42px] text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    1,
                                    item.size
                                  )
                                }
                                className="p-2.5 text-[#E8E2D6]/50 hover:text-[#D4AF37] hover:bg-[#12141B] transition-colors cursor-pointer"
                              >

                                <Plus className="w-3.5 h-3.5" />

                              </button>

                            </div>

                            {/* PRICE + DELETE */}

                            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">

                              <div className="text-left sm:text-right">

                                <span className="block text-[7px] uppercase tracking-widest text-[#E8E2D6]/35">
                                  ALLOCATION VALUE
                                </span>

                                <span className="block text-sm font-black text-[#D4AF37] mt-0.5">
                                  PKR{' '}
                                  {(
                                    (item.price || 0) *
                                    item.quantity
                                  ).toLocaleString()}
                                </span>

                              </div>

                              <button
                                onClick={() =>
                                  removeItem(
                                    item.id,
                                    item.size
                                  )
                                }
                                className="p-2.5 rounded-lg border border-[#2D323E] text-[#E8E2D6]/40 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 transition-all cursor-pointer shrink-0"
                                title="Remove item"
                              >

                                <Trash2 className="w-4 h-4" />

                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  ))}

                </AnimatePresence>

              </div>

              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <div className="lg:col-span-4">

                <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 space-y-6 lg:sticky lg:top-24 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">

                  {/* SUMMARY HEADER */}

                  <div className="flex items-center justify-between pb-4 border-b border-[#2D323E]">

                    <div className="min-w-0">

                      <span className="block text-[8px] sm:text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">
                        SECURE CHANNEL
                      </span>

                      <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#E8E2D6] mt-1">
                        ALLOCATION SUMMARY
                      </h2>

                    </div>

                    <div className="p-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#0A0B0D] text-[#D4AF37] shrink-0">

                      <Lock className="w-4 h-4" />

                    </div>

                  </div>

                  {/* SUMMARY LINES */}

                  <div className="space-y-4">

                    <div className="flex justify-between items-center text-xs">

                      <span className="text-[#E8E2D6]/45 uppercase tracking-widest">
                        UNITS
                      </span>

                      <span className="font-bold text-[#E8E2D6]">
                        {itemCount}
                      </span>

                    </div>

                    <div className="flex justify-between items-center text-xs">

                      <span className="text-[#E8E2D6]/45 uppercase tracking-widest">
                        SUBTOTAL
                      </span>

                      <span className="font-bold text-[#E8E2D6]">
                        PKR {subtotal.toLocaleString()}
                      </span>

                    </div>

                    <div className="flex justify-between items-center text-xs">

                      <span className="text-[#E8E2D6]/45 uppercase tracking-widest">
                        FREIGHT EST.
                      </span>

                      <span className="font-bold text-[#D4AF37]">

                        {shipping === 0
                          ? 'COMPLIMENTARY'
                          : `PKR ${shipping}`}

                      </span>

                    </div>

                  </div>

                  {/* TOTAL */}

                  <div className="pt-5 border-t border-[#2D323E]">

                    <div className="flex justify-between items-end gap-4">

                      <div className="min-w-0">

                        <span className="block text-[8px] sm:text-[9px] text-[#E8E2D6]/40 uppercase tracking-widest">
                          TOTAL ALLOCATION
                        </span>

                        <span className="block text-[7px] sm:text-[8px] text-[#D4AF37]/60 uppercase tracking-widest mt-1">
                          BATCH-001 // FOUNDER TIER
                        </span>

                      </div>

                      <span className="text-lg sm:text-2xl font-black text-[#D4AF37] whitespace-nowrap">
                        PKR {total.toLocaleString()}
                      </span>

                    </div>

                  </div>

                  {/* CHECKOUT */}

                  <button
                    onClick={() =>
                      router.push('/checkout')
                    }
                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] group cursor-pointer"
                  >

                    <Lock className="w-4 h-4 shrink-0" />

                    <span>
                      SECURE ALLOCATION
                    </span>

                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />

                  </button>

                  {/* CONTINUE SHOPPING */}

                  <Link
                    href="/shop"
                    className="w-full py-3 bg-[#0A0B0D]/80 border border-[#2D323E] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] text-[#E8E2D6]/70 font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-xl"
                  >

                    <ArrowLeft className="w-3.5 h-3.5" />

                    CONTINUE SHOPPING

                  </Link>

                  {/* SECURITY */}

                  <div className="pt-2 flex items-center justify-center gap-2 text-[8px] sm:text-[9px] text-[#E8E2D6]/40 uppercase tracking-widest text-center">

                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />

                    SYSTEM: KULT ORIGIN OS V2.06

                  </div>

                </div>

              </div>

            </div>

          )}

        </main>

        {/* ====================================================
            FOOTER STATUS
        ==================================================== */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10">

          <div className="border-t border-[#2D323E]/60 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-[#E8E2D6]/30 text-center sm:text-left">

            <span>
              KULT ORIGIN // BATCH-001
            </span>

            <span className="flex items-center gap-2">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />

              ALLOCATION CHANNEL SECURE

            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0B0D]" />
      }
    >
      <CartContent />
    </Suspense>
  );
}