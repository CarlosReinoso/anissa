"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import { PlusIcon, ChartBarIcon, PhotoIcon } from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalArtwork: 0,
    graphicsCount: 0,
    tattoosCount: 0,
    recentArtwork: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all artwork for stats
      const response = await fetch("/api/artworks");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch artwork");
      }

      const allArtwork = result.data;
      const graphicsCount = allArtwork.filter(
        (item) => item.section === "graphics"
      ).length;
      const tattoosCount = allArtwork.filter(
        (item) => item.section === "tattoos"
      ).length;
      const recentArtwork = allArtwork
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6);

      setStats({
        totalArtwork: allArtwork.length,
        graphicsCount,
        tattoosCount,
        recentArtwork,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center py-20">
            Error: {error}
            <Button onClick={fetchDashboardStats} className="ml-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-400 mt-2">
              Manage your artwork across Graphics and Tattoos sections
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/artwork/new")}
            className="bg-secondary hover:bg-secondary/80"
            showArrow={false}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Artwork
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-secondary mr-4" />
              <div>
                <p className="text-gray-400 text-sm">Total Artwork</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalArtwork}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <PhotoIcon className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <p className="text-gray-400 text-sm">Graphics</p>
                <p className="text-2xl font-bold text-white">
                  {stats.graphicsCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <PhotoIcon className="w-8 h-8 text-purple-500 mr-4" />
              <div>
                <p className="text-gray-400 text-sm">Tattoos</p>
                <p className="text-2xl font-bold text-white">
                  {stats.tattoosCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Graphics Management</h2>
            <p className="text-gray-400 mb-4">
              Organize your graphics with categories like Abstract, Portraits,
              Landscapes, Sketches, and Line Drawings.
            </p>
            <Button
              onClick={() => router.push("/dashboard/graphics")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Manage Graphics
            </Button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tattoos Management</h2>
            <p className="text-gray-400 mb-4">
              Organize your tattoo designs with categories like Tattoos and
              Flashcards.
            </p>
            <Button
              onClick={() => router.push("/dashboard/tattoos")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Manage Tattoos
            </Button>
          </div>
        </div>

        {/* Recent Artwork */}
        {stats.recentArtwork.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Artwork</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentArtwork.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/artwork/${item.id}`)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.storage_path}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.section === "graphics"
                            ? "bg-blue-600 text-white"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        {item.section}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push("/dashboard/artwork")}
                className="bg-gray-700 hover:bg-gray-600"
              >
                View All Artwork
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
