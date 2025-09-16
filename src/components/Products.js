"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "../app/hooks/useProducts";
import LoadingSpinner from "./LoadingSpinner";

const SectionHeading = ({ text }) => (
  <motion.h3
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center mb-4"
  >
    {text}
  </motion.h3>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProductsSection = ({ children }) => (
  <section className="pb-16 pt-10 bg-third">
    <SectionHeading text="Latest creations." />
    <div className="max-w-5xl mx-auto">{children}</div>
  </section>
);

// Mobile Carousel Component
const MobileCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="relative px-4 py-8">
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Previous product"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Next product"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            <ProductCard
              product={products[currentIndex]}
              allProducts={products}
              currentIndex={currentIndex}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-primary scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="text-center mt-4 text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span>Swipe to see more</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const { products, loading, error } = useProducts(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (loading) {
    return (
      <ProductsSection>
        <LoadingSpinner />
      </ProductsSection>
    );
  }

  if (error) {
    return (
      <ProductsSection>
        <div className="text-center text-red-500">
          Error loading products. Please try again later.
        </div>
      </ProductsSection>
    );
  }

  return (
    <ProductsSection>
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <MobileCarousel products={products} />
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-8"
        >
          {products.map((product, index) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard
                product={product}
                allProducts={products}
                currentIndex={index}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ProductsSection>
  );
}
