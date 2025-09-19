"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditArtwork({ params }) {
  const unwrappedParams = use(params);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchArtwork();
  }, [unwrappedParams.artworkId]);

  const fetchArtwork = async () => {
    try {
      const { data, error } = await supabase
        .from("artwork_images")
        .select("*")
        .eq("id", unwrappedParams.artworkId)
        .single();

      if (error) throw error;

      setArtwork(data);
      setEditedArtwork({
        ...data,
        description: data.description || "",
      });
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("artwork_images")
        .update({
          title: editedArtwork.title,
          description: editedArtwork.description,
          category: editedArtwork.category,
        })
        .eq("id", unwrappedParams.artworkId);

      if (error) throw error;

      setArtwork({ ...artwork, ...editedArtwork });
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

      // Update the artwork with new image
      const { error: updateError } = await supabase
        .from("artwork_images")
        .update({ image_url: publicUrl })
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
              Category *
            </label>
            <select
              required
              value={editedArtwork.category}
              onChange={(e) =>
                setEditedArtwork({ ...editedArtwork, category: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="graphics">Graphics</option>
              <option value="tattoos">Tattoos</option>
            </select>
          </div>

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
                  <span className="font-medium">Category:</span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      artwork.category === "graphics"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {artwork.category}
                  </span>
                </p>
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
            src={artwork.image_url}
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
