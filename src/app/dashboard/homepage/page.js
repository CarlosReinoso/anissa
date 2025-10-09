"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  PlusIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

export default function HomepageCarouselManager() {
  const [graphicsCarousel, setGraphicsCarousel] = useState([]);
  const [tattoosCarousel, setTattoosCarousel] = useState([]);
  const [allArtwork, setAllArtwork] = useState({ graphics: [], tattoos: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("graphics");
  const [showArtworkSelector, setShowArtworkSelector] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch carousel items
      const [graphicsRes, tattoosRes, artworkRes] = await Promise.all([
        fetch("/api/homepage-carousel?section=graphics"),
        fetch("/api/homepage-carousel?section=tattoos"),
        fetch("/api/artworks"),
      ]);

      const graphicsData = await graphicsRes.json();
      const tattoosData = await tattoosRes.json();
      const artworkData = await artworkRes.json();

      if (!graphicsRes.ok || !tattoosRes.ok || !artworkRes.ok) {
        throw new Error("Failed to fetch data");
      }

      setGraphicsCarousel(graphicsData.data || []);
      setTattoosCarousel(tattoosData.data || []);

      // Separate artwork by section
      const allArt = artworkData.data || [];
      setAllArtwork({
        graphics: allArt.filter((art) => art.section === "graphics"),
        tattoos: allArt.filter((art) => art.section === "tattoos"),
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCarousel = () => {
    return activeTab === "graphics" ? graphicsCarousel : tattoosCarousel;
  };

  const setCurrentCarousel = (items) => {
    if (activeTab === "graphics") {
      setGraphicsCarousel(items);
    } else {
      setTattoosCarousel(items);
    }
  };

  const getAvailableArtwork = () => {
    const currentCarousel = getCurrentCarousel();
    const carouselArtworkIds = currentCarousel.map((item) => item.artwork_id);
    return allArtwork[activeTab].filter(
      (art) => !carouselArtworkIds.includes(art.id)
    );
  };

  const addToCarousel = async (artwork) => {
    try {
      setSaving(true);
      const currentCarousel = getCurrentCarousel();
      const nextOrder = currentCarousel.length;

      const response = await fetch("/api/homepage-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: activeTab,
          artwork_id: artwork.id,
          display_order: nextOrder,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add to carousel");
      }

      // Refresh data
      await fetchData();
      setShowArtworkSelector(false);
    } catch (err) {
      console.error("Error adding to carousel:", err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeFromCarousel = async (carouselItemId) => {
    if (
      !confirm("Are you sure you want to remove this item from the carousel?")
    ) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/homepage-carousel/${carouselItemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to remove from carousel");
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error removing from carousel:", err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const moveItem = async (index, direction) => {
    const currentCarousel = getCurrentCarousel();
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= currentCarousel.length) return;

    const newCarousel = [...currentCarousel];
    [newCarousel[index], newCarousel[newIndex]] = [
      newCarousel[newIndex],
      newCarousel[index],
    ];

    // Update display_order for all items
    const updates = newCarousel.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }));

    try {
      setSaving(true);
      const response = await fetch("/api/homepage-carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to reorder carousel");
      }

      // Update local state
      setCurrentCarousel(newCarousel);
    } catch (err) {
      console.error("Error reordering carousel:", err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading homepage settings...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentCarousel = getCurrentCarousel();
  const availableArtwork = getAvailableArtwork();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Homepage Carousel Manager</h1>
          <p className="text-gray-400">
            Select and organize artwork to display in the homepage carousels
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
            {error}
            <button
              onClick={fetchData}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("graphics")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "graphics"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Graphics Carousel ({graphicsCarousel.length})
          </button>
          <button
            onClick={() => setActiveTab("tattoos")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "tattoos"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Tattoos Carousel ({tattoosCarousel.length})
          </button>
        </div>

        {/* Add Artwork Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowArtworkSelector(!showArtworkSelector)}
            className={`${
              activeTab === "graphics"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            showArrow={false}
            disabled={saving}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Artwork to Carousel
          </Button>
        </div>

        {/* Artwork Selector */}
        {showArtworkSelector && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Select {activeTab === "graphics" ? "Graphics" : "Tattoo"}{" "}
                Artwork
              </h3>
              <button
                onClick={() => setShowArtworkSelector(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {availableArtwork.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No available artwork. All {activeTab} artwork is already in the
                carousel or you need to add more artwork.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableArtwork.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => addToCarousel(artwork)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={artwork.storage_path}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center">
                        <PlusIcon className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {artwork.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Carousel */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Current {activeTab === "graphics" ? "Graphics" : "Tattoos"} Carousel
          </h3>

          {currentCarousel.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                No artwork in carousel yet. Add some artwork to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentCarousel.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded-lg p-4 flex items-center gap-4"
                >
                  {/* Preview Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.artwork.storage_path}
                      alt={item.artwork.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <h4 className="text-white font-semibold">
                      {item.artwork.title}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {item.artwork.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Position: {index + 1} of {currentCarousel.length}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0 || saving}
                      className="p-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 rounded transition-colors"
                      title="Move up"
                    >
                      <ArrowUpIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === currentCarousel.length - 1 || saving}
                      className="p-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 rounded transition-colors"
                      title="Move down"
                    >
                      <ArrowDownIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeFromCarousel(item.id)}
                      disabled={saving}
                      className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 rounded transition-colors"
                      title="Remove"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            className="bg-gray-700 hover:bg-gray-600"
            showArrow={false}
          >
            Back to Dashboard
          </Button>
          <p className="text-gray-400 text-sm">
            Changes are saved automatically
          </p>
        </div>
      </div>
    </div>
  );
}
