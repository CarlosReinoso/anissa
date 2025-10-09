"use client";
import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageModal({
  isOpen,
  onClose,
  currentImage,
  onNext,
  onPrevious,
  currentIndex,
  totalImages,
  subcategory,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-95"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-20"
          aria-label="Close"
        >
          <X size={32} />
        </button>

        {/* Image Info */}
        <div className="absolute top-4 left-4 text-white z-20">
          <p className="text-sm md:text-base font-medium uppercase tracking-wider">
            {subcategory}
          </p>
          <p className="text-xs md:text-sm text-gray-300 mt-1">
            {currentIndex + 1} / {totalImages}
          </p>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-20"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-20"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={currentImage.storage_path}
              alt={currentImage.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Image Details */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white max-w-2xl px-4">
          <h3 className="text-lg md:text-2xl font-bold mb-2">
            {currentImage.title}
          </h3>
          {currentImage.description && (
            <p className="text-sm md:text-base text-gray-300">
              {currentImage.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
