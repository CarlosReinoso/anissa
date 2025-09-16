"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import { useEffect, useState } from "react";
import Button from "../Button";

const NavLink = ({ href, icon, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 rounded-lg ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
};

const Icon = ({ children }) => (
  <svg
    className="w-5 h-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const HamburgerIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const Sidebar = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: "Classes",
      icon: (
        <Icon>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </Icon>
      ),
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white hover:bg-secondary/80"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <HamburgerIcon />
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg- fixed lg:static flex flex-col h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 p-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>

          <div className="space-y-2">
            {navLinks.map(({ href, label, icon }) => (
              <NavLink key={href} href={href} icon={icon}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <Button
            className="flex items-center justify-start text-white hover:bg-gray-800"
            onClick={handleLogout}
          >
            <Icon>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </Icon>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
