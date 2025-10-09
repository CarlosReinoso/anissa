"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryManager from "@/components/dashboard/CategoryManager";
import CategoryTabs from "@/components/dashboard/CategoryTabs";
import Button from "@/components/Button";
import { PlusIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export default function GraphicsDashboardPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subcategories?section=graphics");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch subcategories");
      }

      // The API now returns full subcategory objects with id, name, and sort_order
      setSubcategories(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArtwork = () => {
    router.push("/dashboard/artwork/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading graphics...</p>
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
            <Button onClick={fetchSubcategories} className="ml-4">
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
            <h1 className="text-3xl font-bold">Graphics Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Manage your graphics artwork with categories and subcategories
            </p>
          </div>
          <div className="flex gap-4">
        
            <Button
              onClick={handleAddArtwork}
              className="bg-secondary hover:bg-secondary/80"
              showArrow={false}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Artwork
            </Button>
          </div>
        </div>

        {/* Category Manager - Always Visible */}
        <div className="mb-8">
          <CategoryManager
            section="graphics"
            onCategoryChange={fetchSubcategories}
          />
        </div>

        {/* Subcategory Tabs and Artwork */}
        {subcategories.length > 0 ? (
          <CategoryTabs
            section="graphics"
            subcategories={subcategories}
            onSubcategoryChange={(subcategory) => {
              // Handle subcategory change if needed
            }}
            onAddArtwork={handleAddArtwork}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">
              No Subcategories Found
            </h2>
            <p className="text-gray-400 mb-8">
              Start by creating your first subcategory to organize your graphics
              artwork (e.g., abstract, portrait, landscape).
            </p>
            <Button
              onClick={handleAddArtwork}
              className="bg-secondary hover:bg-secondary/80"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Artwork
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
