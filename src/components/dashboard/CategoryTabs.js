"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import DragDropArtwork from "./DragDropArtwork";
import { PlusIcon, Bars3Icon, TrashIcon } from "@heroicons/react/24/solid";

export default function CategoryTabs({
  section,
  subcategories = [],
  onSubcategoryChange,
  onAddArtwork,
}) {
  const [artworkBySubcategory, setArtworkBySubcategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedSubcategories, setSelectedSubcategories] = useState(new Set());
  const [selectedArtwork, setSelectedArtwork] = useState(new Set());
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [deletingArtwork, setDeletingArtwork] = useState(new Set()); // Track which artwork is being deleted
  const router = useRouter();

  useEffect(() => {
    if (subcategories.length > 0) {
      fetchAllArtwork();
    }
  }, [subcategories, section]);

  const fetchAllArtwork = async () => {
    if (subcategories.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const artworkBySubcategory = {};

      // Fetch artwork for each subcategory
      for (const subcategory of subcategories) {
        const subcategoryName = subcategory.name;
        const params = new URLSearchParams({
          section,
          sub_category: subcategoryName,
          limit: "100", // Increased limit to get all artwork
          offset: "0",
        });

        const response = await fetch(`/api/artworks?${params}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch artwork");
        }

        artworkBySubcategory[subcategoryName] = result.data || [];
      }

      setArtworkBySubcategory(artworkBySubcategory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArtworkClick = (artworkId) => {
    router.push(`/dashboard/artwork/${artworkId}`);
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      // Add to deleting set
      setDeletingArtwork((prev) => new Set([...prev, artworkId]));

      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete artwork");
      }

      // Refresh all artwork
      fetchAllArtwork();
    } catch (err) {
      console.error("Error deleting artwork:", err);
      alert("Error deleting artwork. Please try again.");
    } finally {
      // Remove from deleting set
      setDeletingArtwork((prev) => {
        const newSet = new Set(prev);
        newSet.delete(artworkId);
        return newSet;
      });
    }
  };

  const handleReorderArtwork = async (reorderedItems, subcategory) => {
    try {
      // Update local state immediately
      setArtworkBySubcategory((prev) => ({
        ...prev,
        [subcategory]: reorderedItems,
      }));

      // Update sort orders in database
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));

      const response = await fetch("/api/artworks/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sort order");
      }
    } catch (err) {
      console.error("Error reordering artwork:", err);
      alert("Error reordering artwork. Please try again.");
      // Refresh the artwork to get the correct order
      fetchAllArtwork();
    }
  };

  const handleReorderSubcategories = async (reorderedSubcategories) => {
    try {
      // Update sort orders in database
      const updates = reorderedSubcategories.map((subcategory, index) => ({
        id: subcategory.id,
        sort_order: index,
      }));

      const response = await fetch("/api/subcategories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subcategory order");
      }

      // Call the parent component's refresh function
      if (onSubcategoryChange) {
        onSubcategoryChange();
      }
    } catch (err) {
      console.error("Error reordering subcategories:", err);
      alert("Error reordering subcategories. Please try again.");
    }
  };

  const handleSelectSubcategory = (subcategoryId) => {
    const newSelected = new Set(selectedSubcategories);
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId);
    } else {
      newSelected.add(subcategoryId);
    }
    setSelectedSubcategories(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubcategories.size === subcategories.length) {
      setSelectedSubcategories(new Set());
    } else {
      setSelectedSubcategories(new Set(subcategories.map((sub) => sub.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubcategories.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedSubcategories.size} subcategory(ies)? This will also delete all artwork in these subcategories.`
      )
    ) {
      return;
    }

    try {
      // Delete each selected subcategory
      for (const subcategoryId of selectedSubcategories) {
        const response = await fetch(`/api/subcategories/${subcategoryId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete subcategory");
        }
      }

      // Clear selection and refresh
      setSelectedSubcategories(new Set());
      setShowDeleteMode(false);

      // Call the parent component's refresh function
      if (onSubcategoryChange) {
        onSubcategoryChange();
      }
    } catch (err) {
      console.error("Error deleting subcategories:", err);
      alert("Error deleting subcategories. Please try again.");
    }
  };

  const handleSelectArtwork = (artworkId) => {
    const newSelected = new Set(selectedArtwork);
    if (newSelected.has(artworkId)) {
      newSelected.delete(artworkId);
    } else {
      newSelected.add(artworkId);
    }
    setSelectedArtwork(newSelected);
  };

  const handleSelectAllArtwork = () => {
    // Get all artwork IDs from all subcategories
    const allArtworkIds = Object.values(artworkBySubcategory)
      .flat()
      .map((artwork) => artwork.id);

    if (selectedArtwork.size === allArtworkIds.length) {
      setSelectedArtwork(new Set());
    } else {
      setSelectedArtwork(new Set(allArtworkIds));
    }
  };

  const handleBulkDeleteArtwork = async () => {
    if (selectedArtwork.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedArtwork.size} artwork item(s)?`
      )
    ) {
      return;
    }

    try {
      // Add all selected artwork to deleting set
      setDeletingArtwork((prev) => new Set([...prev, ...selectedArtwork]));

      // Delete each selected artwork
      for (const artworkId of selectedArtwork) {
        const response = await fetch(`/api/artworks/${artworkId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete artwork");
        }
      }

      // Clear selection and refresh
      setSelectedArtwork(new Set());
      fetchAllArtwork();
    } catch (err) {
      console.error("Error deleting artwork:", err);
      alert("Error deleting artwork. Please try again.");
    } finally {
      // Clear deleting set
      setDeletingArtwork(new Set());
    }
  };

  if (subcategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-4">
          No subcategories found for {section}
        </p>
        <Button
          onClick={onAddArtwork}
          className="bg-secondary hover:bg-secondary/80"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Artwork
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white capitalize">
          All {section} Artwork
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className={
              viewMode === "grid"
                ? "bg-secondary hover:bg-secondary/80"
                : "bg-gray-700 hover:bg-gray-600"
            }
            showArrow={false}
          >
            <Bars3Icon className="w-5 h-5 mr-2" />
            {viewMode === "grid" ? "Grid View" : "List View"}
          </Button>
          {viewMode === "list" && selectedArtwork.size > 0 && (
            <Button
              onClick={handleBulkDeleteArtwork}
              className="bg-red-600 hover:bg-red-700"
              showArrow={false}
              disabled={deletingArtwork.size > 0}
            >
              {deletingArtwork.size > 0 ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                <>
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Delete All ({selectedArtwork.size})
                </>
              )}
            </Button>
          )}
          {!showDeleteMode ? (
            <Button
              onClick={() => setShowDeleteMode(true)}
              className="bg-red-600 hover:bg-red-700"
              showArrow={false}
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Delete
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSelectAll}
                className="bg-gray-600 hover:bg-gray-500"
                showArrow={false}
              >
                {selectedSubcategories.size === subcategories.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Button
                onClick={handleBulkDelete}
                disabled={selectedSubcategories.size === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500"
                showArrow={false}
              >
                Delete Selected ({selectedSubcategories.size})
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteMode(false);
                  setSelectedSubcategories(new Set());
                }}
                className="bg-gray-700 hover:bg-gray-600"
                showArrow={false}
              >
                Cancel
              </Button>
            </div>
          )}
          <Button
            onClick={onAddArtwork}
            className="bg-secondary hover:bg-secondary/80"
            showArrow={false}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Artwork
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-700 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={fetchAllArtwork}>Try Again</Button>
        </div>
      )}

      {/* Artwork by Subcategory */}
      {!loading && !error && (
        <div className="space-y-12">
          {viewMode === "list" ? (
            // List view - Table format with all artwork
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedArtwork.size > 0 &&
                            selectedArtwork.size ===
                              Object.values(artworkBySubcategory).flat().length
                          }
                          onChange={handleSelectAllArtwork}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-white font-semibold">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-white font-semibold">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-white font-semibold">
                        Subcategory
                      </th>
                      <th className="px-4 py-3 text-left text-white font-semibold">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-white font-semibold">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(artworkBySubcategory).map(
                      ([subcategoryName, artwork]) =>
                        artwork.map((item) => {
                          const isSelected = selectedArtwork.has(item.id);
                          return (
                            <tr
                              key={item.id}
                              className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                                isSelected ? "bg-red-900/20" : ""
                              }`}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectArtwork(item.id)}
                                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <img
                                  src={item.storage_path}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover rounded border border-gray-600"
                                />
                              </td>
                              <td className="px-4 py-3 text-white font-medium">
                                {item.title}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 text-xs rounded-full bg-secondary text-white capitalize">
                                  {item.sub_category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm max-w-xs truncate">
                                {item.description || "No description"}
                              </td>
                              <td className="px-4 py-3 text-gray-400 text-sm">
                                {new Date(item.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleArtworkClick(item.id)}
                                    className="bg-gray-600 hover:bg-gray-500 text-xs px-2 py-1"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteArtwork(item.id)}
                                    className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                                    disabled={deletingArtwork.has(item.id)}
                                  >
                                    {deletingArtwork.has(item.id) ? (
                                      <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                        Deleting...
                                      </div>
                                    ) : (
                                      "Delete"
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
              {Object.values(artworkBySubcategory).flat().length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No artwork found. Add some artwork to see it here.
                </div>
              )}
            </div>
          ) : (
            // Grid view
            subcategories.map((subcategory) => {
              const subcategoryName = subcategory.name;
              const artwork = artworkBySubcategory[subcategoryName] || [];

              return (
                <div key={subcategory.id} className="space-y-4">
                  {/* Subcategory Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white capitalize">
                      {subcategoryName} ({artwork.length} items)
                    </h3>
                  </div>

                  {/* Artwork Grid for this Subcategory */}
                  {artwork.length === 0 ? (
                    <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-gray-400 mb-4">
                        No artwork in {subcategoryName} yet
                      </p>
                      <Button
                        onClick={onAddArtwork}
                        className="bg-secondary hover:bg-secondary/80"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Artwork
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artwork.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                          <div className="aspect-square relative">
                            <img
                              src={item.storage_path}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-secondary text-white">
                                {item.sub_category}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-white mb-2">
                              {item.title}
                            </h4>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleArtworkClick(item.id)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteArtwork(item.id)}
                                className="bg-red-600 hover:bg-red-700 text-sm"
                                disabled={deletingArtwork.has(item.id)}
                              >
                                {deletingArtwork.has(item.id) ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Deleting...
                                  </div>
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
