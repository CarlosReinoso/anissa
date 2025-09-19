"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/config/supabase";

export default function ArtworkGrid({ category = "all", limit = null }) {
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtwork();
  }, [category, limit]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("artwork_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredArtwork = data || [];

      if (limit) {
        filteredArtwork = filteredArtwork.slice(0, limit);
      }

      setArtwork(filteredArtwork);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 animate-pulse rounded"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading artwork: {error}</p>
        <button
          onClick={fetchArtwork}
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (artwork.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No artwork found for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {artwork.map((item) => (
        <div
          key={item.id}
          className="group cursor-pointer relative overflow-hidden bg-white"
        >
          <div className="aspect-square relative">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>
            </div>
            {/* Category badge */}
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
        </div>
      ))}
    </div>
  );
}
