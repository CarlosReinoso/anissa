"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileSubmenuNavigation({ menuItems, activeMenuItem }) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Get the section from pathname (either 'graphics' or 'tattoos')
  const section = pathname.split("/")[1];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || !activeMenuItem || !menuItems || menuItems.length === 0) {
    return null;
  }

  // Find current menu item index
  const currentIndex = menuItems.findIndex(
    (item) => item.id === activeMenuItem.id
  );

  // Get previous and next menu items
  const prevItem = currentIndex > 0 ? menuItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex < menuItems.length - 1 ? menuItems[currentIndex + 1] : null;

  const handleNavigation = (item) => {
    if (item) {
      window.location.hash = item.slug;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-40 lg:hidden border-t-4 border-white">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Previous Button */}
        <button
          onClick={() => handleNavigation(prevItem)}
          disabled={!prevItem}
          className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 ease-out border-2 ${
            prevItem
              ? "bg-white text-black border-white hover:bg-gray-200 font-bold"
              : "bg-transparent text-gray-600 border-gray-700 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
          <span className="text-xs uppercase tracking-wide font-bold truncate max-w-[80px]">
            {prevItem ? prevItem.name : "None"}
          </span>
        </button>

        {/* Current Item Display */}
        <div className="text-center flex-1 mx-3">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
            Current
          </div>
          <div className="text-sm font-bold uppercase tracking-wide truncate">
            {activeMenuItem.name}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => handleNavigation(nextItem)}
          disabled={!nextItem}
          className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 ease-out border-2 ${
            nextItem
              ? "bg-white text-black border-white hover:bg-gray-200 font-bold"
              : "bg-transparent text-gray-600 border-gray-700 cursor-not-allowed"
          }`}
        >
          <span className="text-xs uppercase tracking-wide font-bold truncate max-w-[80px]">
            {nextItem ? nextItem.name : "None"}
          </span>
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
