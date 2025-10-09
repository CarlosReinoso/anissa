"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Logo({ isScrolled, onClick, inMobileMenu = false }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smaller logo when scrolled
  const logoSize = isScrolled ? (isMobile ? 40 : 60) : isMobile ? 80 : 100;

  return (
    <div
      className={`flex-1 flex justify-center md:justify-center ${
        isScrolled && isMobile ? "mt-2" : "mt-0"
      } md:mt-0`}
    >
      <Link
        onClick={onClick}
        href="/"
        className="flex flex-col items-center md:items-start"
      >
        <Image
          src="/logo.jpg"
          alt="logo"
          width={logoSize}
          height={logoSize}
          className={`transition-all duration-300 ${
            inMobileMenu ? "translate-y-0.5 invert brightness-[0.87]" : ""
          }`}
        />
      </Link>
    </div>
  );
}
