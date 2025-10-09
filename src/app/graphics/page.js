"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/config/supabase";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/Button";
import ImageModal from "@/components/ImageModal";
import CategorySeparator from "@/components/CategorySeparator";
import MobileSubmenuNavigation from "@/components/MobileSubmenuNavigation";

export default function GraphicsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
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
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (activeMenuItem) {
      fetchArtwork();
    }
  }, [activeMenuItem]);

  // Listen for hash changes from navbar
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && menuItems.length > 0) {
        const matchingItem = menuItems.find((item) => item.slug === hash);
        if (matchingItem) {
          setActiveMenuItem(matchingItem);
          setExpandedCategories({});
          setShowAll(false);
        }
      }
    };

    handleHashChange(); // Check on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [menuItems]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/menu-items?section=graphics&includeSubcategories=true"
      );
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        setMenuItems(result.data);

        // Check if there's a hash in the URL
        const hash = window.location.hash.slice(1);
        if (hash) {
          const matchingItem = result.data.find((item) => item.slug === hash);
          if (matchingItem) {
            setActiveMenuItem(matchingItem);
            return;
          }
        }

        // Otherwise, set first item as active and update hash
        setActiveMenuItem(result.data[0]);
        window.location.hash = result.data[0].slug;
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtwork = async () => {
    if (!activeMenuItem) return;

    try {
      setLoading(true);

      console.log("Active menu item:", activeMenuItem.name);
      console.log("Menu item ID:", activeMenuItem.id);

      // Use the artwork_hierarchy view to get complete data including menu_item info
      let query = supabase
        .from("artwork_hierarchy")
        .select("*")
        .eq("published", true)
        .eq("section", "graphics")
        .eq("menu_item_id", activeMenuItem.id)
        .order("subcategory_sort_order", { ascending: true })
        .order("artwork_sort_order", { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      console.log("Fetched artwork with menu_item info:", data);

      // Group artwork by subcategory name
      const grouped = (data || []).reduce((acc, item) => {
        const subcat = item.subcategory_name || "Uncategorized";
        if (!acc[subcat]) {
          acc[subcat] = [];
        }
        // Map the view fields to match the expected structure
        acc[subcat].push({
          id: item.artwork_id,
          title: item.title,
          slug: item.artwork_slug,
          storage_path: item.storage_path,
          section: item.section,
          sort_order: item.artwork_sort_order,
          published: item.published,
          sub_category: item.subcategory_name,
          menu_item_id: item.menu_item_id,
          menu_item_name: item.menu_item_name,
          menu_item_slug: item.menu_item_slug,
        });
        return acc;
      }, {});

      console.log("Grouped artwork:", grouped);
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
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      const subcategories = Object.keys(artworkBySubcategory);
      const currentSubcatIndex = subcategories.indexOf(currentSubcategory);

      if (currentSubcatIndex < subcategories.length - 1) {
        const nextSubcat = subcategories[currentSubcatIndex + 1];
        setCurrentSubcategory(nextSubcat);
        setCurrentImageIndex(0);
        setAllImages(artworkBySubcategory[nextSubcat]);
      } else {
        const firstSubcat = subcategories[0];
        setCurrentSubcategory(firstSubcat);
        setCurrentImageIndex(0);
        setAllImages(artworkBySubcategory[firstSubcat]);
      }
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      const subcategories = Object.keys(artworkBySubcategory);
      const currentSubcatIndex = subcategories.indexOf(currentSubcategory);

      if (currentSubcatIndex > 0) {
        const prevSubcat = subcategories[currentSubcatIndex - 1];
        const prevSubcatImages = artworkBySubcategory[prevSubcat];
        setCurrentSubcategory(prevSubcat);
        setCurrentImageIndex(prevSubcatImages.length - 1);
        setAllImages(prevSubcatImages);
      } else {
        const lastSubcat = subcategories[subcategories.length - 1];
        const lastSubcatImages = artworkBySubcategory[lastSubcat];
        setCurrentSubcategory(lastSubcat);
        setCurrentImageIndex(lastSubcatImages.length - 1);
        setAllImages(lastSubcatImages);
      }
    }
  };

  const getJigsawClass = (index) => {
    const patterns = [
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-2",
      "col-span-2 row-span-2",
    ];
    const patternIndex = index % 8;
    if (patternIndex === 0 || patternIndex === 3) return patterns[3];
    if (patternIndex === 1 || patternIndex === 6) return patterns[1];
    if (patternIndex === 2 || patternIndex === 5) return patterns[2];
    return patterns[0];
  };

  if (loading && menuItems.length === 0) {
    return (
      <div className="bg-white text-black pt-20 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12"></div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-black pt-20 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error loading content: {error}</p>
            <button
              onClick={fetchMenuItems}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black pt-20">
      <section className="min-h-screen pb-24 lg:pb-0">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-0 md:mb-12"></div>

          {/* Toggle Show All Button */}
          {Object.keys(artworkBySubcategory).length > 0 && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors mt-16"
              >
                {showAll ? (
                  <>
                    <EyeOff size={18} />
                    <span className="text-sm text-white font-medium">
                      Show Less
                    </span>
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    <span className="text-sm text-white font-medium">
                      Show All
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Artwork sections by subcategory */}
          {loading && activeMenuItem ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-gray-200 animate-pulse ${getJigsawClass(i)}`}
                ></div>
              ))}
            </div>
          ) : Object.keys(artworkBySubcategory).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No artwork found for this category.
              </p>
            </div>
          ) : (
            Object.entries(artworkBySubcategory).map(
              ([subcategory, artworks]) => {
                const visibleArtwork = getVisibleArtwork(subcategory, artworks);
                const hasMore = artworks.length > 4;
                const isExpanded = showAll || expandedCategories[subcategory];

                return (
                  <div key={subcategory} className="mb-16">
                    {/* Category Separator */}
                    <CategorySeparator title={subcategory} />

                    {/* Artwork Grid - Jigsaw Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                      {visibleArtwork.map((item, visibleIndex) => {
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
                            <div className="relative w-full h-full border-8 border-transparent hover:border-black transition-all duration-300">
                              <Image
                                src={item.storage_path}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-left p-4">
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
                );
              }
            )
          )}

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
      </section>

      {/* Mobile Submenu Navigation */}
      <MobileSubmenuNavigation
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
      />
    </div>
  );
}
