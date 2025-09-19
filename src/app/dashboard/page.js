"use client";

import { useState } from "react";
import { useArtwork } from "@/app/hooks/useArtwork";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const { artwork, loading, error, deleteArtwork } = useArtwork();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter artwork based on search query
  const filteredArtwork = artwork.filter((item) => {
    if (!searchQuery) return true;

    const lowerQuery = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  });

  const handleArtworkDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      await deleteArtwork(id);
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("Error deleting artwork. Please try again.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center py-20">
            Error loading artwork. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Artwork Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Artwork Gallery</h1>
            <Button
              onClick={() => router.push("/dashboard/artwork/new")}
              className="bg-secondary hover:bg-secondary/80"
              showArrow={false}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Artwork
            </Button>
          </div>

          <div className="mb-6">
            <div className="space-y-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-white"
              >
                Search Artwork
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, or category..."
                className="w-full px-3 py-2 bg-black border border-secondary rounded-md text-white focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {filteredArtwork.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {searchQuery
                  ? "No artwork found matching your search"
                  : "No artwork found"}
              </p>
              <Button
                onClick={() => router.push("/dashboard/artwork/new")}
                className="bg-secondary hover:bg-secondary/80"
              >
                Create Your First Artwork
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtwork.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.category === "graphics"
                            ? "bg-blue-600 text-white"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/artwork/${item.id}`)
                        }
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleArtworkDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
