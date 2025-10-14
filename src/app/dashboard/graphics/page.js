"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import MenuManager from "@/components/dashboard/MenuManager";
import Button from "@/components/Button";
import {
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

export default function GraphicsDashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [artworksByMenu, setArtworksByMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMenuManager, setShowMenuManager] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [reorderingItems, setReorderingItems] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch menu structure
      const menuResponse = await fetch(
        "/api/menu-items?section=graphics&includeSubcategories=true"
      );
      const menuResult = await menuResponse.json();

      if (!menuResponse.ok) {
        throw new Error(menuResult.error || "Failed to fetch menu structure");
      }

      setMenuItems(menuResult.data);

      // Fetch all artworks for graphics section with their relationships
      const { data: artworks, error: artworkError } = await supabase
        .from("artwork_images")
        .select(
          `
          *,
          subcategory:subcategories!artwork_images_subcategory_id_fkey (
            id,
            name,
            menu_item_id,
            sort_order,
            menu_item:menu_items!subcategories_menu_item_id_fkey (
              id,
              name,
              section,
              sort_order
            )
          )
        `
        )
        .eq("section", "graphics")
        .order("sort_order", { ascending: true });

      if (artworkError) throw artworkError;

      // Group artworks by menu item and subcategory
      const grouped = {};
      artworks.forEach((artwork) => {
        const menuItemId = artwork.subcategory?.menu_item_id;
        const subcategoryId = artwork.subcategory_id;

        if (menuItemId && subcategoryId) {
          if (!grouped[menuItemId]) {
            grouped[menuItemId] = {};
          }
          if (!grouped[menuItemId][subcategoryId]) {
            grouped[menuItemId][subcategoryId] = [];
          }
          grouped[menuItemId][subcategoryId].push(artwork);
        }
      });

      setArtworksByMenu(grouped);

      // Auto-expand first menu item
      if (
        menuResult.data.length > 0 &&
        Object.keys(expandedMenus).length === 0
      ) {
        setExpandedMenus({ [menuResult.data[0].id]: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleAddArtwork = () => {
    router.push("/dashboard/artwork/new");
  };

  const handleEditArtwork = (artworkId) => {
    router.push(`/dashboard/artwork/${artworkId}`);
  };

  const handleDeleteArtwork = async (artworkId, artworkTitle) => {
    if (
      !confirm(
        `Are you sure you want to delete "${artworkTitle}"? This will also delete the image file from storage.`
      )
    ) {
      return;
    }

    try {
      // Use the API route which handles both database and storage deletion
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete artwork");
      }

      handleMenuChange();
    } catch (err) {
      alert(`Error deleting artwork: ${err.message}`);
    }
  };

  const handleReorderArtwork = async (artworkId, newIndex, subcategoryId) => {
    // Add to loading state
    setReorderingItems((prev) => new Set([...prev, artworkId]));

    try {
      // Get all artworks in the same subcategory, ordered by current sort_order
      const { data: artworks, error: fetchError } = await supabase
        .from("artwork_images")
        .select("*")
        .eq("subcategory_id", subcategoryId)
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;

      // Find the dragged artwork
      const draggedArtwork = artworks.find((art) => art.id === artworkId);
      if (!draggedArtwork) throw new Error("Artwork not found");

      // Remove the dragged artwork from the array
      const otherArtworks = artworks.filter((art) => art.id !== artworkId);

      // Insert the dragged artwork at the new position
      otherArtworks.splice(newIndex, 0, draggedArtwork);

      // Update sort_order for all artworks in the new sequence
      const updates = otherArtworks.map((artwork, index) => ({
        id: artwork.id,
        sort_order: index,
      }));

      // OPTIMISTIC UI UPDATE: Update local state immediately
      setArtworksByMenu((prev) => {
        const newState = { ...prev };
        const menuItemId = Object.keys(newState).find(
          (menuId) => newState[menuId][subcategoryId]
        );

        if (menuItemId && newState[menuItemId][subcategoryId]) {
          newState[menuItemId][subcategoryId] = otherArtworks;
        }

        return newState;
      });

      // Use the reorder API to update all items at once (in background)
      const response = await fetch("/api/artworks/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reorder artworks");
      }

      // Success - no need to refresh since we already updated optimistically
    } catch (err) {
      // Revert optimistic update on error
      handleMenuChange();
      alert(`Error reordering artwork: ${err.message}`);
    } finally {
      // Remove from loading state
      setReorderingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(artworkId);
        return newSet;
      });
    }
  };

  const toggleMenuExpansion = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading graphics dashboard...</p>
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
            <Button onClick={fetchMenuStructure} className="ml-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get total subcategory count across all menu items
  const totalSubcategories = menuItems.reduce(
    (sum, item) => sum + (item.subcategories?.length || 0),
    0
  );

  const totalArtworks = Object.values(artworksByMenu).reduce(
    (sum, menuArtworks) =>
      sum +
      Object.values(menuArtworks).reduce(
        (subSum, artworks) => subSum + artworks.length,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Graphics Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Manage your graphics artwork and menu structure
            </p>
            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              <span>{menuItems.length} menu items</span>
              <span>•</span>
              <span>{totalSubcategories} subcategories</span>
              <span>•</span>
              <span>{totalArtworks} artworks</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowMenuManager(!showMenuManager)}
              className="bg-gray-700 hover:bg-gray-600"
              showArrow={false}
            >
              {showMenuManager ? "Hide" : "Show"} Menu Manager
            </Button>
            <Button
              onClick={handleMenuChange}
              className="bg-gray-700 hover:bg-gray-600"
              showArrow={false}
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Refresh
            </Button>
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

        {/* Menu Manager - Collapsible */}
        {showMenuManager && (
          <div className="mb-8">
            <MenuManager section="graphics" onMenuChange={handleMenuChange} />
          </div>
        )}

        {/* Artworks by Menu Item */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading artworks...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No Menu Items Found</h2>
            <p className="text-gray-400 mb-8">
              Start by creating your first menu item to organize your graphics
              artwork (e.g., "Illustrations", "Sketches", "Line Art").
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {menuItems.map((menuItem) => {
              const menuArtworks = artworksByMenu[menuItem.id] || {};
              const artworkCount = Object.values(menuArtworks).reduce(
                (sum, artworks) => sum + artworks.length,
                0
              );

              return (
                <div
                  key={menuItem.id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  {/* Menu Item Header */}
                  <button
                    onClick={() => toggleMenuExpansion(menuItem.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedMenus[menuItem.id] ? (
                        <ChevronDownIcon className="w-5 h-5 text-secondary" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      )}
                      <h2 className="text-xl font-semibold">{menuItem.name}</h2>
                      <span className="text-sm text-gray-400">
                        ({artworkCount} artworks)
                      </span>
                    </div>
                  </button>

                  {/* Subcategories and Artworks */}
                  {expandedMenus[menuItem.id] && (
                    <div className="px-6 py-4 space-y-6">
                      {menuItem.subcategories?.map((subcategory) => {
                        const artworks = menuArtworks[subcategory.id] || [];

                        return (
                          <div key={subcategory.id}>
                            {/* Subcategory Header */}
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium text-secondary">
                                {subcategory.name.charAt(0).toUpperCase() +
                                  subcategory.name.slice(1)}{" "}
                                <span className="text-sm text-gray-400">
                                  ({artworks.length} artworks)
                                </span>
                              </h3>
                            </div>

                            {/* Artwork Grid */}
                            {artworks.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {artworks.map((artwork, index) => (
                                  <div
                                    key={artwork.id}
                                    draggable
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData(
                                        "artworkId",
                                        artwork.id
                                      );
                                      e.dataTransfer.setData(
                                        "currentIndex",
                                        index.toString()
                                      );
                                      e.dataTransfer.setData(
                                        "subcategoryId",
                                        subcategory.id
                                      );
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const draggedId =
                                        e.dataTransfer.getData("artworkId");
                                      const draggedIndex = parseInt(
                                        e.dataTransfer.getData("currentIndex")
                                      );
                                      const draggedSubcategoryId =
                                        e.dataTransfer.getData("subcategoryId");

                                      if (
                                        draggedSubcategoryId ===
                                          subcategory.id &&
                                        draggedIndex !== index
                                      ) {
                                        // Reorder within same subcategory
                                        handleReorderArtwork(
                                          draggedId,
                                          index,
                                          subcategory.id
                                        );
                                      }
                                    }}
                                    className={`group relative bg-gray-700 rounded-lg overflow-hidden cursor-move hover:ring-2 hover:ring-secondary transition-all ${
                                      reorderingItems.has(artwork.id)
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                    }`}
                                  >
                                    {/* Image */}
                                    <div className="aspect-square relative bg-gray-800">
                                      {artwork.storage_path ? (
                                        <Image
                                          src={artwork.storage_path}
                                          alt={artwork.title || "Artwork"}
                                          fill
                                          className="object-cover"
                                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                          No Image
                                        </div>
                                      )}
                                      {/* Loading overlay for reordering */}
                                      {reorderingItems.has(artwork.id) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        </div>
                                      )}

                                      {/* Overlay on hover */}
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                          onClick={() =>
                                            handleEditArtwork(artwork.id)
                                          }
                                          className="p-2 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                                          title="Edit"
                                        >
                                          <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteArtwork(
                                              artwork.id,
                                              artwork.title
                                            )
                                          }
                                          className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                                          title="Delete"
                                        >
                                          <TrashIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    {/* Title */}
                                    <div className="p-2 bg-gray-900">
                                      <p className="text-xs text-white truncate">
                                        {artwork.title}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Order: {index + 1}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-400 bg-gray-900 rounded-lg">
                                <p>No artworks in this subcategory yet.</p>
                                <Button
                                  onClick={handleAddArtwork}
                                  className="mt-4 bg-secondary hover:bg-secondary/80"
                                  showArrow={false}
                                >
                                  <PlusIcon className="w-4 h-4 mr-2" />
                                  Add Artwork
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {(!menuItem.subcategories ||
                        menuItem.subcategories.length === 0) && (
                        <div className="text-center py-8 text-gray-400">
                          <p>
                            No subcategories in this menu item. Create
                            subcategories in the Menu Manager above.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
