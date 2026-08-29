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

const PRODUCTS_LOOKUP: Record<string, { id: string; title: string; price: number; gsm: string; fabric: string; category: string }> = {
  'B001-HD01': { id: 'B001-HD01', title: 'TYPE 1: HEAVYWEIGHT OVERSIZED HOODIE', price: 1999, gsm: '500 GSM', fabric: 'FRENCH TERRY FLEECE', category: 'HOODIES' },
  'B001-HD02': { id: 'B001-HD02', title: 'TYPE 2: ARCHITECTURAL ZIP-UP HOODIE', price: 2319, gsm: '520 GSM', fabric: 'HEAVY COTTON FLEECE', category: 'HOODIES' },
  'B001-HD03': { id: 'B001-HD03', title: 'TYPE 3: BALACLAVA TACTICAL HOODIE', price: 2480, gsm: '480 GSM', fabric: 'THERMAL FLEECE BLEND', category: 'HOODIES' },
  'B001-TE01': { id: 'B001-TE01', title: 'TYPE 1: STRUCTURAL COMPRESSION TEE', price: 1999, gsm: '300 GSM', fabric: 'ELASTANE COTTON BLEND', category: 'TEES' },
  'B001-TE02': { id: 'B001-TE02', title: 'TYPE 2: OVERSIZED DROP-SHOULDER TEE', price: 1519, gsm: '280 GSM', fabric: 'COMBED ORGANIC COTTON', category: 'TEES' },
  'B001-TE03': { id: 'B001-TE03', title: 'TYPE 3: ACID WASH TACTICAL SHIRT', price: 1759, gsm: '320 GSM', fabric: 'VINTAGE WASH COTTON', category: 'TEES' },
  'B001-VT01': { id: 'B001-VT01', title: 'TYPE 1: TACTICAL UTILITY VEST', price: 2560, gsm: 'CORDURA 1000D', fabric: 'REINFORCED NYLON / MESH', category: 'OUTERWEAR' },
  'B001-JK02': { id: 'B001-JK02', title: 'TYPE 2: ARCHITECTURAL BOMBER JACKET', price: 3600, gsm: 'WATERPROOF MESH', fabric: 'BALLISTIC NYLON SHELL', category: 'OUTERWEAR' },
  'B001-JK03': { id: 'B001-JK03', title: 'TYPE 3: HEAVY ANORAK WINDSTOPPER', price: 3199, gsm: 'WEATHER-PROOF', fabric: 'RIPSTOP POLYESTER', category: 'OUTERWEAR' },
  'B001-SW01': { id: 'B001-SW01', title: 'TYPE 1: HEAVY FLEECE SWEATPANTS', price: 1999, gsm: '500 GSM', fabric: 'FRENCH TERRY FLEECE', category: 'BOTTOMS' },
  'B001-PT02': { id: 'B001-PT02', title: 'TYPE 2: MODULAR CARGO PANT', price: 2559, gsm: '350 GSM', fabric: 'COTTON TWILL RIPSTOP', category: 'BOTTOMS' },
  'B001-SH03': { id: 'B001-SH03', title: 'TYPE 3: TACTICAL TRAINING SHORTS', price: 1439, gsm: '240 GSM', fabric: 'STRETCH NYLON BLEND', category: 'BOTTOMS' },
  'B001-AC01': { id: 'B001-AC01', title: 'OBSIDIAN ALLOY KEYCHAIN', price: 1039, gsm: 'HARDWARE', fabric: 'ZINC ALLOY / STEEL', category: 'ACCESSORIES' },
  'B001-AC02': { id: 'B001-AC02', title: 'TACTICAL CHEST RIG SLING', price: 1839, gsm: 'CORDURA 500D', fabric: 'WATER-RESISTANT NYLON', category: 'ACCESSORIES' },
  'B001-AC03': { id: 'B001-AC03', title: '500 GSM FLEECE BALACLAVA', price: 959, gsm: '500 GSM', fabric: 'FRENCH TERRY FLEECE', category: 'ACCESSORIES' },
};

function CartContent() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('kult_cart');
    let existingItems = storedCart ? JSON.parse(storedCart) : [];

    const addItemId = searchParams.get('addItem');
    if (addItemId && PRODUCTS_LOOKUP[addItemId]) {
      const targetProduct = PRODUCTS_LOOKUP[addItemId];
      const existingIndex = existingItems.findIndex((item: any) => item.id === addItemId);

      if (existingIndex > -1) {
        existingItems[existingIndex].quantity += 1;
      } else {
        existingItems.push({ ...targetProduct, quantity: 1 });
      }

      localStorage.setItem('kult_cart', JSON.stringify(existingItems));
      router.replace('/cart', { scroll: false });
    }

    setCartItems(existingItems);
    setIsLoaded(true);
  }, [searchParams, router]);

  const updateLocalStorage = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem('kult_cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    updateLocalStorage(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updated);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 20000 || cartItems.length === 0 ? 0 : 250;
  const total = subtotal + shipping;

  if (!isLoaded) return <div className="min-h-screen bg-[#0B0D12]" />;

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E5E7EB] font-sans selection:bg-[#DFAB36] selection:text-black pt-16">
      
      {/* Top Bar */}
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
        
        {/* Header Section */}
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
              href="/shop"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#222735] bg-[#12151E] hover:border-[#DFAB36]/40 text-xs font-mono uppercase tracking-widest text-[#E5E7EB] transition-all"
            >
              CONTINUE ADMIRING
            </Link>
            <Link
              href="/batch-001"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#222735] bg-[#12151E] hover:border-[#DFAB36]/40 text-xs font-mono uppercase tracking-widest text-[#E5E7EB] transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#DFAB36]" />
              <span>BATCH-001</span>
            </Link>
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[380px] rounded-3xl border border-[#DFAB36]/30 bg-[#111318] p-12 flex flex-col items-center justify-center text-center space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
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
          /* Cart Items List & Allocation Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 rounded-3xl border border-[#DFAB36]/25 bg-[#111318] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#DFAB36]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-[#DFAB36] uppercase tracking-widest font-semibold">
                        [{item.id}] // {item.gsm}
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#F9FAFB]">
                        {item.title}
                      </h3>
                      <p className="text-xs font-mono text-[#818796] uppercase tracking-widest">
                        {item.fabric}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-[#1A1D26]">
                      <div className="flex items-center border border-[#222735] bg-[#0A0C10] rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 text-[#818796] hover:text-[#DFAB36] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-[#F9FAFB]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 text-[#818796] hover:text-[#DFAB36] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right font-mono">
                        <span className="block text-sm font-bold text-[#DFAB36]">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
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
                  
                  {/* Visual Progress Bar */}
                  <div className="py-2 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-[#818796]">
                      <span>FREIGHT CAP</span>
                      <span>{subtotal >= 20000 ? 'REACHED' : `${Math.min(100, Math.round((subtotal / 20000) * 100))}%`}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0A0C10] rounded-full overflow-hidden border border-[#1A1D26]">
                      <div 
                        className="h-full bg-[#DFAB36] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(223,171,54,0.6)]" 
                        style={{ width: `${Math.min(100, (subtotal / 20000) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1A1D26] flex justify-between items-baseline font-sans">
                    <span className="font-bold text-[#818796] text-xs uppercase tracking-wider">TOTAL ALLOCATION</span>
                    <span className="text-xl font-black text-[#DFAB36] font-mono">
                      PKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#DFAB36] hover:bg-[#ebd04e] text-black font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(223,171,54,0.25)] group"
                >
                  <Lock className="w-4 h-4" />
                  <span>SECURE ALLOCATION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

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