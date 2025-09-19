"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NewArtwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    category: "graphics",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (event) => {
    try {
      setUploadingImage(true);
      const file = event.target.files[0];
      if (!file) return;

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

      setSelectedImage(publicUrl);
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
      if (!selectedImage) {
        throw new Error("Please upload an image");
      }

      // Create the artwork entry
      const { error } = await supabase.from("artwork_images").insert({
        title: newArtwork.title,
        description: newArtwork.description,
        image_url: selectedImage,
        category: newArtwork.category,
      });

      if (error) throw error;

      router.push("/dashboard/artwork");
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
        <h1 className="text-3xl font-bold text-white mb-2">Add New Artwork</h1>
        <p className="text-gray-400">
          Upload a new illustration or tattoo design
        </p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            Category *
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

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Image *
          </label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {uploadingImage && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <LoadingSpinner size="sm" />
                <span>Uploading image...</span>
              </div>
            )}
          </div>

          {selectedImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded border border-gray-600"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={loading || uploadingImage || !selectedImage}
            className="bg-secondary hover:bg-secondary/80"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </>
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
