"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/config/supabase";

export const useArtwork = (category = null) => {
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const abortControllerRef = useRef(null);

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchArtwork = useCallback(
    async (forceRefresh = false) => {
      // Check if we have recent data and don't need to refetch
      if (
        !forceRefresh &&
        lastFetch &&
        Date.now() - lastFetch < CACHE_DURATION
      ) {
        return;
      }

      try {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        let query = supabase
          .from("artwork_images")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        // Filter by category if specified
        if (category) {
          query = query.eq("category", category);
        }

        const { data, error } = await query;

        if (error) throw error;

        setArtwork(data || []);
        setLastFetch(Date.now());
      } catch (err) {
        // Don't set error if request was aborted
        if (err.name !== "AbortError") {
          console.error("Error fetching artwork:", err);
          setError(err.message || "Failed to fetch artwork");
        }
      } finally {
        setLoading(false);
      }
    },
    [lastFetch, category]
  );

  const addArtwork = useCallback(async (artworkData) => {
    try {
      setError(null);

      // Validate required fields
      if (
        !artworkData.title ||
        !artworkData.image_url ||
        !artworkData.category
      ) {
        throw new Error("Title, image URL, and category are required");
      }

      // Validate category
      if (!["graphics", "tattoos"].includes(artworkData.category)) {
        throw new Error("Category must be either 'graphics' or 'tattoos'");
      }

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticArtwork = {
        id: tempId,
        ...artworkData,
        sort_order: artworkData.sort_order || 0,
        created_at: new Date().toISOString(),
      };

      setArtwork((prev) => [optimisticArtwork, ...prev]);

      const { data, error } = await supabase
        .from("artwork_images")
        .insert([artworkData])
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic update with real data
      setArtwork((prev) => prev.map((a) => (a.id === tempId ? data : a)));
      setLastFetch(Date.now());

      return data;
    } catch (err) {
      // Revert optimistic update on error
      setArtwork((prev) =>
        prev.filter((a) => !a.id.toString().startsWith("temp-"))
      );
      console.error("Error adding artwork:", err);
      setError(err.message || "Failed to add artwork");
      throw err;
    }
  }, []);

  const updateArtwork = useCallback(
    async (id, updates) => {
      try {
        setError(null);

        // Validate category if provided
        if (
          updates.category &&
          !["graphics", "tattoos"].includes(updates.category)
        ) {
          throw new Error("Category must be either 'graphics' or 'tattoos'");
        }

        // Optimistic update
        setArtwork((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
        );

        const { data, error } = await supabase
          .from("artwork_images")
          .update(updates)
          .eq("id", id)
          .select("*")
          .single();

        if (error) throw error;

        // Update with real data
        setArtwork((prev) => prev.map((a) => (a.id === id ? data : a)));
        setLastFetch(Date.now());

        return data;
      } catch (err) {
        // Revert optimistic update on error
        await fetchArtwork(true);
        console.error("Error updating artwork:", err);
        setError(err.message || "Failed to update artwork");
        throw err;
      }
    },
    [fetchArtwork]
  );

  const deleteArtwork = useCallback(
    async (id) => {
      try {
        setError(null);

        // Optimistic update
        setArtwork((prev) => prev.filter((a) => a.id !== id));

        const { error } = await supabase
          .from("artwork_images")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setLastFetch(Date.now());
      } catch (err) {
        // Revert optimistic update on error
        await fetchArtwork(true);
        console.error("Error deleting artwork:", err);
        setError(err.message || "Failed to delete artwork");
        throw err;
      }
    },
    [fetchArtwork]
  );

  const updateSortOrder = useCallback(
    async (id, newSortOrder) => {
      try {
        setError(null);

        // Optimistic update
        setArtwork((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, sort_order: newSortOrder } : a
          )
        );

        const { data, error } = await supabase
          .from("artwork_images")
          .update({ sort_order: newSortOrder })
          .eq("id", id)
          .select("*")
          .single();

        if (error) throw error;

        // Update with real data
        setArtwork((prev) => prev.map((a) => (a.id === id ? data : a)));
        setLastFetch(Date.now());

        return data;
      } catch (err) {
        // Revert optimistic update on error
        await fetchArtwork(true);
        console.error("Error updating sort order:", err);
        setError(err.message || "Failed to update sort order");
        throw err;
      }
    },
    [fetchArtwork]
  );

  const reorderArtwork = useCallback(
    async (reorderedItems) => {
      try {
        setError(null);

        // Optimistic update
        setArtwork(reorderedItems);

        // Update sort orders in database
        const updates = reorderedItems.map((item, index) => ({
          id: item.id,
          sort_order: index,
        }));

        const { error } = await supabase
          .from("artwork_images")
          .upsert(updates.map(({ id, sort_order }) => ({ id, sort_order })));

        if (error) throw error;

        setLastFetch(Date.now());
      } catch (err) {
        // Revert optimistic update on error
        await fetchArtwork(true);
        console.error("Error reordering artwork:", err);
        setError(err.message || "Failed to reorder artwork");
        throw err;
      }
    },
    [fetchArtwork]
  );

  const getArtworkByCategory = useCallback(
    (category) => {
      return artwork.filter((item) => item.category === category);
    },
    [artwork]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshArtwork = useCallback(() => {
    return fetchArtwork(true);
  }, [fetchArtwork]);

  useEffect(() => {
    fetchArtwork();

    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchArtwork]);

  return {
    artwork,
    loading,
    error,
    fetchArtwork,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    updateSortOrder,
    reorderArtwork,
    getArtworkByCategory,
    clearError,
    refreshArtwork,
  };
};
