"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Carousel from "@/components/Carousel";

export default function GraphicsSection() {
  const [graphicsImages, setGraphicsImages] = useState(["/placeholder.png"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraphicsCarousel();
  }, []);

  const fetchGraphicsCarousel = async () => {
    try {
      const response = await fetch("/api/homepage-carousel?section=graphics");
      const data = await response.json();

      if (response.ok && data.data && data.data.length > 0) {
        const images = data.data.map((item) => item.artwork.storage_path);
        setGraphicsImages(images);
      }
    } catch (error) {
      console.error("Error fetching graphics carousel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Info */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black font-playfair">
              Graphics & Illustrations
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Explore a vibrant collection of digital illustrations and vector
              artwork. From conceptual pieces to colorful pop surrealist
              compositions, each design is crafted with meticulous attention to
              detail.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              All artwork is created as scalable vectors, making them perfect
              for any project size while maintaining the authentic character of
              hand-drawn art.
            </p>
            <div className="pt-4">
              <Button
                href="/graphics"
                variant="primary"
                className="!border-[3px] !rounded-none !shadow-none hover:!shadow-none"
                showArrow={false}
              >
                View Graphics
              </Button>
            </div>
          </div>

          {/* Right - Carousel */}
          <div className="relative h-[500px] md:h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : (
              <Carousel images={graphicsImages} alt="Graphics artwork" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
