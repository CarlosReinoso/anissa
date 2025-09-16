"use client";
import { useState, useEffect } from "react";
import { Figtree } from "next/font/google";
import Logo from "@/components/Logo";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import { NAV_ITEMS } from "@/constants";

const figtree = Figtree({ subsets: ["latin"] });

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${
        figtree.className
      } transition-colors duration-300 ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
      style={{ pointerEvents: "auto" }}
    >
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 py-4 ${
          isScrolled ? "md:py-10" : "md:py-16"
        } transition-colors duration-300 ${
          isScrolled ? "text-black" : "text-white"
        }`}
      >
        {/* Left: Social Media Icons */}
        <div className="flex-1 flex items-center">
          <SocialMediaIcons isScrolled={isScrolled} />
        </div>
        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
          <Logo isScrolled={isScrolled} />
        </div>
        {/* Right: Hamburger (mobile) or menu (desktop) */}
        <div className="flex-1 flex justify-end items-center pr-4">
          {/* Desktop menu */}
          <div
            className={`hidden lg:flex gap-4 xl:gap-6 text-base font-medium font-figtree transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative group hover:text-primary text-xs md:text-sm lg:text-sm xl:text-base whitespace-nowrap ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden ml-4 focus:outline-none"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke={isScrolled ? "black" : "white"}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-end">
          <div className="w-full bg-primary h-full flex flex-col p-8 relative animate-slide-in-right">
            <button
              className="absolute top-4 right-4 text-black text-3xl focus:outline-none"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div className="flex-1 flex flex-col justify-center items-center gap-8">
              <div className="flex flex-col items-center md:items-start mb-8">
                <Logo onClick={() => setOpen(false)} />
              </div>

              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-xl font-medium hover:text-secondary transition font-figtree ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
