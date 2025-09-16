"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function WelcomeSection() {
  const images = [
    "/IMG-20250813-WA0102.jpg",
    "/IMG-20250813-WA0105.jpg",
    "/IMG-20250813-WA0106.jpg",
    "/IMG-20250813-WA0107.jpg",
    "/IMG-20250813-WA0108.jpg",
    "/IMG-20250813-WA0109.jpg",
    "/hero-desktop.jpg",
    "/hero-mobile.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 800); // Wait for fade-out to complete before changing image
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToImage = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-third/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-4xl lg:text-5xl font-playfair text-black mb-6">
            Welcome to Embody Perthshire
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[600px]">
              <div
                key={currentImageIndex}
                className="w-full h-full transition-opacity duration-1000 ease-in-out"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt="Carol Doherty - Specialist Neurological Physiotherapist"
                  fill
                  className="object-cover"
                  priority={currentImageIndex === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      index === currentImageIndex
                        ? "bg-white scale-110"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-playfair text-black mb-6">
              I'm Carol Doherty
            </h3>
            <p className="text-lg text-secondary leading-relaxed">
              A Specialist Neurological Physiotherapist and Pilates, Yoga &
              Exercise Specialist with over a decade of experience helping
              people move with confidence.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              I combine clinical expertise with an encouraging, client-centred
              approach, supporting you to move better, feel stronger, and live
              more actively.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-primary/20 px-4 py-2 rounded-full">
                <span className="text-black font-medium">
                  Neurological Physiotherapy
                </span>
              </div>
              <div className="bg-third/20 px-4 py-2 rounded-full">
                <span className="text-black font-medium">Pilates & Yoga</span>
              </div>
              <div className="bg-fourth/20 px-4 py-2 rounded-full">
                <span className="text-black font-medium">
                  Exercise Specialist
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
