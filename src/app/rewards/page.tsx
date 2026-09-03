'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Tactical Visual Backgrounds
const SLIDING_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop'
];

export default function UGCRewardsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewType, setReviewType] = useState<'TEXT' | 'PHOTO' | 'VIDEO'>('VIDEO');
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    content: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Auto calculate discount percentage base on review type
  const targetDiscountPercentage = reviewType === 'TEXT' ? 5 : reviewType === 'PHOTO' ? 10 : 20;

  // Background Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDING_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const mediaIds: string[] = [];

      // Step 1: Upload media to Payload Media collection if media file selected
      if (selectedFile) {
        const filePayload = new FormData();
        filePayload.append('file', selectedFile);

        const uploadRes = await fetch('/api/media', {
          method: 'POST',
          body: filePayload,
        });

        if (uploadRes.ok) {
          const mediaDoc = await uploadRes.json();
          const uploadedId = mediaDoc.doc?.id || mediaDoc.id;
          if (uploadedId) mediaIds.push(uploadedId);
        } else {
          throw new Error('Media file upload failed. Please verify file format.');
        }
      } else if (reviewType !== 'TEXT') {
        throw new Error(`Media attachment is mandatory for ${reviewType} review tier.`);
      }

      // Step 2: Post Review record to route handler with PENDING status for Admin Approval
      const response = await fetch('/api/ugc-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: formData.customerId,
          productId: formData.productId,
          type: reviewType,
          content: formData.content,
          mediaIds,
          requestedDiscount: targetDiscountPercentage,
          status: 'PENDING'
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.doc || result.id)) {
        setSubmissionSuccess(true);
      } else {
        setErrorMessage(result.message || 'Failed to submit review to system.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network communication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      {/* BACKGROUND SLIDER WITH OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {SLIDING_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-40 scale-105 transition-transform duration-10000' : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/80 via-[#0A0B0D]/70 to-[#0A0B0D]/90" />
      </div>

      <div className="fixed inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none z-10" />

      {/* MAIN CONTAINER */}
      <div className="relative z-20 pb-16 sm:pb-20">

        {/* HEADER BAR */}
        <header className="pt-6 sm:pt-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center max-w-5xl mx-auto gap-2">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-all duration-300 text-xs sm:text-sm">←</span>
              <span className="group-hover:text-[#D4AF37] transition-colors duration-300">HOME</span>
            </Link>

            <Link 
              href="/batch-001" 
              className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95 transition-all"
            >
              <span className="group-hover:text-[#D4AF37] transition-colors duration-300">BATCH 001</span>
              <span className="text-[#E8E2D6] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300 text-xs sm:text-sm">→</span>
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-8 sm:pt-10 pb-10 sm:pb-12 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#2D323E]/60 space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 text-center max-w-4xl mx-auto">
            <div>
              <span className="text-[10px] sm:text-xs text-[#D4AF37] border border-[#D4AF37]/40 bg-[#12141B]/80 px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold inline-block backdrop-blur-md shadow-md">
                PROTOCOL // REWARD ENGINE
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-tight text-[#E8E2D6]">
              FIELD TEST REWARDS
            </h1>
            
            <p className="text-[11px] sm:text-sm text-[#E8E2D6]/90 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed font-mono">
              SUBMIT WRITTEN OR MEDIA VALIDATION. PAYLOAD CMS WILL VERIFY REVIEWS AND ALLOCATE PROMO DISCOUNTS DIRECTLY.
            </p>
          </div>
        </section>

        {/* TIER SELECTION */}
        <section className="py-10 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-widest font-bold">MODULE 4.1 // TIER ALLOCATION</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]">
              SELECT VALIDATION TIER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* TIER 01: TEXT */}
            <div 
              onClick={() => setReviewType('TEXT')}
              className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md active:scale-98 ${
                reviewType === 'TEXT' 
                  ? 'bg-[#12141B]/95 border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] scale-[1.02]' 
                  : 'bg-[#12141B]/70 border-[#2D323E]'
              }`}
            >
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">TIER 01 // TEXT REVIEW</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] mt-2 sm:mt-3">5% OFF</h3>
              <p className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-wider mt-2 sm:mt-3 leading-relaxed">
                Written feedback detailing fabric & fit performance under tension.
              </p>
            </div>

            {/* TIER 02: PHOTO */}
            <div 
              onClick={() => setReviewType('PHOTO')}
              className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md active:scale-98 ${
                reviewType === 'PHOTO' 
                  ? 'bg-[#12141B]/95 border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] scale-[1.02]' 
                  : 'bg-[#12141B]/70 border-[#2D323E]'
              }`}
            >
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">TIER 02 // PHOTO REVIEW</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] mt-2 sm:mt-3">10% OFF</h3>
              <p className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-wider mt-2 sm:mt-3 leading-relaxed">
                High-res fit photos showcasing silhouette & seam construction.
              </p>
            </div>

            {/* TIER 03: VIDEO */}
            <div 
              onClick={() => setReviewType('VIDEO')}
              className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden active:scale-98 ${
                reviewType === 'VIDEO' 
                  ? 'bg-[#12141B]/95 border-[#D4AF37]/60 shadow-[0_0_35px_rgba(212,175,55,0.35)] scale-[1.02]' 
                  : 'bg-[#12141B]/70 border-[#2D323E]'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[8px] sm:text-[9px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-bl-lg tracking-widest">
                MAX REWARD
              </div>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">TIER 03 // VIDEO REVIEW</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] mt-2 sm:mt-3">20% OFF</h3>
              <p className="text-[10px] sm:text-[11px] text-[#E8E2D6]/70 uppercase tracking-wider mt-2 sm:mt-3 leading-relaxed">
                15-20 sec vertical video wearing gear active inside gym or field.
              </p>
            </div>

          </div>
        </section>

        {/* DYNAMIC FORM SECTION */}
        <section className="px-4 sm:px-6 max-w-3xl mx-auto">
          {!submissionSuccess ? (
            <form 
              onSubmit={handleFormSubmit} 
              className="bg-[#12141B]/90 backdrop-blur-md border border-[#2D323E] p-6 sm:p-10 rounded-2xl space-y-5 sm:space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            >
              <div className="flex justify-between items-center border-b border-[#2D323E] pb-3 sm:pb-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase text-[#D4AF37] tracking-widest">
                  TRANSMISSION FORM // {reviewType} ({targetDiscountPercentage}% CLAIM)
                </h3>
                <span className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 uppercase tracking-widest">PAYLOAD CMS STORAGE</span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs tracking-wider uppercase font-mono">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">CUSTOMER ID / EMAIL</label>
                  <input 
                    type="text"
                    required
                    placeholder="ENTER CUSTOMER IDENTIFIER"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full bg-[#0A0B0D]/80 border border-[#2D323E] focus:border-[#D4AF37]/50 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs text-[#E8E2D6] outline-none tracking-widest transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">PRODUCT ID</label>
                  <input 
                    type="text"
                    required
                    placeholder="PRODUCT RELATIONSHIP ID"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full bg-[#0A0B0D]/80 border border-[#2D323E] focus:border-[#D4AF37]/50 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs text-[#E8E2D6] outline-none tracking-widest transition-colors font-mono"
                  />
                </div>
              </div>

              {/* REVIEW CONTENT TEXTAREA */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">WRITTEN REVIEW FEEDBACK</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="DESCRIBE GEAR FABRIC COMPRESSION, STITCHING DURABILITY, AND FIT UNDER RESISTANCE..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#0A0B0D]/80 border border-[#2D323E] focus:border-[#D4AF37]/50 rounded-xl p-3.5 sm:p-4 text-xs text-[#E8E2D6] outline-none tracking-widest leading-relaxed transition-colors font-mono"
                />
              </div>

              {/* MEDIA ATTACHMENT SECTION */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#E8E2D6]/80 font-bold">
                  MEDIA ATTACHMENT {reviewType === 'TEXT' ? '(OPTIONAL FOR 5% CLAIM)' : '(REQUIRED FOR THIS TIER)'}
                </label>
                <div className="border-2 border-dashed border-[#2D323E] hover:border-[#D4AF37]/40 rounded-xl p-6 sm:p-8 text-center bg-[#0A0B0D]/60 cursor-pointer transition-all">
                  <input 
                    type="file" 
                    accept={reviewType === 'VIDEO' ? 'video/*' : reviewType === 'PHOTO' ? 'image/*' : 'image/*,video/*'}
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    id="ugc-file-input"
                  />
                  <label htmlFor="ugc-file-input" className="cursor-pointer space-y-1.5 sm:space-y-2 block">
                    <p className="text-xs text-[#E8E2D6] font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors break-all">
                      {selectedFile ? `SELECTED: ${selectedFile.name}` : `ATTACH ${reviewType === 'TEXT' ? 'MEDIA (IF ANY)' : reviewType} FILE HERE`}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-[#E8E2D6]/40 uppercase tracking-widest">
                      RAW, UNEDITED AND HIGH RESOLUTION FORMATS PREFERRED
                    </p>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="group w-full py-3.5 sm:py-4 bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-colors rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.9)] cursor-pointer backdrop-blur-md active:scale-95 disabled:opacity-50"
              >
                <span className="group-hover:text-[#D4AF37] transition-colors">
                  {isSubmitting ? 'SAVING TO PAYLOAD DATABASE...' : `TRANSMIT REVIEW FOR ${targetDiscountPercentage}% DISCOUNT VALIDATION`}
                </span>
              </button>

            </form>
          ) : (
            <div className="bg-[#12141B]/95 backdrop-blur-md border border-[#2D323E] p-6 sm:p-10 rounded-2xl text-center space-y-5 sm:space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
              <div>
                <span className="text-[10px] sm:text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em] border border-[#D4AF37]/40 px-4 sm:px-5 py-1.5 rounded-full inline-block bg-[#0A0B0D]">
                  REVIEW RECORDED // STATUS: PENDING ADMIN ALLOCATION
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-[#E8E2D6] uppercase tracking-tight">
                SUBMISSION TRANSMITTED
              </h2>
              
              <p className="text-[11px] sm:text-xs text-[#E8E2D6]/70 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                YOUR REVIEW HAS BEEN STORED IN PAYLOAD CMS. ONCE ADMIN APPROVES THE SUBMISSION, YOUR DEDICATED PROMO CODE ({targetDiscountPercentage}% DISCOUNT) WILL BE DISPATCHED TO YOUR ACCOUNT.
              </p>

              <div className="pt-2 sm:pt-4 flex justify-center">
                <Link 
                  href="/batch-001" 
                  className="group w-full sm:w-auto py-3.5 sm:py-4 px-8 sm:px-10 bg-[#12141B]/95 border border-[#2D323E] text-[#E8E2D6] font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-full transition-colors shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md active:scale-95"
                >
                  <span className="group-hover:text-[#D4AF37] transition-colors">
                    BROWSE BATCH 001 CATALOGUE
                  </span>
                </Link>
              </div>
            </div>
          )}
        </section>

      </div>

    </div>
  );
}