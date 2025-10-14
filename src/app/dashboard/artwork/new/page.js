"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generateUniqueSlug } from "@/utils/slug";
import {
  compressImageIfNeeded,
  compressImagesIfNeeded,
} from "@/utils/imageCompression";

export default function NewArtwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    category: "graphics",
    menu_item_id: "",
    subcategory_id: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Fetch menu items when category changes
  useEffect(() => {
    if (newArtwork.category) {
      fetchMenuItems(newArtwork.category);
    }
  }, [newArtwork.category]);

  // Fetch subcategories when menu item changes
  useEffect(() => {
    if (newArtwork.menu_item_id) {
      fetchSubcategories(newArtwork.menu_item_id);
    } else {
      setSubcategories([]);
      setNewArtwork((prev) => ({ ...prev, subcategory_id: "" }));
    }
  }, [newArtwork.menu_item_id]);

  const fetchMenuItems = async (section) => {
    try {
      setLoadingMenuItems(true);
      const response = await fetch(`/api/menu-items?section=${section}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch menu items");
      }

      setMenuItems(result.data);
      // Reset menu item and subcategory selection when category changes
      setNewArtwork((prev) => ({
        ...prev,
        menu_item_id: "",
        subcategory_id: "",
      }));
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
      // Reset subcategory selection when menu item changes
      setNewArtwork((prev) => ({ ...prev, subcategory_id: "" }));
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError(err.message);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Generate title from filename
  const generateTitleFromFilename = (filename) => {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    // Replace underscores and hyphens with spaces
    const title = nameWithoutExt.replace(/[_-]/g, " ");
    // Capitalize first letter of each word
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleImageUpload = async (event) => {
    try {
      setUploadingImage(true);
      const files = Array.from(event.target.files);
      if (!files.length) return;

      if (bulkMode) {
        // Handle bulk upload
        const uploadedImages = [];

        // Compress images if needed
        const compressedFiles = await compressImagesIfNeeded(files);

        for (let i = 0; i < compressedFiles.length; i++) {
          const file = compressedFiles[i];
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { current: i + 1, total: compressedFiles.length },
          }));

          // Upload image to Supabase Storage
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get the public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(fileName);

          uploadedImages.push({
            file: file,
            url: publicUrl,
            title: generateTitleFromFilename(file.name),
          });
        }

        setSelectedImages(uploadedImages);
        setUploadProgress({});
      } else {
        // Handle single upload
        const file = files[0];

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

        setSelectedImage(publicUrl);

        // Auto-fill title from filename
        if (!newArtwork.title) {
          setNewArtwork((prev) => ({
            ...prev,
            title: generateTitleFromFilename(compressedFile.name),
          }));
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (bulkMode) {
        if (selectedImages.length === 0) {
          throw new Error("Please upload images");
        }
      } else {
        if (!selectedImage) {
          throw new Error("Please upload an image");
        }
      }

      if (!newArtwork.subcategory_id) {
        throw new Error("Please select a subcategory");
      }

      // Function to check if slug exists
      const checkSlugExists = async (slug) => {
        const { data, error } = await supabase
          .from("artwork_images")
          .select("id")
          .eq("slug", slug)
          .single();

        // If we get data, the slug exists
        return !!data;
      };

      if (bulkMode) {
        // Handle bulk submission
        const artworkEntries = [];

        // Get the current highest sort_order for this subcategory
        let currentSortOrder = -1;
        if (newArtwork.subcategory_id) {
          const { data: existingArtworks, error: countError } = await supabase
            .from("artwork_images")
            .select("sort_order")
            .eq("subcategory_id", newArtwork.subcategory_id)
            .order("sort_order", { ascending: false })
            .limit(1);

          if (!countError && existingArtworks && existingArtworks.length > 0) {
            currentSortOrder = existingArtworks[0].sort_order;
          }
        }

        for (let i = 0; i < selectedImages.length; i++) {
          const imageData = selectedImages[i];
          const slug = await generateUniqueSlug(
            imageData.title,
            checkSlugExists
          );

          artworkEntries.push({
            title: imageData.title,
            description: newArtwork.description,
            storage_path: imageData.url,
            category: newArtwork.category, // Keep for backward compatibility
            subcategory_id: newArtwork.subcategory_id,
            slug: slug,
            sort_order: currentSortOrder + 1 + i, // Assign sequential sort_order
          });
        }

        // Insert all artwork entries
        const { error } = await supabase
          .from("artwork_images")
          .insert(artworkEntries);
        if (error) throw error;

        router.push("/dashboard/artwork");
      } else {
        // Handle single submission
        const slug = await generateUniqueSlug(
          newArtwork.title,
          checkSlugExists
        );

        // Get the next sort_order for this subcategory
        let nextSortOrder = 0;
        if (newArtwork.subcategory_id) {
          const { data: existingArtworks, error: countError } = await supabase
            .from("artwork_images")
            .select("sort_order")
            .eq("subcategory_id", newArtwork.subcategory_id)
            .order("sort_order", { ascending: false })
            .limit(1);

          if (!countError && existingArtworks && existingArtworks.length > 0) {
            nextSortOrder = existingArtworks[0].sort_order + 1;
          }
        }

        // Create the artwork entry
        const { error } = await supabase.from("artwork_images").insert({
          title: newArtwork.title,
          description: newArtwork.description,
          storage_path: selectedImage,
          category: newArtwork.category, // Keep for backward compatibility
          subcategory_id: newArtwork.subcategory_id,
          slug: slug,
          sort_order: nextSortOrder,
        });

        if (error) throw error;

        router.push("/dashboard/artwork");
      }
    } catch (error) {
      console.error("Error creating artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Add New Artwork
            </h1>
            <p className="text-gray-400">
              {bulkMode
                ? "Upload multiple illustrations or tattoo designs"
                : "Upload a new illustration or tattoo design"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Single</label>
            <button
              type="button"
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedImage(null);
                setSelectedImages([]);
                setNewArtwork((prev) => ({ ...prev, title: "" }));
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                bulkMode ? "bg-secondary" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  bulkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-sm text-gray-400">Bulk</label>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            {bulkMode ? "Images *" : "Image *"}
          </label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              multiple={bulkMode}
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {uploadingImage && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <LoadingSpinner size="sm" />
                <span>
                  {bulkMode ? "Uploading images..." : "Uploading image..."}
                </span>
              </div>
            )}

            {/* Show upload progress for bulk mode */}
            {bulkMode && Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([filename, progress]) => (
                  <div key={filename} className="text-sm text-gray-400">
                    {filename}: {progress.current}/{progress.total}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Single image preview */}
          {!bulkMode && selectedImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded border border-gray-600"
              />
            </div>
          )}

          {/* Bulk images preview */}
          {bulkMode && selectedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">
                Preview ({selectedImages.length} images):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImages.map((imageData, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageData.url}
                      alt={imageData.title}
                      className="w-full h-32 object-cover rounded border border-gray-600"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b">
                      {imageData.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea
            value={newArtwork.description}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, description: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Enter artwork description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Section *
          </label>
          <select
            required
            value={newArtwork.category}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, category: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="graphics">Graphics</option>
            <option value="tattoos">Tattoos</option>
          </select>
        </div>

        {newArtwork.category && (
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
              <>
                <select
                  required
                  value={newArtwork.menu_item_id}
                  onChange={(e) =>
                    setNewArtwork({
                      ...newArtwork,
                      menu_item_id: e.target.value,
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
                {menuItems.length === 0 && !loadingMenuItems && (
                  <p className="text-sm text-gray-400 mt-1">
                    No menu items found. Please create menu items first in the{" "}
                    <a
                      href={`/dashboard/${newArtwork.category}`}
                      className="text-secondary hover:underline"
                    >
                      {newArtwork.category} dashboard
                    </a>
                    .
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {newArtwork.menu_item_id && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Subcategory *
            </label>
            {loadingSubcategories ? (
              <div className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <span className="text-gray-400">Loading subcategories...</span>
              </div>
            ) : (
              <>
                <select
                  required
                  value={newArtwork.subcategory_id}
                  onChange={(e) =>
                    setNewArtwork({
                      ...newArtwork,
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
                {subcategories.length === 0 && !loadingSubcategories && (
                  <p className="text-sm text-gray-400 mt-1">
                    No subcategories found in this menu item. Please create
                    subcategories first in the{" "}
                    <a
                      href={`/dashboard/${newArtwork.category}`}
                      className="text-secondary hover:underline"
                    >
                      {newArtwork.category} dashboard
                    </a>
                    .
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {!bulkMode && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={newArtwork.title}
              onChange={(e) =>
                setNewArtwork({ ...newArtwork, title: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Enter artwork title"
            />
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={
              loading ||
              uploadingImage ||
              !newArtwork.subcategory_id ||
              (bulkMode ? selectedImages.length === 0 : !selectedImage)
            }
            className="bg-secondary hover:bg-secondary/80"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {bulkMode ? "Creating Artworks..." : "Creating..."}
              </>
            ) : bulkMode ? (
              `Upload ${selectedImages.length} Artworks`
            ) : (
              "Upload Artwork"
            )}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/artwork")}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
