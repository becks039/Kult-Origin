'use client';

import React, { useState, useEffect, createContext, useContext, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  Tag,
  CreditCard,
  Truck,
  Copy,
  X,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

// ==========================================
// 1. CART CONTEXT & PROVIDER INLINE MODULE
// ==========================================
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load saved cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kult_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  // Sync cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('kult_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // Return dummy state if used outside Provider so the page doesn't crash
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      subtotal: 0,
    };
  }
  return context;
};

// ==========================================
// 2. CHECKOUT COMPONENT
// ==========================================
const CHECKOUT_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop",
  },
];

function CheckoutContent() {
  const router = useRouter();
  const { cartItems, subtotal, removeFromCart, clearCart } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [founderCode, setFounderCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: 'Lahore',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Dynamic calculations based on Cart Context
  const shipping = cartItems.length > 0 ? 250 : 0;
  const discountAmount = discountApplied ? subtotal * 0.2 : 0;
  const grandTotal = Math.max(0, subtotal + shipping - discountAmount);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CHECKOUT_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      founderCode.trim().toUpperCase().startsWith('FOUNDER') ||
      founderCode.trim().toUpperCase() === 'ORIGIN50'
    ) {
      setDiscountApplied(true);
    } else {
      alert('INVALID CLANDESTINE KEY CODE');
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('YOUR CART IS EMPTY. ADD ITEMS BEFORE DEPLOYING ORDER.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
    }, 1200);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0123456789012345');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none z-10" />

      <div className="relative z-20">
        {/* HEADER & BREADCRUMB */}
        <section className="relative py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border border-[#2D323E] text-center overflow-hidden rounded-2xl sm:rounded-3xl my-4 sm:my-6 bg-[#0A0B0D]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {CHECKOUT_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-65' : 'opacity-0'
              } bg-cover bg-center filter brightness-90 contrast-110 scale-105 pointer-events-none`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/50 to-[#0A0B0D]/75 pointer-events-none" />

          <div className="relative z-10 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-bold">
              <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                HOME
              </Link>
              <span className="text-[#D4AF37]/40">//</span>
              <Link href="/Cart" className="hover:text-[#D4AF37] transition-colors">
                CART ({cartItems.length})
              </Link>
              <span className="text-[#D4AF37]/40">//</span>
              <Link href="/batch-001" className="hover:text-[#D4AF37] transition-colors">
                BATCH 001
              </Link>
            </div>

            <div>
              <span className="text-[9px] sm:text-xs text-[#D4AF37] border border-[#D4AF37]/60 bg-[#0A0B0D]/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold inline-block">
                SECURE CHECKOUT GATE
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
              INITIATE ALLOCATION
            </h1>
          </div>
        </section>

        {/* FORM & SUMMARY GRID */}
        <form
          onSubmit={handleOrderSubmit}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
        >
          {/* LEFT COLUMN: DESTINATION & PAYMENT */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* 01 // DESTINATION */}
            <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-5 sm:p-8 rounded-2xl space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <h2 className="text-base sm:text-xl font-bold font-monument uppercase text-[#E8E2D6] border-b border-[#2D323E] pb-3 flex items-center justify-between">
                <span>01 // DESTINATION PROTOCOL</span>
                <span className="text-[10px] sm:text-xs text-[#D4AF37] tracking-widest">
                  REQUIRED
                </span>
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-widest block font-bold mb-1">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="OPERATIVE"
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-widest block font-bold mb-1">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="NAME"
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-widest block font-bold mb-1">
                    AUTHENTICATED EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="OPERATIVE@DOMAIN.COM"
                    className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-widest block font-bold mb-1">
                    DISPATCH ADDRESS
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="HOUSE / STREET / SECTOR"
                    className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-widest block font-bold mb-1">
                      CITY
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="LAHORE"
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-widest block font-bold mb-1">
                      CONTACT NUMBER
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 02 // PAYMENT */}
            <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-5 sm:p-8 rounded-2xl space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <h2 className="text-base sm:text-xl font-bold font-monument uppercase text-[#E8E2D6] border-b border-[#2D323E] pb-3 flex items-center justify-between">
                <span>02 // PAYMENT GATEWAY</span>
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2D323E] bg-[#0A0B0D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase">CASH ON DELIVERY</span>
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#E8E2D6]/50 block pt-1 uppercase">
                    PAY AT DISPATCH DOORSTEP
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2D323E] bg-[#0A0B0D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase">DIRECT BANK TRANSFER</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#E8E2D6]/50 block pt-1 uppercase">
                    MANUAL RECEIPT VERIFICATION
                  </span>
                </button>
              </div>

              {paymentMethod === 'bank' && (
                <div className="p-4 bg-[#0A0B0D] border border-[#D4AF37]/40 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#D4AF37] font-bold">
                    <span>Meezan Bank Limited</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="flex items-center gap-1 text-[10px] bg-[#2D323E] text-[#E8E2D6] px-2 py-1 rounded hover:bg-[#D4AF37] hover:text-black transition-colors"
                    >
                      <Copy className="w-3 h-3" /> {copiedAccount ? 'COPIED' : 'COPY IBAN'}
                    </button>
                  </div>
                  <p className="text-[#E8E2D6]/70 text-[11px]">Title: KULT ORIGIN PK</p>
                  <p className="text-[#E8E2D6]/70 text-[11px] font-mono">
                    Account / IBAN: PK00 MEZN 0001 2345 6789 0123
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DYNAMIC CART MANIFEST */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-5 sm:p-8 rounded-2xl space-y-5 sticky top-6 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <h2 className="text-base sm:text-xl font-bold font-monument uppercase text-[#E8E2D6] border-b border-[#2D323E] pb-3 flex items-center justify-between">
                <span>ORDER MANIFEST ({cartItems.length})</span>
                <Tag className="w-4 h-4 text-[#D4AF37]" />
              </h2>

              {/* Dynamic Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 border-b border-[#2D323E] pb-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 space-y-3 border border-dashed border-[#2D323E] rounded-xl p-4">
                    <ShoppingBag className="w-8 h-8 text-[#D4AF37]/40 mx-auto" />
                    <p className="text-xs text-[#E8E2D6]/50 uppercase tracking-widest">
                      YOUR CART IS CURRENTLY EMPTY
                    </p>
                    <Link
                      href="/batch-001"
                      className="inline-block text-[10px] text-[#D4AF37] underline tracking-widest"
                    >
                      BROWSE ALLOCATIONS
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs bg-[#0A0B0D] p-3 rounded-xl border border-[#2D323E]"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-[#2D323E]"
                          />
                        )}
                        <div>
                          <h4 className="font-bold uppercase text-[#E8E2D6]">{item.name}</h4>
                          <p className="text-[10px] text-[#E8E2D6]/50 uppercase tracking-widest">
                            QTY: {item.quantity} {item.size ? `// SIZE: ${item.size}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-[#D4AF37]">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#E8E2D6]/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Founder Key Input */}
              <div className="space-y-2">
                <label className="text-[10px] text-[#E8E2D6]/60 uppercase tracking-widest block font-bold">
                  FOUNDER ALLOCATION KEY
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={founderCode}
                    onChange={(e) => setFounderCode(e.target.value)}
                    placeholder="E.G. ORIGIN50"
                    className="flex-1 min-w-0 bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] uppercase outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCode}
                    className="bg-[#2D323E] text-[#E8E2D6] hover:bg-[#D4AF37] hover:text-black font-black text-xs px-4 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                {discountApplied && (
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest pt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> FOUNDER 20% DISCOUNT APPLIED
                  </p>
                )}
              </div>

              {/* Dynamic Pricing Ledger */}
              <div className="space-y-2.5 pt-3 border-t border-[#2D323E] text-xs uppercase tracking-widest">
                <div className="flex justify-between text-[#E8E2D6]/60">
                  <span>SUBTOTAL</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>FOUNDER DISCOUNT (-20%)</span>
                    <span>- PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#E8E2D6]/60">
                  <span>DISPATCH CHARGES</span>
                  <span>PKR {shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-[#E8E2D6] border-t border-[#2D323E] pt-3">
                  <span>TOTAL DUE</span>
                  <span className="text-[#D4AF37] text-base sm:text-lg font-black">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black text-xs uppercase tracking-[0.25em] transition-all cursor-pointer rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'DEPLOYING ORDER...' : 'CONFIRM & DEPLOY ORDER'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12141B] border border-[#D4AF37] p-6 sm:p-8 rounded-2xl max-w-md w-full text-center space-y-4 relative shadow-[0_0_50px_rgba(212,175,55,0.2)]">
            <button
              onClick={() => {
                setOrderSuccess(false);
                router.push('/Cart');
              }}
              className="absolute top-4 right-4 text-[#E8E2D6]/50 hover:text-[#D4AF37]"
            >
              <X className="w-5 h-5" />
            </button>
            <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto animate-bounce" />
            <h3 className="text-xl font-black uppercase text-[#E8E2D6]">
              ALLOCATION DISPATCHED
            </h3>
            <p className="text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed">
              Order protocol initialized successfully for{' '}
              <span className="text-[#D4AF37] font-bold">
                {formData.firstName} {formData.lastName}
              </span>
              . Details dispatched to {formData.email}.
            </p>
            <div className="pt-2">
              <Link
                href="/Cart"
                className="inline-block py-3 px-6 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#b8952b] transition-colors"
              >
                RETURN TO CART
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MAIN EXPORT WRAPPED WITH PROVIDER
// ==========================================
export default function CheckoutPage() {
  return (
    <CartProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono p-6 text-center flex items-center justify-center tracking-widest text-xs">
            LOADING CHECKOUT PROTOCOL...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </CartProvider>
  );
}