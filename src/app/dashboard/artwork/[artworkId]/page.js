"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generateUniqueSlug } from "@/utils/slug";
import { compressImageIfNeeded } from "@/utils/imageCompression";

export default function EditArtwork({ params }) {
  const unwrappedParams = use(params);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchArtwork();
  }, [unwrappedParams.artworkId]);

  // Fetch menu items when section changes
  useEffect(() => {
    if (isEditing && selectedSection) {
      fetchMenuItems(selectedSection);
    }
  }, [isEditing, selectedSection]);

  // Fetch subcategories when menu item changes
  useEffect(() => {
    if (isEditing && editedArtwork?.menu_item_id) {
      fetchSubcategories(editedArtwork.menu_item_id);
    }
  }, [isEditing, editedArtwork?.menu_item_id]);

  const fetchArtwork = async () => {
    try {
      // Fetch artwork with related subcategory and menu item data
      const { data, error } = await supabase
        .from("artwork_images")
        .select(
          `
          *,
          subcategory:subcategories!artwork_images_subcategory_id_fkey (
            id,
            name,
            menu_item_id,
            menu_item:menu_items!subcategories_menu_item_id_fkey (
              id,
              name,
              section
            )
          )
        `
        )
        .eq("id", unwrappedParams.artworkId)
        .single();

      if (error) throw error;

      setArtwork(data);
      setEditedArtwork({
        ...data,
        description: data.description || "",
        menu_item_id: data.subcategory?.menu_item_id || "",
      });
      setSelectedSection(
        data.subcategory?.menu_item?.section || data.section || "graphics"
      );
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (section) => {
    try {
      setLoadingMenuItems(true);
      const response = await fetch(`/api/menu-items?section=${section}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch menu items");
      }

      setMenuItems(result.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(err.message);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const fetchSubcategories = async (menuItemId) => {
    try {
      setLoadingSubcategories(true);
      const response = await fetch(
        `/api/subcategories?menu_item_id=${menuItemId}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch subcategories");
      }

      setSubcategories(result.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError(err.message);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Check if subcategory is selected
      if (!editedArtwork.subcategory_id) {
        throw new Error("Please select a subcategory");
      }

      // Check if title changed and generate new slug if needed
      let updateData = {
        title: editedArtwork.title,
        description: editedArtwork.description,
        subcategory_id: editedArtwork.subcategory_id,
      };

      // If title changed, generate new slug
      if (editedArtwork.title !== artwork.title) {
        const checkSlugExists = async (slug) => {
          const { data, error } = await supabase
            .from("artwork_images")
            .select("id")
            .eq("slug", slug)
            .neq("id", unwrappedParams.artworkId) // Exclude current artwork
            .single();

          return !!data;
        };

        const newSlug = await generateUniqueSlug(
          editedArtwork.title,
          checkSlugExists
        );
        updateData.slug = newSlug;
      }

      const { error } = await supabase
        .from("artwork_images")
        .update(updateData)
        .eq("id", unwrappedParams.artworkId);

      if (error) throw error;

      // Refresh artwork data to get updated relationships
      await fetchArtwork();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedArtwork({
      ...artwork,
      description: artwork.description || "",
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (event) => {
    try {
      setUploadingImage(true);
      const file = event.target.files[0];
      if (!file) return;

      // Compress image if needed
      const compressedFile = await compressImageIfNeeded(file);

      // Upload image to Supabase Storage
      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      // Update the artwork with new image
      const { error: updateError } = await supabase
        .from("artwork_images")
        .update({ storage_path: publicUrl })
        .eq("id", unwrappedParams.artworkId);

      if (updateError) throw updateError;

      // Refresh artwork data
      await fetchArtwork();
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Artwork not found</p>
        <Button
          onClick={() => router.push("/dashboard/artwork")}
          className="mt-4 bg-secondary hover:bg-secondary/80"
        >
          Back to Artwork
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          {isEditing ? "Edit Artwork" : artwork.title}
        </h1>
        {!isEditing && (
          <Button
            onClick={handleEdit}
            className="bg-secondary hover:bg-secondary/80"
          >
            Edit
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={editedArtwork.title}
              onChange={(e) =>
                setEditedArtwork({ ...editedArtwork, title: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={editedArtwork.description}
              onChange={(e) =>
                setEditedArtwork({
                  ...editedArtwork,
                  description: e.target.value,
                })
              }
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Section *
            </label>
            <select
              required
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setEditedArtwork({
                  ...editedArtwork,
                  menu_item_id: "",
                  subcategory_id: "",
                });
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="graphics">Graphics</option>
              <option value="tattoos">Tattoos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Menu Item (Submenu) *
            </label>
            {loadingMenuItems ? (
              <div className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <span className="text-gray-400">Loading menu items...</span>
              </div>
            ) : (
              <select
                required
                value={editedArtwork.menu_item_id}
                onChange={(e) =>
                  setEditedArtwork({
                    ...editedArtwork,
                    menu_item_id: e.target.value,
                    subcategory_id: "",
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="">Select a menu item</option>
                {menuItems.map((menuItem) => (
                  <option key={menuItem.id} value={menuItem.id}>
                    {menuItem.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {editedArtwork.menu_item_id && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Subcategory *
              </label>
              {loadingSubcategories ? (
                <div className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span className="text-gray-400">
                    Loading subcategories...
                  </span>
                </div>
              ) : (
                <select
                  required
                  value={editedArtwork.subcategory_id}
                  onChange={(e) =>
                    setEditedArtwork({
                      ...editedArtwork,
                      subcategory_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name.charAt(0).toUpperCase() +
                        subcategory.name.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-secondary hover:bg-secondary/80"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-medium">Title:</span> {artwork.title}
                </p>
                <p>
                  <span className="font-medium">Section:</span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      artwork.subcategory?.menu_item?.section === "graphics"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {artwork.subcategory?.menu_item?.section || artwork.section}
                  </span>
                </p>
                {artwork.subcategory && (
                  <>
                    <p>
                      <span className="font-medium">Menu Item:</span>{" "}
                      {artwork.subcategory.menu_item?.name}
                    </p>
                    <p>
                      <span className="font-medium">Subcategory:</span>{" "}
                      {artwork.subcategory.name.charAt(0).toUpperCase() +
                        artwork.subcategory.name.slice(1)}
                    </p>
                  </>
                )}
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(artwork.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Description
              </h3>
              <p className="text-gray-300">
                {artwork.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Image</h3>
          {!isEditing && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 cursor-pointer transition-colors"
              >
                {uploadingImage ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Change Image"
                )}
              </label>
            </div>
          )}
        </div>

        <div className="aspect-square max-w-md">
          <img
            src={artwork.storage_path}
            alt={artwork.title}
            className="w-full h-full object-cover rounded-lg border border-gray-600"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={() => router.push("/dashboard/artwork")}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Back to Artwork
        </Button>
      </div>
    </div>
  );
}
