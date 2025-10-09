"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Carousel from "@/components/Carousel";

export default function TattoosSection() {
  const [tattoosImages, setTattoosImages] = useState(["/placeholder.png"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTattoosCarousel();
  }, []);

  const fetchTattoosCarousel = async () => {
    try {
      const response = await fetch("/api/homepage-carousel?section=tattoos");
      const data = await response.json();

      if (response.ok && data.data && data.data.length > 0) {
        const images = data.data.map((item) => item.artwork.storage_path);
        setTattoosImages(images);
      }
    } catch (error) {
      console.error("Error fetching tattoos carousel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Carousel */}
          <div className="relative h-[500px] md:h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : (
              <Carousel images={tattoosImages} alt="Tattoo designs" />
            )}
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black font-playfair">
              Tattoo Designs
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Discover unique tattoo designs that blend minimalist line work
              with intricate detail. Each piece is carefully crafted to
              translate beautifully onto skin while maintaining artistic
              integrity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From delicate continuous line work to bold statement pieces, every
              design tells a story and celebrates the art of permanent body art.
            </p>
            <div className="pt-4">
              <Button
                href="/tattoos"
                variant="primary"
                className="!border-[3px] !rounded-none !shadow-none hover:!shadow-none"
                showArrow={false}
              >
                View Tattoos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
