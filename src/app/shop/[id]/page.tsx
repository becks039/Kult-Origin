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
  ShoppingBag
} from 'lucide-react';
 import {
  getCartData,
  saveCartData,
  getActiveCartCount,
} from '@/lib/cart';
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleProductPage({ params }: PageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [relevantProducts, setRelevantProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{ show: boolean; title: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Payload API Se Data Fetching
  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        
        // 1. Safe Fetch Logic: Query by Slug First, then Fallback to ID
        let raw: any = null;
        
        const slugRes = await fetch(`/api/products?where[slug][equals]=${encodeURIComponent(id)}&depth=2`);
        if (slugRes.ok) {
          const slugData = await slugRes.json();
          if (slugData.docs && slugData.docs.length > 0) {
            raw = slugData.docs[0];
          }
        }

        // Fallback to direct ID fetch if slug match failed
        if (!raw) {
          const idRes = await fetch(`/api/products/${id}?depth=2`);
          if (idRes.ok) {
            raw = await idRes.json();
          }
        }

        if (!raw) {
          throw new Error('Product not found');
        }

        // Extract Images
        const imgs = (raw.images || [])
          .map((item: any) => (typeof item.image === 'object' ? item.image?.url : null))
          .filter(Boolean);
        const mainImg = imgs[0] || raw.image?.url || raw.image || '/placeholder.png';

        // RichText Serializer
        const descText = typeof raw.description === 'string' 
          ? raw.description 
          : raw.description?.root?.children?.map((b: any) => b.children?.map((c: any) => c.text).join('')).join('\n') || '';

        const catName = typeof raw.category === 'object' ? (raw.category?.title || raw.category?.name) : 'COLLECTION';

        // Available Sizes Mapping
        const availableSizes = Array.isArray(raw.sizes) && raw.sizes.length > 0
          ? raw.sizes
          : ['SMALL', 'MEDIUM', 'LARGE', 'X-LARGE'];

        const formattedProduct = {
          id: String(raw.id),
          slug: raw.slug || String(raw.id),
          title: raw.title,
          batch: raw.batch || 'BATCH-001',
          isFounderEdition: raw.isFounderEdition ?? true,
          msrp: `PKR ${raw.msrp?.toLocaleString() || 0}`,
          founderPrice: `PKR ${raw.founderPrice?.toLocaleString() || 0}`,
          gsm: raw.gsm ? `${raw.gsm} GSM` : '200+ GSM',
          fabric: raw.fabric || '200+ GSM Heavy-Fleece Technical Fabric',
          category: catName,
          status: raw.status || 'AVAILABLE',
          sizes: availableSizes,
          specs: raw.printType || '3D High-Build Silicone/Rubberized Print',
          description: descText,
          image: mainImg,
          images: imgs.length > 0 ? imgs : [mainImg],
        };

        setProduct(formattedProduct);
        setSelectedImage(mainImg);
        setSelectedSize(availableSizes[0]); // Default to first available size

        // Fetch Related Products
        const catId = typeof raw.category === 'object' ? raw.category.id : raw.category;
        if (catId) {
          const relRes = await fetch(`/api/products?where[category][equals]=${catId}&where[id][not_equals]=${raw.id}&limit=3&depth=2`);
          if (relRes.ok) {
            const relData = await relRes.json();
            const formattedRel = (relData.docs || []).map((doc: any) => {
              const relImg = doc.images?.[0]?.image?.url || doc.image?.url || doc.image || '/placeholder.png';
              return {
                id: String(doc.slug || doc.id),
                title: doc.title,
                msrp: `PKR ${doc.msrp?.toLocaleString() || 0}`,
                founderPrice: `PKR ${doc.founderPrice?.toLocaleString() || 0}`,
                gsm: doc.gsm ? `${doc.gsm} GSM` : '200+ GSM',
                specs: doc.printType || 'Screen Print',
                image: relImg,
              };
            });
            setRelevantProducts(formattedRel);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
    updateCartCount();
  }, [id]);

  const updateCartCount = () => {
  setCartCount(getActiveCartCount());
};

  const handleAddToCart = () => {
  if (!product || product.status === 'SOLD_OUT') return;

  const { items: existingCart } = getCartData();

  const numericPrice =
    parseInt(
      String(product.founderPrice).replace(/[^0-9]/g, ''),
      10
    ) || 0;

  const existingIndex = existingCart.findIndex(
    (item: any) =>
      item.id === product.id &&
      item.size === selectedSize
  );

  if (existingIndex > -1) {
    existingCart[existingIndex] = {
      ...existingCart[existingIndex],
      quantity:
        (existingCart[existingIndex].quantity || 1) +
        quantity,
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

  window.dispatchEvent(new Event('cart-updated'));

  setAddedId(product.id);
  setToastNotification({
    show: true,
    title: product.title,
  });

  setTimeout(() => setAddedId(null), 2500);
  setTimeout(
    () => setToastNotification(null),
    3500
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono flex items-center justify-center">
        <div className="text-xs tracking-[0.3em] uppercase animate-pulse text-[#D4AF37]">
          [ LOADING PRODUCT MATRIX... ]
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold uppercase tracking-widest text-rose-500">PRODUCT NOT FOUND</h1>
        <Link href="/shop" className="text-xs text-[#D4AF37] underline tracking-widest uppercase">
          RETURN TO CATALOGUE
        </Link>
      </div>
    );
  }

  const isSoldOut = product.status === 'SOLD_OUT';

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastNotification?.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm bg-[#12141B] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-[#D4AF37]" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase truncate text-[#E8E2D6]">
                {toastNotification.title}
              </h4>
              <p className="text-[10px] text-[#D4AF37] uppercase">ADDED TO CART</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="w-full border-b border-[#2D323E] bg-[#0A0B0D]/90 px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2D323E] bg-[#12141B] text-xs font-bold uppercase text-[#E8E2D6] hover:text-[#D4AF37]">
            <ArrowLeft className="w-4 h-4" /> BACK TO SHOP
          </Link>

          <Link href="/Cart" className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-[#2D323E] bg-[#12141B] text-xs font-bold uppercase text-[#E8E2D6]">
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="bg-[#D4AF37] text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[450px] sm:h-[550px] bg-[#12141B] border border-[#2D323E] rounded-2xl relative overflow-hidden">
              <img src={selectedImage} alt={product.title} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 text-xs bg-[#2D323E] text-[#E8E2D6] px-3 py-1 rounded-md font-bold">
                {product.gsm}
              </span>
              {isSoldOut && (
                <span className="absolute top-4 right-4 text-xs bg-rose-600 text-white px-3 py-1 rounded-md font-bold uppercase">
                  SOLD OUT
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                      selectedImage === imgUrl ? 'border-[#D4AF37]' : 'border-[#2D323E] opacity-60'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-6 bg-[#12141B]/60 border border-[#2D323E] p-8 rounded-2xl">
            {/* Header & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">{product.category}</span>
                <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                  {product.batch}
                </span>
                {product.isFounderEdition && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                    FOUNDER EDITION
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black uppercase text-[#E8E2D6] tracking-wide">{product.title}</h1>
            </div>

            <div className="flex justify-between items-center bg-[#0A0B0D] p-4 rounded-xl border border-[#2D323E]">
              <div>
                <span className="text-[9px] text-[#E8E2D6]/40 block uppercase">MSRP</span>
                <span className="text-lg font-black text-[#E8E2D6] line-through">{product.msrp}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#D4AF37] block font-bold uppercase">FOUNDER PRICE</span>
                <span className="text-base font-bold text-[#D4AF37]">{product.founderPrice}</span>
              </div>
            </div>

            <p className="text-xs text-[#E8E2D6]/70 uppercase leading-relaxed border-l-2 border-[#D4AF37] pl-4 whitespace-pre-line">
              {product.description || 'Heavyweight technical garment built for durability.'}
            </p>

            {/* Dynamic Size Selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#E8E2D6]/70 uppercase font-bold">AVAILABLE SIZES</label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isSoldOut}
                    className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                      selectedSize === size 
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                        : 'bg-[#0A0B0D] text-[#E8E2D6] border-[#2D323E] hover:border-[#D4AF37]/50'
                    } ${isSoldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#E8E2D6]/70 uppercase font-bold">QUANTITY</label>
              <div className="flex items-center gap-4 bg-[#0A0B0D] p-2 rounded-xl border border-[#2D323E] w-max">
                <button 
                  onClick={() => setQuantity((p) => Math.max(1, p - 1))} 
                  disabled={isSoldOut}
                  className="w-8 h-8 rounded bg-[#12141B] flex items-center justify-center disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity((p) => p + 1)} 
                  disabled={isSoldOut}
                  className="w-8 h-8 rounded bg-[#12141B] flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className={`w-full py-4 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${
                isSoldOut
                  ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                  : 'bg-[#D4AF37] text-black hover:bg-[#b8952d] cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isSoldOut ? 'ALLOCATION CLOSED (SOLD OUT)' : 'SECURE ALLOCATION'}
              </span>
            </button>
          </div>
        </div>

        {/* Relevant Items */}
        {relevantProducts.length > 0 && (
          <div className="pt-12 border-t border-[#2D323E] space-y-6">
            <h2 className="text-xl font-black uppercase text-[#E8E2D6]">RELATED UNITS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relevantProducts.map((rel) => (
                <Link key={rel.id} href={`/shop/${rel.id}`} className="bg-[#12141B] border border-[#2D323E] p-4 rounded-xl block hover:border-[#D4AF37] transition-all">
                  <img src={rel.image} alt="" className="w-full h-48 object-cover rounded-lg mb-3" />
                  <h3 className="text-xs font-bold text-[#E8E2D6] uppercase">{rel.title}</h3>
                  <p className="text-xs text-[#D4AF37] font-bold mt-1">{rel.founderPrice}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}