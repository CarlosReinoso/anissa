"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { supabase } from "@/config/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardRootLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          router.push("/auth/login");
          return;
        }

        setUserData({ user });
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LoadingSpinner className="w-16 h-16" />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="bg-black fixed inset-0 text-white">
      <style jsx global>{`
        nav {
          display: none !important;
        }
        footer {
          display: none !important;
        }
        .dashboard-content {
          --text-color: white;
        }
        .dashboard-content > * {
          color: white !important;
        }
        .bg-white {
          color: black !important;
        }
        .bg-white * {
          color: black !important;
        }
      `}</style>
      <div className="flex h-full dashboard-content">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 pt-16 pb-8">{children}</div>
          <div className="text-center py-4"></div>
        </div>
      </div>
    </div>
  );
}
