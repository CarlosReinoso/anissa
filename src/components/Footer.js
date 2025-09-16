"use client";

import SocialMediaIcons from "@/components/SocialMediaIcons";
import { NAV_ITEMS } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SocialMediaIcons isScrolled={true} />
          <nav className="flex gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-gray-700 transition-colors duration-200 text-xs md:text-sm text-gray-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm text-center md:text-right text-gray-600">
            Website by{" "}
            <a href="https://carlosreinoso.co.uk/web-dev">
              Carlos Reinoso
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-bottom-left" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
