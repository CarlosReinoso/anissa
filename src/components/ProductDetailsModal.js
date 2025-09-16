"use client";
import { useState } from "react";
import Image from "next/image";
import BuyButton from "./BuyButton";
import ImageZoom from "./ImageZoom";
import EnquireButton from "./EnquireButton";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailsModal({
  product,
  isModalOpen,
  closeModal,
  showNextProduct,
  showPreviousProduct,
}) {
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isModalOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4"
        onClick={closeModal}
      >
        <div className="relative w-full max-w-4xl flex items-center justify-center">
          {/* Side Navigation Arrows - now anchored to modal */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              showPreviousProduct();
            }}
            className="absolute top-1/2 -translate-y-1/2 left-[-60px] z-50 rounded-full shadow-md border border-neutral-200 px-4 py-2 text-neutral-700 bg-white hover:bg-neutral-100 transition-all font-medium"
            aria-label="Previous product"
            style={{ left: "-60px", transform: "translateY(-50%)" }}
          >
            &#8592;
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              showNextProduct();
            }}
            className="absolute top-1/2 -translate-y-1/2 right-[-60px] z-50 rounded-full shadow-md border border-neutral-200 px-4 py-2 text-neutral-700 bg-white hover:bg-neutral-100 transition-all font-medium"
            aria-label="Next product"
            style={{ right: "-60px", transform: "translateY(-50%)" }}
          >
            &#8594;
          </motion.button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="overflow-y-auto h-[95vh] relative bg-gradient-to-br from-white via-neutral-50 to-neutral-200 rounded-2xl shadow-2xl w-full max-w-4xl px-4 py-4 sm:py-12 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-neutral-100"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Right Side (On Desktop), Top Section on Mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2"
              >
                {product.name}
              </motion.h3>

              <hr className="border-gray-200 my-4" />
              {/* Thumbnails */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-2 overflow-x-auto pb-2 w-full pt-2"
              >
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all
                      ${
                        selectedImageIndex === index
                          ? "border-neutral-900 shadow-md"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>

              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ImageZoom
                  src={
                    product.images?.[selectedImageIndex] || "/placeholder.png"
                  }
                />
              </motion.div>
            </motion.div>

            {/* Left Side (On Desktop), Below Image on Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Tab Navigation */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl mb-2"
              >
                {product.price ? `£${product.price}` : "N/A"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm mb-6"
              >
                Free UK Shipping, 2-4 Working Days
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between md:justify-start space-x-0 md:space-x-12 mb-6 pt-2 md:pt-12"
              >
                {["Description", "Materials", "Intention"].map((tab) => (
                  <motion.button
                    key={tab}
                    className={`relative pb-2 px-1 sm:px-2 text-base sm:text-lg font-medium focus:outline-none transition-colors duration-200 cursor-pointer
                      ${
                        activeTab === tab
                          ? "text-neutral-900 font-semibold"
                          : "text-neutral-400 hover:text-neutral-700"
                      }
                    `}
                    onClick={() => setActiveTab(tab)}
                    style={{ outline: "none" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab}
                    <motion.span
                      className={`absolute left-0 -bottom-0.5 h-0.5 w-full bg-neutral-900`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeTab === tab ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </motion.button>
                ))}
              </motion.div>

              {/* Tab Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === "Description" && (
                      <div>
                        <p className="mt-2 whitespace-pre-wrap">
                          {product.description || "No description available."}
                        </p>
                      </div>
                    )}
                    {activeTab === "Materials" && (
                      <div>
                        <p className="mt-2">
                          {product.materials || "No materials info available."}
                        </p>
                      </div>
                    )}
                    {activeTab === "Intention" && (
                      <div>
                        <p className="font-semibold text-lg">
                          Healing Intention:
                        </p>
                        <p className="mt-2">
                          {product.healing_intention ||
                            "No healing intention info available."}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Buy Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex justify-center"
              >
                <div className="w-full">
                  {product.sold_out ? (
                    <EnquireButton product={product} />
                  ) : (
                    <BuyButton product={product} />
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full shadow-md border border-neutral-200 flex items-center justify-center text-neutral-500 text-2xl font-bold hover:text-neutral-900 hover:bg-neutral-100 transition-all z-10"
            >
              &times;
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
