"use client";
import { useState, useEffect } from "react";
import { Figtree } from "next/font/google";
import { NAV_ITEMS, ARTIST_INFO } from "@/constants";
import Logo from "./Logo";
import SocialMediaIcons from "./SocialMediaIcons";

const figtree = Figtree({ subsets: ["latin"] });

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-black ${figtree.className}`}
      style={{ pointerEvents: "auto" }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Social Media Icons */}
        <div className="flex-1">
          <SocialMediaIcons isScrolled={false} />
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Logo onClick={() => setOpen(false)} />
        </div>

        {/* Right: Navigation Menu */}
        <div className="flex-1 flex justify-end">
          {/* Desktop menu */}
          <div className="hidden lg:flex gap-8 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-white uppercase tracking-wide hover:text-gray-300 transition-colors ${
                  activePath === item.href
                    ? "underline decoration-white underline-offset-4"
                    : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Hamburger for mobile */}
          <button
            className="lg:hidden focus:outline-none"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
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
        <div className="fixed inset-0 bg-black bg-opacity-90 z-40 flex justify-end">
          <div className="w-full bg-black h-full flex flex-col p-8 relative">
            <button
              className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div className="flex-1 flex flex-col justify-center items-center gap-8">
              <div className="flex flex-col items-center mb-8">
                <Logo onClick={() => setOpen(false)} />
                <div className="mt-4">
                  <SocialMediaIcons isScrolled={false} />
                </div>
              </div>

              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xl font-medium text-white uppercase tracking-wide hover:text-gray-300 transition-colors"
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
