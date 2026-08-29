"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const navItems = [
  { label: "BATCH 001", href: "/batch-001" },
  { label: "SHOP ALL", href: "/shop" },
  { label: "FOUNDER 50", href: "/founder-50" },
  { label: "FIELD REWARDS", href: "/rewards" },
  { label: "BAG", href: "/checkout" },
  { label: "CART", href: "/Cart" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Prevent Body Scroll when Overlay Menu is Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC Key handling to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll event listener for transparent to dark background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 sm:px-10 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0B0D]/80 backdrop-blur-md border-b border-[#1E2026]/60 shadow-xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      {/* Left: Prominent & Scaled Monogram / Logo */}
      <div className="z-50">
        <Link
          href="/"
          className="inline-flex items-center relative p-1"
          aria-label="KULT ORIGIN Home"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/logo.png"
            alt="KULT ORIGIN Logo"
            className={`w-auto object-contain transition-all duration-300 hover:scale-105 brightness-200 contrast-125 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${
              isScrolled ? "h-12 sm:h-14" : "h-14 sm:h-18 md:h-20"
            }`}
          />
        </Link>
      </div>

      {/* Right: Universal Hamburger Button */}
      <div className="z-50 flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#F3EFE0] hover:text-white focus:outline-none transition-transform active:scale-90 cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <svg
            className="h-8 w-8 sm:h-9 sm:w-9 fill-current drop-shadow-lg"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 6h16a1 1 0 010 2H4a1 1 0 110-2zm0 5h16a1 1 0 010 2H4a1 1 0 010-2zm0 5h16a1 1 0 010 2H4a1 1 0 010-2z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Universal Fullscreen Menu Overlay */}
      <div
        className={`fixed inset-0 w-screen h-screen z-40 bg-[#0A0B0D]/95 backdrop-blur-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${
          isOpen
            ? "opacity-100 pointer-events-auto visible scale-100"
            : "opacity-0 pointer-events-none invisible scale-95"
        }`}
      >
        <nav className="flex flex-col items-center space-y-6 md:space-y-8 text-center px-4">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl sm:text-3xl md:text-4xl font-mono font-black uppercase tracking-[0.25em] text-[#F3EFE0] hover:text-[#D4AF37] transition-all duration-300 hover:scale-105"
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}