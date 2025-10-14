"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/config/supabase";
import { generateUniqueSlug } from "@/utils/slug";

export const useArtwork = (filters = {}) => {
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const abortControllerRef = useRef(null);

  // Extract filters with defaults
  const {
    section = null,
    category = null,
    sub_category = null,
    limit = null,
    offset = 0,
  } = filters;

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
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        // Apply filters
        if (section) {
          query = query.eq("section", section);
        }
        if (category) {
          query = query.eq("category", category);
        }
        if (sub_category) {
          query = query.eq("sub_category", sub_category);
        }

        // Apply pagination
        if (limit) {
          query = query.range(offset, offset + limit - 1);
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
    [lastFetch, section, category, sub_category, limit, offset]
  );

  const addArtwork = useCallback(async (artworkData) => {
    try {
      setError(null);

      // Validate required fields
      if (
        !artworkData.title ||
        !artworkData.storage_path ||
        !artworkData.category
      ) {
        throw new Error("Title, storage path, and category are required");
      }

      // Validate section and category
      if (
        artworkData.section &&
        !["graphics", "tattoos"].includes(artworkData.section)
      ) {
        throw new Error("Section must be either 'graphics' or 'tattoos'");
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

      // Generate unique slug if not provided
      let slug = artworkData.slug;
      if (!slug) {
        slug = await generateUniqueSlug(artworkData.title, checkSlugExists);
      }

      // Prepare artwork data with slug
      const artworkWithSlug = {
        ...artworkData,
        slug: slug,
      };

      // Get the next sort_order for this subcategory if not provided
      let sortOrder = artworkData.sort_order;
      if (sortOrder === undefined && artworkData.subcategory_id) {
        const { data: existingArtworks, error: countError } = await supabase
          .from("artwork_images")
          .select("sort_order")
          .eq("subcategory_id", artworkData.subcategory_id)
          .order("sort_order", { ascending: false })
          .limit(1);

        if (!countError && existingArtworks && existingArtworks.length > 0) {
          sortOrder = existingArtworks[0].sort_order + 1;
        } else {
          sortOrder = 0;
        }
      }

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticArtwork = {
        id: tempId,
        ...artworkWithSlug,
        sort_order: sortOrder || 0,
        created_at: new Date().toISOString(),
      };

      setArtwork((prev) => [optimisticArtwork, ...prev]);

      const { data, error } = await supabase
        .from("artwork_images")
        .insert([artworkWithSlug])
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

        // Validate section if provided
        if (
          updates.section &&
          !["graphics", "tattoos"].includes(updates.section)
        ) {
          throw new Error("Section must be either 'graphics' or 'tattoos'");
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

  const getArtworkBySection = useCallback(
    (section) => {
      return artwork.filter((item) => item.section === section);
    },
    [artwork]
  );

  const getArtworkBySubcategory = useCallback(
    (subcategory) => {
      return artwork.filter((item) => item.sub_category === subcategory);
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
    getArtworkBySection,
    getArtworkBySubcategory,
    clearError,
    refreshArtwork,
  };
};
