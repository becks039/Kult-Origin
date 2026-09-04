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
  Lock 
} from 'lucide-react';
import { CartItem, PRODUCTS_LOOKUP, getCartData, saveCartData } from '@/lib/cart';

function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const syncCart = () => {
    const { items, isExpired } = getCartData();
    setCartItems(isExpired ? [] : items);
  };

  useEffect(() => {
    const { items: currentItems } = getCartData();
    let updatedCart = [...currentItems];

    const addItemId = searchParams.get('addItem');
    const requestedSize = searchParams.get('size') || 'M';

    if (addItemId && PRODUCTS_LOOKUP[addItemId]) {
      const product = PRODUCTS_LOOKUP[addItemId];
      const existingIdx = updatedCart.findIndex(
        (item) => item.id === addItemId && (item.size === requestedSize || !item.size)
      );

      if (existingIdx > -1) {
        updatedCart[existingIdx].quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1, size: requestedSize });
      }

      saveCartData(updatedCart);
      router.replace('/Cart', { scroll: false });
    } else {
      setCartItems(updatedCart);
    }

    setIsLoaded(true);

    window.addEventListener('kult_cart_updated', syncCart);
    return () => window.removeEventListener('kult_cart_updated', syncCart);
  }, [searchParams, router]);

  const updateQuantity = (id: string, delta: number, size?: string) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id && item.size === size) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    setCartItems(updated);
    saveCartData(updated);
  };

  const removeItem = (id: string, size?: string) => {
    const updated = cartItems.filter((item) => !(item.id === id && item.size === size));
    setCartItems(updated);
    saveCartData(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 20000 || cartItems.length === 0 ? 0 : 250;
  const total = subtotal + shipping;

  if (!isLoaded) return <div className="min-h-screen bg-[#0B0D12]" />;

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E5E7EB] font-sans selection:bg-[#DFAB36] selection:text-black pt-16">
      
      <div className="w-full border-b border-[#1A1D26] bg-[#0E1017]/80 backdrop-blur-md px-6 py-2.5 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono tracking-widest text-[#818796]">
          <span className="flex items-center gap-2 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#DFAB36] shadow-[0_0_8px_rgba(223,171,54,0.8)]"></span>
            BATCH-001 // VAULT ALLOCATION SYSTEM
          </span>
          <span className="hidden sm:inline uppercase text-[#DFAB36] font-semibold tracking-wider">
            COMPLIMENTARY FREIGHT OVER RS 20,000
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1D26]">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#DFAB36] border border-[#DFAB36]/40 bg-[#DFAB36]/10 px-3.5 py-1 rounded-full uppercase tracking-[0.2em] font-mono shadow-[0_0_10px_rgba(223,171,54,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFAB36]"></span>
              SYSTEM STATUS: RESERVED
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#F9FAFB]">
              MY BAG <span className="text-[#DFAB36]">[{cartItems.reduce((acc, i) => acc + i.quantity, 0)}]</span>
            </h1>
            <p className="text-xs text-[#818796] font-mono uppercase tracking-widest">
              IRREDUCIBLE GRIT. PUMP COVERS. TECH-COMPRESSION.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/batch-001"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#222735] bg-[#12151E] hover:border-[#DFAB36]/40 text-xs font-mono uppercase tracking-widest text-[#E5E7EB] transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#DFAB36]" />
              <span>BATCH-001</span>
            </Link>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[380px] rounded-3xl border border-[#DFAB36]/30 bg-[#111318] p-12 flex flex-col items-center justify-center text-center space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="w-16 h-16 rounded-2xl border border-[#DFAB36]/40 bg-[#171A23] flex items-center justify-center text-[#DFAB36] shadow-[0_0_15px_rgba(223,171,54,0.15)]">
              <ShoppingBag className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#F9FAFB]">
                BAG IS EMPTY
              </h2>
              <p className="text-xs font-mono text-[#818796] uppercase tracking-widest">
                NO TACTICAL PIECES ALLOCATED YET.
              </p>
            </div>

            <Link
              href="/batch-001"
              className="mt-2 px-8 py-4 bg-[#DFAB36] hover:bg-[#ebd04e] text-black font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 rounded-xl shadow-[0_0_20px_rgba(223,171,54,0.25)] group"
            >
              <span>ENTER THE KULT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size || 'M'}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 rounded-3xl border border-[#DFAB36]/25 bg-[#111318] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#DFAB36]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-[#DFAB36] uppercase tracking-widest font-semibold">
                          [{item.id}] // {item.gsm || 'TACTICAL'}
                        </span>
                        {item.size && (
                          <span className="bg-[#1A1D26] text-[#DFAB36] px-2 py-0.5 rounded border border-[#DFAB36]/30 font-bold">
                            SIZE: {item.size}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9FAFB]">
                        {item.title || 'KULT ITEM'}
                      </h3>
                      <p className="text-xs font-mono text-[#818796] uppercase tracking-widest">
                        {item.fabric || 'PREMIUM FABRIC'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-[#1A1D26]">
                      <div className="flex items-center border border-[#222735] bg-[#0A0C10] rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, -1, item.size)}
                          className="p-2 text-[#818796] hover:text-[#DFAB36] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-[#F9FAFB]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1, item.size)}
                          className="p-2 text-[#818796] hover:text-[#DFAB36] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right font-mono">
                        <span className="block text-sm font-bold text-[#DFAB36]">
                          PKR {((item.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-2 text-[#818796] hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4">
              <div className="p-6 rounded-3xl border border-[#DFAB36]/30 bg-[#111318] space-y-6 sticky top-24 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-[#1A1D26] pb-4">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#818796]">
                    ALLOCATION SUMMARY
                  </h2>
                  <div className="p-2 rounded-xl border border-[#DFAB36]/40 bg-[#171A23] text-[#DFAB36] shadow-[0_0_10px_rgba(223,171,54,0.15)]">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-[#818796]">
                    <span>SUBTOTAL</span>
                    <span className="font-bold text-[#F9FAFB]">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#818796]">
                    <span>FREIGHT EST.</span>
                    <span className="font-bold text-[#DFAB36]">
                      {shipping === 0 ? 'COMPLIMENTARY' : `PKR ${shipping}`}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[#1A1D26] flex justify-between items-baseline font-sans">
                    <span className="font-bold text-[#818796] text-xs uppercase tracking-wider">TOTAL ALLOCATION</span>
                    <span className="text-xl font-black text-[#DFAB36] font-mono">
                      PKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-4 bg-[#DFAB36] hover:bg-[#ebd04e] text-black font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(223,171,54,0.25)] group cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>SECURE ALLOCATION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#818796] uppercase tracking-widest justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFAB36]" />
                  SYSTEM: KULT ORIGIN OS V2.06
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <CartContent />
    </Suspense>
  );
}