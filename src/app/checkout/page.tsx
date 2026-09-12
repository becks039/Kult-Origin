'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';

import {
  CartItem,
  getCartData,
  saveCartData,
} from '@/lib/cart';

// ==========================================
// 1. CONFIG
// ==========================================

const CHECKOUT_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
  },
  {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop',
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop',
  },
];

const MASTER_KEYS = ['FOUNDER20', 'ORIGIN50', 'FOUNDER100'];

// ==========================================
// 2. CHECKOUT CONTENT
// ==========================================

function CheckoutContent() {
  const router = useRouter();

  // ==========================================
  // CART STATE
  // ==========================================

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // ==========================================
  // CHECKOUT STATE
  // ==========================================

  const [currentSlide, setCurrentSlide] = useState(0);
  const [founderCode, setFounderCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // ==========================================
  // LOAD CART FROM STORAGE
  // ==========================================

  useEffect(() => {
    const loadCart = () => {
      const { items, isExpired } = getCartData();
      if (isExpired) {
        setCartItems([]);
      } else {
        setCartItems(items);
      }

      setIsCartLoaded(true);
    };

    loadCart();

    window.addEventListener('kult_cart_updated', loadCart);

    return () => {
      window.removeEventListener('kult_cart_updated', loadCart);
    };
  }, []);

  // ==========================================
  // CHECKOUT SLIDES
  // ==========================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % CHECKOUT_SLIDES.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // DYNAMIC PRICE CALCULATIONS
  // ==========================================

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  const shipping =
    subtotal > 20000 || cartItems.length === 0 ? 0 : 250;

  // Calculate dynamic discount based on applied percentage (5%, 10%, 20%)
  const discountAmount = discountApplied ? (subtotal * appliedDiscountPercent) / 100 : 0;

  const grandTotal = Math.max(
    0,
    subtotal + shipping - discountAmount
  );

  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // DYNAMIC COUPON CODE VALIDATION LOGIC
  // ==========================================

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = founderCode.trim().toUpperCase();

    if (!code) return;

    setIsValidatingCode(true);
    setCouponError(null);

    // 1. Master Keys Fallback
    if (MASTER_KEYS.includes(code)) {
      setDiscountApplied(true);
      setAppliedDiscountPercent(20);
      setIsValidatingCode(false);
      return;
    }

    // 2. Validate UGC Reviews / Dynamic Coupons via API
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email: formData.email }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setDiscountApplied(true);
        setAppliedDiscountPercent(data.discountPercent || 20);
      } else {
        // Direct pattern recognition fallback for KULT-UGC-XX-XXXXX format
        const match = code.match(/^KULT-UGC-(5|10|20)-/);
        if (match) {
          const percent = parseInt(match[1], 10);
          setDiscountApplied(true);
          setAppliedDiscountPercent(percent);
        } else {
          setDiscountApplied(false);
          setAppliedDiscountPercent(0);
          setCouponError(data.message || 'INVALID DISCOUNT KEY CODE');
        }
      }
    } catch (err) {
      // Fallback regex validation if offline/server check fails
      const match = code.match(/^KULT-UGC-(5|10|20)-/);
      if (match) {
        const percent = parseInt(match[1], 10);
        setDiscountApplied(true);
        setAppliedDiscountPercent(percent);
      } else {
        setDiscountApplied(false);
        setAppliedDiscountPercent(0);
        setCouponError('COUPON VALIDATION ERROR');
      }
    } finally {
      setIsValidatingCode(false);
    }
  };

  // ==========================================
  // CHANGE QUANTITY
  // ==========================================

  const changeQuantity = (
    id: string,
    delta: number,
    size?: string
  ) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id && item.size === size) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0
            ? {
                ...item,
                quantity: newQuantity,
              }
            : null;
        }

        return item;
      })
      .filter((item): item is CartItem => item !== null);

    setCartItems(updated);
    saveCartData(updated);
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = (id: string, size?: string) => {
    const updated = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );

    setCartItems(updated);
    saveCartData(updated);
  };

  // ==========================================
  // COPY BANK ACCOUNT
  // ==========================================

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(
        'PK00MEZN0001234567890123'
      );
      setCopiedAccount(true);

      setTimeout(() => {
        setCopiedAccount(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy IBAN:', error);
    }
  };

  // ==========================================
  // ORDER SUBMISSION
  // ==========================================

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert(
        'YOUR CART IS EMPTY. ADD ITEMS BEFORE DEPLOYING ORDER.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
        },
        items: cartItems.map((item) => ({
          product: 1,
          quantity: item.quantity,
          unitPrice: item.price || 0,
          size: item.size || 'N/A',
        })),
        subtotal: subtotal,
        discount: discountAmount,
        discountPercentage: appliedDiscountPercent,
        appliedCoupon: discountApplied ? founderCode : null,
        shippingFee: shipping,
        totalAmount: grandTotal,
        isFounderOrder: discountApplied,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: 'PENDING',
        orderStatus: 'PROCESSING',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Order creation failed: ${res.status}`
        );
      }

      saveCartData([]);
      setCartItems([]);
      setIsSubmitting(false);
      setOrderSuccess(true);
    } catch (error) {
      console.error('ORDER DISPATCH ERROR:', error);

      alert(
        error instanceof Error
          ? `FAILED TO DISPATCH ORDER:\n\n${error.message}`
          : 'FAILED TO DISPATCH ALLOCATION TO PAYLOAD CMS.'
      );

      setIsSubmitting(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (!isCartLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono p-6 text-center flex items-center justify-center tracking-widest text-xs">
        LOADING CHECKOUT PROTOCOL...
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none z-10" />

      <div className="relative z-20">
        {/* HEADER */}
        <section className="relative py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border border-[#2D323E] text-center overflow-hidden rounded-2xl sm:rounded-3xl my-4 sm:my-6 bg-[#0A0B0D]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {CHECKOUT_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-65' : 'opacity-0'
              } bg-cover bg-center filter brightness-90 contrast-110 scale-105 pointer-events-none`}
              style={{
                backgroundImage: `url(${slide.url})`,
              }}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/50 to-[#0A0B0D]/75 pointer-events-none" />

          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* BREADCRUMBS */}
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-bold">
              <Link
                href="/"
                className="hover:text-[#D4AF37] transition-colors"
              >
                HOME
              </Link>

              <span className="text-[#D4AF37]/40">//</span>

              <Link
                href="/Cart"
                className="hover:text-[#D4AF37] transition-colors"
              >
                CART ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </Link>

              <span className="text-[#D4AF37]/40">//</span>

              <Link
                href="/batch-001"
                className="hover:text-[#D4AF37] transition-colors"
              >
                BATCH 001
              </Link>
            </div>

            {/* CHECKOUT BADGE */}
            <div>
              <span className="text-[9px] sm:text-xs text-[#D4AF37] border border-[#D4AF37]/60 bg-[#0A0B0D]/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold inline-block">
                SECURE CHECKOUT GATE
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-monument uppercase tracking-tight text-[#E8E2D6]">
              INITIATE ALLOCATION
            </h1>
          </div>
        </section>

        {/* MAIN FORM */}
        <form
          onSubmit={handleOrderSubmit}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
        >
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* DESTINATION PROTOCOL */}
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
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none transition-colors"
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
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none transition-colors"
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
                    className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none transition-colors"
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
                    className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none transition-colors"
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
                      placeholder="CITY NAME"
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none transition-colors"
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
                      className="w-full bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-5 sm:p-8 rounded-2xl space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <h2 className="text-base sm:text-xl font-bold font-monument uppercase text-[#E8E2D6] border-b border-[#2D323E] pb-3 flex items-center justify-between">
                <span>02 // PAYMENT GATEWAY</span>
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-xl text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2D323E] bg-[#0A0B0D] hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase">
                      CASH ON DELIVERY
                    </span>
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#E8E2D6]/50 block pt-1 uppercase">
                    PAY AT DISPATCH DOORSTEP
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 border rounded-xl text-left transition-all cursor-pointer ${
                    paymentMethod === 'bank'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#2D323E] bg-[#0A0B0D] hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase">
                      DIRECT BANK TRANSFER
                    </span>
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
                      className="flex items-center gap-1 text-[10px] bg-[#2D323E] text-[#E8E2D6] px-2 py-1 rounded hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedAccount ? 'COPIED' : 'COPY IBAN'}
                    </button>
                  </div>
                  <p className="text-[#E8E2D6]/70 text-[11px]">
                    Title: KULT ORIGIN PK
                  </p>
                  <p className="text-[#E8E2D6]/70 text-[11px] font-mono">
                    Account / IBAN: PK00 MEZN 0001 2345 6789 0123
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-5 sm:p-8 rounded-2xl space-y-5 sticky top-6 shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <h2 className="text-base sm:text-xl font-bold font-monument uppercase text-[#E8E2D6] border-b border-[#2D323E] pb-3 flex items-center justify-between">
                <span>ORDER MANIFEST ({cartItems.length})</span>
                <Tag className="w-4 h-4 text-[#D4AF37]" />
              </h2>

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
                  cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size ?? 'default'}-${index}`}
                      className="flex items-center justify-between text-xs bg-[#0A0B0D] p-3 rounded-xl border border-[#2D323E]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded-lg border border-[#2D323E] shrink-0"
                          />
                        )}

                        <div className="min-w-0">
                          <h4 className="font-bold uppercase text-[#E8E2D6] truncate">
                            {item.title}
                          </h4>

                          <div className="flex items-center gap-2 mt-1">
                            {item.size && (
                              <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/30 px-1.5 py-0.5 rounded">
                                {item.size}
                              </span>
                            )}

                            <div className="flex items-center border border-[#2D323E] rounded bg-[#12141B]">
                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(item.id, -1, item.size)
                                }
                                className="px-1.5 py-0.5 hover:text-[#D4AF37] cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>

                              <span className="px-1 text-[10px]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(item.id, 1, item.size)
                                }
                                className="px-1.5 py-0.5 hover:text-[#D4AF37] cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-black text-[#D4AF37]">
                          PKR{' '}
                          {(
                            (item.price || 0) * item.quantity
                          ).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-[#E8E2D6]/40 hover:text-red-400 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* DISCOUNT INPUT & VALIDATION */}
              <div className="space-y-2">
                <label className="text-[10px] text-[#E8E2D6]/60 uppercase tracking-widest block font-bold">
                  FOUNDER / UGC PROMO CODE
                </label>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={founderCode}
                    onChange={(e) => setFounderCode(e.target.value)}
                    placeholder="E.G. KULT-UGC-20-X8F9A"
                    className="flex-1 min-w-0 bg-[#0A0B0D] border border-[#2D323E] focus:border-[#D4AF37] p-3 rounded-xl text-xs tracking-widest text-[#E8E2D6] uppercase outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleApplyCode}
                    disabled={isValidatingCode}
                    className="bg-[#2D323E] text-[#E8E2D6] hover:bg-[#D4AF37] hover:text-black font-black text-xs px-4 rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    {isValidatingCode ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'APPLY'
                    )}
                  </button>
                </div>

                {discountApplied && (
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest pt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {appliedDiscountPercent}% DISCOUNT APPLIED SUCCESSFULLY
                  </p>
                )}

                {couponError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest pt-1">
                    ⚠️ {couponError}
                  </p>
                )}
              </div>

              {/* SUMMARY CALCULATIONS */}
              <div className="space-y-2.5 pt-3 border-t border-[#2D323E] text-xs uppercase tracking-widest">
                <div className="flex justify-between text-[#E8E2D6]/60">
                  <span>SUBTOTAL</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>PROMO DISCOUNT (-{appliedDiscountPercent}%)</span>
                    <span>- PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#E8E2D6]/60">
                  <span>DISPATCH CHARGES</span>
                  <span>
                    {shipping === 0
                      ? 'COMPLIMENTARY'
                      : `PKR ${shipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-[#E8E2D6] border-t border-[#2D323E] pt-3">
                  <span>TOTAL DUE</span>
                  <span className="text-[#D4AF37] text-base sm:text-lg font-black">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black text-xs uppercase tracking-[0.25em] transition-all cursor-pointer rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>DISPATCHING TO CMS...</span>
                  </>
                ) : (
                  'CONFIRM & DEPLOY ORDER'
                )}
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
              type="button"
              onClick={() => {
                setOrderSuccess(false);
                router.push('/');
              }}
              className="absolute top-4 right-4 text-[#E8E2D6]/50 hover:text-[#D4AF37] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto animate-bounce" />

            <h3 className="text-xl font-black uppercase text-[#E8E2D6]">
              ALLOCATION DISPATCHED
            </h3>

            <p className="text-xs text-[#E8E2D6]/70 uppercase tracking-widest leading-relaxed">
              Order successfully logged in Payload CMS for{' '}
              <span className="text-[#D4AF37] font-bold">
                {formData.firstName} {formData.lastName}
              </span>
              . Details sent to {formData.email}.
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-block py-3 px-6 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#b8952b] transition-colors"
              >
                RETURN TO CATALOG
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. MAIN EXPORT
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono p-6 text-center flex items-center justify-center tracking-widest text-xs">
          LOADING CHECKOUT PROTOCOL...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}