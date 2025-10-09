"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/config/supabase";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/Button";
import ImageModal from "@/components/ImageModal";
import CategorySeparator from "@/components/CategorySeparator";

export default function ArtworkGrid({
  category = "all",
  limit = null,
  section = "graphics",
}) {
  const [artworkBySubcategory, setArtworkBySubcategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    fetchArtwork();
  }, [category, limit, section]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("artwork_images")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (category !== "all") {
        query = query.eq("category", category);
      } else if (section) {
        query = query.eq("section", section);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredArtwork = data || [];

      if (limit && !showAll) {
        filteredArtwork = filteredArtwork.slice(0, limit);
      }

      // Group artwork by subcategory
      const grouped = filteredArtwork.reduce((acc, item) => {
        const subcat = item.sub_category || "Uncategorized";
        if (!acc[subcat]) {
          acc[subcat] = [];
        }
        acc[subcat].push(item);
        return acc;
      }, {});

      setArtworkBySubcategory(grouped);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAll) {
      // Expand all categories when showAll is true
      const allExpanded = {};
      Object.keys(artworkBySubcategory).forEach((key) => {
        allExpanded[key] = true;
      });
      setExpandedCategories(allExpanded);
    }
  }, [showAll, artworkBySubcategory]);

  const toggleCategory = (subcategory) => {
    if (!showAll) {
      setExpandedCategories((prev) => ({
        ...prev,
        [subcategory]: !prev[subcategory],
      }));
    }
  };

  const getVisibleArtwork = (subcategory, artwork) => {
    if (showAll || expandedCategories[subcategory]) {
      return artwork;
    }
    return artwork.slice(0, 4);
  };

  const openModal = (subcategory, imageIndex) => {
    const subcatImages = artworkBySubcategory[subcategory] || [];
    setCurrentSubcategory(subcategory);
    setCurrentImageIndex(imageIndex);
    setAllImages(subcatImages);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToNextImage = () => {
    const subcatImages = artworkBySubcategory[currentSubcategory] || [];

    if (currentImageIndex < subcatImages.length - 1) {
      // Move to next image in current subcategory
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // Move to next subcategory
      const subcategories = Object.keys(artworkBySubcategory);
      const currentSubcatIndex = subcategories.indexOf(currentSubcategory);

      if (currentSubcatIndex < subcategories.length - 1) {
        const nextSubcat = subcategories[currentSubcatIndex + 1];
        setCurrentSubcategory(nextSubcat);
        setCurrentImageIndex(0);
        setAllImages(artworkBySubcategory[nextSubcat]);
      } else {
        // Loop back to first subcategory
        const firstSubcat = subcategories[0];
        setCurrentSubcategory(firstSubcat);
        setCurrentImageIndex(0);
        setAllImages(artworkBySubcategory[firstSubcat]);
      }
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      // Move to previous image in current subcategory
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      // Move to previous subcategory
      const subcategories = Object.keys(artworkBySubcategory);
      const currentSubcatIndex = subcategories.indexOf(currentSubcategory);

      if (currentSubcatIndex > 0) {
        const prevSubcat = subcategories[currentSubcatIndex - 1];
        const prevSubcatImages = artworkBySubcategory[prevSubcat];
        setCurrentSubcategory(prevSubcat);
        setCurrentImageIndex(prevSubcatImages.length - 1);
        setAllImages(prevSubcatImages);
      } else {
        // Loop to last subcategory
        const lastSubcat = subcategories[subcategories.length - 1];
        const lastSubcatImages = artworkBySubcategory[lastSubcat];
        setCurrentSubcategory(lastSubcat);
        setCurrentImageIndex(lastSubcatImages.length - 1);
        setAllImages(lastSubcatImages);
      }
    }
  };

  // Get jigsaw pattern size class based on index
  const getJigsawClass = (index) => {
    const patterns = [
      "col-span-1 row-span-1", // small
      "col-span-2 row-span-1", // wide
      "col-span-1 row-span-2", // tall
      "col-span-2 row-span-2", // large
    ];
    // Create a repeating pattern with some variation
    const patternIndex = index % 8;
    if (patternIndex === 0 || patternIndex === 3) return patterns[3]; // large
    if (patternIndex === 1 || patternIndex === 6) return patterns[1]; // wide
    if (patternIndex === 2 || patternIndex === 5) return patterns[2]; // tall
    return patterns[0]; // small
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`bg-gray-200 animate-pulse ${getJigsawClass(i)}`}
            ></div>
          ))}
        </div>
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

  if (Object.keys(artworkBySubcategory).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No artwork found for this category.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toggle button in top right */}
      <div className="flex justify-end mb-6 px-6 mt-32">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors "
        >
          {showAll ? (
            <>
              <EyeOff size={18} />
              <span className="text-sm text-white font-medium">Show Less</span>
            </>
          ) : (
            <>
              <Eye size={18} />
              <span className="text-sm text-white font-medium">Show All</span>
            </>
          )}
        </button>
      </div>

      {/* Artwork sections by subcategory */}
      {Object.entries(artworkBySubcategory).map(([subcategory, artworks]) => {
        const visibleArtwork = getVisibleArtwork(subcategory, artworks);
        const hasMore = artworks.length > 4;
        const isExpanded = showAll || expandedCategories[subcategory];

        return (
          <div key={subcategory} className="mb-16">
            {/* Category Separator */}
            <CategorySeparator title={subcategory} className="px-6" />

            {/* Artwork Grid - Jigsaw Layout */}
            <div className="px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                {visibleArtwork.map((item, visibleIndex) => {
                  // Find the actual index in the full artwork array
                  const actualIndex = artworks.findIndex(
                    (art) => art.id === item.id
                  );
                  return (
                    <div
                      key={item.id}
                      onClick={() => openModal(subcategory, actualIndex)}
                      className={`group cursor-pointer relative overflow-hidden bg-white transition-all duration-300 ${getJigsawClass(
                        visibleIndex
                      )}`}
                    >
                      <div className="relative w-full h-full border-[8px] border-transparent hover:border-black transition-all duration-300">
                        <Image
                          src={item.storage_path}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 !text-white text-left p-4">
                            <h3
                              className="font-medium text-sm md:text-base mb-1 line-clamp-2"
                              style={{
                                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                                color: "white",
                              }}
                            >
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* See More Button */}
              {hasMore && !isExpanded && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => toggleCategory(subcategory)}
                    variant="primary"
                    showArrow={false}
                    className="!rounded-none !shadow-none hover:!shadow-none"
                  >
                    See More ({artworks.length - 4} more)
                  </Button>
                </div>
              )}

              {/* See Less Button */}
              {hasMore && isExpanded && !showAll && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => toggleCategory(subcategory)}
                    variant="primary"
                    showArrow={false}
                    className="!rounded-none !shadow-none hover:!shadow-none"
                  >
                    See Less
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        currentImage={allImages[currentImageIndex]}
        onNext={goToNextImage}
        onPrevious={goToPreviousImage}
        currentIndex={currentImageIndex}
        totalImages={allImages.length}
        subcategory={currentSubcategory}
      />
    </div>
  );
}
