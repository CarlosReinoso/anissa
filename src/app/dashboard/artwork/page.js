"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ArtworkDashboard() {
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchArtwork();
  }, []);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("artwork_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArtwork(data || []);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const { error } = await supabase
        .from("artwork_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchArtwork();
    } catch (error) {
      console.error("Error deleting artwork:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Artwork Management</h1>
        <Button
          onClick={() => router.push("/dashboard/artwork/new")}
          className="bg-secondary hover:bg-secondary/80"
        >
          Add New Artwork
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {artwork.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No artwork found</p>
          <Button
            onClick={() => router.push("/dashboard/artwork/new")}
            className="bg-secondary hover:bg-secondary/80"
          >
            Create Your First Artwork
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artwork.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
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
                    onClick={() => router.push(`/dashboard/artwork/${item.id}`)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
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
  );
}
