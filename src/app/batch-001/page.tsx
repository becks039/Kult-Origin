'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShieldAlert,
  KeyRound,
  ArrowLeft,
  Lock,
  Sparkles,
  UserPlus,
  Mail,
  User,
  Send,
  Check,
  Calendar,
  Phone,
} from 'lucide-react'
import { getCartData } from '@/lib/cart'

const BACKGROUND_SLIDES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1920&auto=format&fit=crop',
]

const STORAGE_KEY_ACCESS = 'kult_batch001_access'
const STORAGE_KEY_OLD = 'kult_vault_unlocked'

export default function Batch001Page() {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'unlock' | 'request'>('unlock')

  // Key Verification State
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Access Request State
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerBirthDate, setRegisterBirthDate] = useState('')
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState('') // <--- PHONE NUMBER STATE ADDED
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  // Background Slideshow State
  const [bgIndex, setBgIndex] = useState(0)

  // Check Existing Access & Mount State
  useEffect(() => {
    setMounted(true)
    const accessGranted = localStorage.getItem(STORAGE_KEY_ACCESS) === 'true'

    if (accessGranted) {
      router.replace('/shop')
    }
  }, [router])

  // Automatic Background Slideshow
  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [mounted])

  // Key Authentication Handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const inputCleanKey = password.trim().toUpperCase()
    if (!inputCleanKey) return

    setIsAuthenticating(true)
    setError(null)

    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: inputCleanKey }),
      })

      if (!response.ok) {
        setError('INVALID KEY // REGISTER FOR ACCESS')
        return
      }

      localStorage.setItem('kult_access_key', inputCleanKey)
      localStorage.setItem('kult_founder_key', inputCleanKey)
      localStorage.setItem(STORAGE_KEY_ACCESS, 'true')
      localStorage.removeItem(STORAGE_KEY_OLD)

      const { isExpired } = getCartData(inputCleanKey)

      if (isExpired) {
        localStorage.removeItem(`kult_cart_${inputCleanKey}`)
        localStorage.setItem('kult_discount_expired', 'true')
      } else {
        localStorage.setItem('kult_discount_expired', 'false')
      }

      window.dispatchEvent(new Event('cart-updated'))
      window.dispatchEvent(new Event('storage'))

      router.replace('/shop')
    } catch (err) {
      console.error('KEY VERIFICATION ERROR:', err)
      setError('AUTHENTICATION FAILED // TRY AGAIN')
    }  {
      setIsAuthenticating(false)
    }
  }

  // Request Access Key Handler
  const handleRequestKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerEmail.trim() || !registerName.trim()) return

    setIsRequesting(true)
    setRequestSuccess(false)
    setRequestError(null)

    try {
      const response = await fetch('/api/request-access-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName.trim(),
          email: registerEmail.trim(),
          birthDate: registerBirthDate ? registerBirthDate.trim() : null,
          phoneNumber: registerPhoneNumber ? registerPhoneNumber.trim() : null, // <--- PHONE FORWARDED
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to request access key')
      }

      setRequestSuccess(true)
    } catch (err) {
      console.error('REQUEST ACCESS ERROR:', err)
      setRequestError('UNABLE TO DISPATCH REQUEST // CHECK CONNECTION')
    } finally {
      setIsRequesting(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#0A0B0D]" />
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#E8E2D6] font-mono selection:bg-[#D4AF37] selection:text-black relative overflow-x-hidden">
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 overflow-hidden">
        {/* Background Images */}
        {BACKGROUND_SLIDES.map((slide, idx) => (
          <div
            key={slide}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex ? 'opacity-70' : 'opacity-0'
            }`}
          >
            <Image
              src={slide}
              alt="Background Slide"
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center scale-105"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/60 to-[#0A0B0D]/75 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none z-10" />

        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30 flex items-center space-x-2 text-[10px] sm:text-xs text-white/80 hover:text-[#D4AF37] uppercase tracking-[0.2em] transition-all cursor-pointer bg-black/70 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2 rounded-full border border-white/20 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Home</span>
        </button>

        <div className="relative z-20 w-full max-w-3xl bg-[#12141B]/95 border border-[#D4AF37]/40 p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-6 sm:space-y-8 mt-10 sm:mt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-[#2D323E] pb-6 sm:pb-8">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 text-[9px] sm:text-[10px] text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>RESTRICTED ACCESS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#E8E2D6]">
                CLANDESTINE VAULT
              </h1>
              <p className="text-[11px] sm:text-xs text-white/70 uppercase tracking-widest max-w-md">
                BATCH 001 IS EXCLUSIVELY ALLOCATED VIA FOUNDER KEYS
              </p>
            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] shrink-0">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#0A0B0D] p-1.5 rounded-xl border border-[#2D323E]">
            <button
              type="button"
              onClick={() => setActiveTab('unlock')}
              className={`py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activeTab === 'unlock'
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>ENTER KEY</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('request')}
              className={`py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activeTab === 'request'
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>REQUEST ACCESS</span>
            </button>
          </div>

          {activeTab === 'unlock' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <div className="relative flex-1">
                  <input
                    type="password"
                    id="vault-key"
                    name="vault-key"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    placeholder="KEY: ORIGIN50"
                    aria-label="Vault Key"
                    className={`w-full bg-[#0A0B0D]/95 border ${
                      error ? 'border-red-500' : 'border-[#2D323E] focus:border-[#D4AF37]'
                    } px-4 py-3.5 sm:px-6 sm:py-4 text-center sm:text-left text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl transition-all shadow-inner`}
                  />
                  <KeyRound className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block" />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#D4AF37] to-[#b8952b] text-black font-black text-xs uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] shrink-0 disabled:opacity-50"
                >
                  {isAuthenticating ? 'VERIFYING...' : 'AUTHENTICATE'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest text-center sm:text-left">
                <span>
                  TEST KEY: <strong className="text-[#D4AF37]">ORIGIN50</strong>
                </span>
                <span>NO KEY? CLICK "REQUEST ACCESS"</span>
              </div>

              {error && (
                <div className="flex items-center justify-center space-x-2 bg-red-500/10 border border-red-500/40 p-3 rounded-xl text-red-400 text-[11px] tracking-widest uppercase">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}

          {activeTab === 'request' && (
            <div className="space-y-4">
              {!requestSuccess ? (
                <form onSubmit={handleRequestKeySubmit} className="space-y-4">
                  <p className="text-[11px] sm:text-xs text-white/70 uppercase tracking-wider">
                    Provide your profile details to register for Batch 001 allocation. An authentication key will be dispatched to your email.
                  </p>

                  <div className="space-y-3">
                    {/* FULL NAME */}
                    <div className="relative">
                      <input
                        type="text"
                        required
                        id="register-name"
                        name="name"
                        autoComplete="name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="FULL NAME"
                        aria-label="Full Name"
                        className="w-full bg-[#0A0B0D]/95 border border-[#2D323E] focus:border-[#D4AF37] px-4 py-3.5 text-xs font-bold tracking-widest uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl"
                      />
                      <User className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* EMAIL */}
                    <div className="relative">
                      <input
                        type="email"
                        required
                        id="register-email"
                        name="email"
                        autoComplete="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="EMAIL ADDRESS"
                        aria-label="Email Address"
                        className="w-full bg-[#0A0B0D]/95 border border-[#2D323E] focus:border-[#D4AF37] px-4 py-3.5 text-xs font-bold tracking-widest uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl"
                      />
                      <Mail className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* PHONE NUMBER FIELD */}
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        id="register-phone"
                        name="phoneNumber"
                        autoComplete="tel"
                        value={registerPhoneNumber}
                        onChange={(e) => setRegisterPhoneNumber(e.target.value)}
                        placeholder="PHONE NUMBER (E.G. +92 300 1234567)"
                        aria-label="Phone Number"
                        className="w-full bg-[#0A0B0D]/95 border border-[#2D323E] focus:border-[#D4AF37] px-4 py-3.5 text-xs font-bold tracking-widest uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl"
                      />
                      <Phone className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* DATE OF BIRTH FIELD */}
                    <div className="relative">
                      <input
                        type="date"
                        required
                        id="register-birthdate"
                        name="birthDate"
                        value={registerBirthDate}
                        onChange={(e) => setRegisterBirthDate(e.target.value)}
                        aria-label="Date of Birth"
                        className="w-full bg-[#0A0B0D]/95 border border-[#2D323E] focus:border-[#D4AF37] px-4 py-3.5 text-xs font-bold tracking-widest uppercase text-[#E8E2D6] placeholder:text-white/30 outline-none rounded-xl [color-scheme:dark]"
                      />
                      <Calendar className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRequesting}
                    className="w-full py-4 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-[#b8952b] active:scale-[0.98] transition-all cursor-pointer rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isRequesting ? 'DISPATCHING REQUEST...' : 'REQUEST ACCESS KEY'}</span>
                  </button>

                  {requestError && (
                    <div className="flex items-center justify-center space-x-2 bg-red-500/10 border border-red-500/40 p-3 rounded-xl text-red-400 text-[11px] tracking-widest uppercase">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{requestError}</span>
                    </div>
                  )}
                </form>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/40 p-5 rounded-2xl space-y-3 text-center">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                    ACCESS REQUEST RECEIVED
                  </h3>
                  <p className="text-[11px] text-white/80 tracking-wide">
                    We have queued your profile. Check{' '}
                    <span className="text-[#D4AF37] font-bold">{registerEmail}</span> for your Batch 001 allocation key.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestSuccess(false)
                      setActiveTab('unlock')
                    }}
                    className="mt-2 text-[10px] text-[#D4AF37] uppercase underline font-bold tracking-widest cursor-pointer"
                  >
                    RETURN TO KEY VERIFICATION
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#2D323E] pt-4 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest">
            <span>SYSTEM: KULT ORIGIN OS v2.06</span>
            <div className="flex space-x-1.5">
              {BACKGROUND_SLIDES.map((slide, i) => (
                <span
                  key={slide}
                  className={`h-1.5 rounded-full transition-all ${
                    i === bgIndex ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}