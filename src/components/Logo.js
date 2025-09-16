"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Logo({ isScrolled, onClick }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const logoSize = isScrolled ? (isMobile ? 60 : 100) : isMobile ? 80 : 150;

  return (
    <div
      className={`flex-1 flex justify-center md:justify-center ${
        isScrolled && isMobile ? "mt-0" : "mt-8"
      } md:mt-0`}
    >
      <Link
        onClick={onClick}
        href="/"
        className="flex flex-col items-center md:items-start"
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={logoSize}
          height={logoSize}
          className="transition-all duration-300 md:translate-y-0 translate-y-0.5"
        />
      </Link>
    </div>
  );
}
