"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Figtree } from "next/font/google";
import { NAV_ITEMS, NAV_FONT_SIZES } from "@/constants";
import Logo from "./Logo";
import SocialMediaIcons from "./SocialMediaIcons";

const figtree = Figtree({ subsets: ["latin"] });

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuItems, setMenuItems] = useState({ graphics: [], tattoos: [] });
  const [activeHash, setActiveHash] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const activePath = usePathname();

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const [graphicsRes, tattoosRes] = await Promise.all([
          fetch("/api/menu-items?section=graphics"),
          fetch("/api/menu-items?section=tattoos"),
        ]);

        const graphicsData = await graphicsRes.json();
        const tattoosData = await tattoosRes.json();

        setMenuItems({
          graphics: graphicsData.data || [],
          tattoos: tattoosData.data || [],
        });
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle hash changes
  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash.slice(1));
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    // Enhanced scroll listener with progress tracking for smoother transitions
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const threshold = 50;

          // Calculate scroll progress (0 to 1) for smoother transitions
          const progress = Math.min(scrollY / threshold, 1);
          setScrollProgress(progress);

          // Set scrolled state with some hysteresis to prevent flickering
          setIsScrolled(scrollY > 30);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mobile/desktop viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine if we should show submenu
  const showSubmenu =
    activePath.startsWith("/graphics") || activePath.startsWith("/tattoos");
  const submenuItems = activePath.startsWith("/graphics")
    ? menuItems.graphics
    : activePath.startsWith("/tattoos")
    ? menuItems.tattoos
    : null;

  const handleSubmenuClick = (slug) => {
    window.location.hash = slug;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${figtree.className} transition-all duration-700 ease-out`}
      style={{
        pointerEvents: "auto",
        transform: `translateY(${scrollProgress * -10}px)`, // Subtle upward movement
        backgroundColor: "white", // Solid white background
      }}
    >
      {/* Top dark bar */}
      <div className="bg-gray-800 h-1 transition-all duration-700 ease-out"></div>

      {!isScrolled ? (
        // Original layout when at top
        <>
          {/* Main navigation - white background */}
          <nav className="bg-white transition-all duration-700 ease-out">
            <div
              className="max-w-7xl mx-auto flex items-center justify-between px-20 transition-all duration-700 ease-out"
              style={{
                paddingTop: `${24 - scrollProgress * 8}px`, // Reduce padding smoothly
                paddingBottom: `${24 - scrollProgress * 8}px`,
              }}
            >
              {/* Main Navigation Menu */}
              <div
                className={`hidden lg:flex justify-between w-full font-bold transition-all duration-700 ease-out`}
              >
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative text-black uppercase tracking-wide hover:text-gray-600 hover:border-b-4 hover:border-black transition-all duration-700 ease-out ${
                      NAV_FONT_SIZES.main
                    } ${
                      activePath === item.href ||
                      activePath.startsWith(item.href)
                        ? "border-b-4 border-black pb-1" // Thicker underline with border
                        : ""
                    }`}
                    style={{
                      transform: `scale(${1 - scrollProgress * 0.05})`, // Slight scale down
                      opacity: 1 - scrollProgress * 0.2, // Fade out slightly
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Logo section */}
          <div
            className="bg-white flex justify-center transition-all duration-700 ease-out"
            style={{
              paddingTop: `${0 - scrollProgress * 24}px`, // Reduce padding smoothly
              paddingBottom: `${16 - scrollProgress * 24}px`,
              transform: `translateY(${scrollProgress * 20}px)`, // Move up smoothly
              opacity: 1 - scrollProgress * 0.3, // Fade out more
            }}
          >
            <Logo isScrolled={isScrolled} onClick={() => setOpen(false)} />
          </div>
        </>
      ) : (
        // Compact layout when scrolled
        <nav className="bg-white transition-all duration-700 ease-out">
          <div
            className="max-w-7xl mx-auto relative flex items-center justify-between transition-all duration-700 ease-out"
            style={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingTop: `${20 + scrollProgress * (isMobile ? 8 : 4)}px`, // More padding on mobile when scrolled
              paddingBottom: `${20 + scrollProgress * (isMobile ? 8 : 4)}px`,
            }}
          >
            {/* Left menu items */}
            <div className="hidden lg:flex gap-8 font-bold transition-all duration-700 ease-out">
              {NAV_ITEMS.slice(0, Math.ceil(NAV_ITEMS.length / 2)).map(
                (item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative text-black uppercase tracking-wide hover:text-gray-600 hover:border-b-4 hover:border-black transition-all duration-700 ease-out ${
                      NAV_FONT_SIZES.main
                    } ${
                      activePath === item.href ||
                      activePath.startsWith(item.href)
                        ? "border-b-4 border-black pb-1" // Thicker underline with border
                        : ""
                    }`}
                    style={{
                      transform: `translateY(${(1 - scrollProgress) * 20}px)`, // Slide in from above
                      opacity: scrollProgress, // Fade in
                    }}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>

            {/* Center Logo - absolutely positioned for perfect centering */}
            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{
                transform: `translate(-50%, -50%) scale(${
                  0.5 + scrollProgress * 0.5
                })`, // Scale up smoothly
                opacity: scrollProgress, // Fade in
              }}
            >
              <Logo isScrolled={isScrolled} onClick={() => setOpen(false)} />
            </div>

            {/* Right menu items */}
            <div className="hidden lg:flex gap-8 font-bold transition-all duration-700 ease-out">
              {NAV_ITEMS.slice(Math.ceil(NAV_ITEMS.length / 2)).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative text-black uppercase tracking-wide hover:text-gray-600 hover:border-b-4 hover:border-black transition-all duration-700 ease-out ${
                    NAV_FONT_SIZES.main
                  } ${
                    activePath === item.href || activePath.startsWith(item.href)
                      ? "border-b-4 border-black pb-1" // Thicker underline with border
                      : ""
                  }`}
                  style={{
                    transform: `translateY(${(1 - scrollProgress) * 20}px)`, // Slide in from above
                    opacity: scrollProgress, // Fade in
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Submenu - black background with white text */}
      {showSubmenu && submenuItems && submenuItems.length > 0 && (
        <div className="hidden lg:block bg-black transition-all duration-700 ease-out">
          <div className="max-w-7xl mx-auto flex justify-between px-6 py-4">
            <div className="flex justify-between w-full">
              {submenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSubmenuClick(item.slug)}
                  className={`relative text-white uppercase tracking-wide transition-all duration-300 ease-out px-4 py-2 hover:border-b-4 hover:border-white ${
                    NAV_FONT_SIZES.submenu
                  } ${
                    activeHash === item.slug ? "border-b-4 border-white" : ""
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Hamburger - positioned absolutely */}
      <button
        className="lg:hidden fixed top-4 right-4 z-[60] focus:outline-none bg-white p-2 rounded transition-all duration-500 ease-out"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <svg
          className="w-6 h-6 text-black"
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

      {/* Mobile Modal */}
      {open && (
        <div className="fixed inset-0 w-screen h-screen bg-black z-[70] overflow-hidden">
          <div className="w-full h-full bg-black flex flex-col p-8 relative overflow-y-auto">
            <button
              className="absolute top-6 right-6 text-white text-4xl focus:outline-none transition-all duration-300 ease-out z-[80] hover:text-gray-300"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div className="flex-1 flex flex-col justify-center items-center gap-8 py-8">
              <div className="flex flex-col items-center mb-4">
                <Logo
                  isScrolled={isScrolled}
                  onClick={() => setOpen(false)}
                  inMobileMenu={true}
                />
                <div className="mt-6">
                  <SocialMediaIcons
                    isScrolled={isScrolled}
                    inMobileMenu={true}
                  />
                </div>
              </div>

              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`${NAV_FONT_SIZES.mobile} font-bold text-white uppercase tracking-wide hover:text-gray-300 transition-all duration-300 ease-out`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile submenu */}
              {showSubmenu && submenuItems && submenuItems.length > 0 && (
                <div className="mt-6 flex flex-col gap-3 items-center">
                  {submenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleSubmenuClick(item.slug);
                        setOpen(false);
                      }}
                      className={`${
                        NAV_FONT_SIZES.mobileSubmenu
                      } text-white uppercase tracking-wide hover:text-gray-300 transition-all duration-300 ease-out ${
                        activeHash === item.slug
                          ? "border-b-2 border-white pb-1"
                          : ""
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
