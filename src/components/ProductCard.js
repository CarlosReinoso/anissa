"use client";

import Image from "next/image";
import { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import { EMAIL_ADDRESS } from "../constants";
import { motion } from "framer-motion";

export default function ProductCard({
  product: initialProduct,
  onClick,
  allProducts,
  currentIndex: initialIndex,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleCardClick = () => {
    setIsModalOpen(true);
    if (onClick) onClick();
  };

  const handleNextProduct = () => {
    const nextIndex = (currentIndex + 1) % allProducts.length;
    setCurrentIndex(nextIndex);
    setCurrentProduct(allProducts[nextIndex]);
  };

  const handlePreviousProduct = () => {
    const prevIndex =
      (currentIndex - 1 + allProducts.length) % allProducts.length;
    setCurrentIndex(prevIndex);
    setCurrentProduct(allProducts[prevIndex]);
  };

  return (
    <>
      <motion.div
        className="bg-white rounded shadow-lg flex flex-col overflow-hidden border-2 border-transparent hover:border-primary transition-colors duration-300 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        style={{ minHeight: 420 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="relative w-full"
          style={{ aspectRatio: "3/4", minHeight: 300 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={
              currentProduct.images[isHovered ? 1 : 0] ||
              currentProduct.images[0]
            }
            alt={currentProduct.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-300"
          />
        </motion.div>
        <motion.div
          className="p-4 flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3
            className="text-lg mb-1 text-black inline-block relative w-fit"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative">
              {currentProduct.name}
              <motion.span
                className="absolute left-0 -bottom-1 h-0.5 bg-primary w-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </motion.h3>
          <motion.p
            className="text-sm text-gray-500 mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.5em", // Ensures space for 2 lines
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {currentProduct.description}
          </motion.p>
          <div className="flex items-center gap-2 mt-auto">
            {currentProduct.sold_out ? (
              <>
                <motion.button
                  className="mt-2 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    const subject = `Enquiry for ${currentProduct.name}`;
                    const body = `Hello,\n\nI am interested in the following product:\n\nProduct: ${currentProduct.name}\nPrice: £${currentProduct.price}\n\nPlease provide more information about availability and ordering process.\n\nBest regards,`;
                    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
                      subject
                    )}&body=${encodeURIComponent(body)}`;
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enquire about this piece
                </motion.button>
                <motion.span
                  className="text-gray-400 font-semibold ml-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  £{currentProduct.price}
                </motion.span>
              </>
            ) : (
              <motion.span
                className="text-primary font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                £{currentProduct.price}
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ProductDetailsModal
        product={currentProduct}
        isModalOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          // Reset to initial state when closing modal
          setCurrentProduct(initialProduct);
          setCurrentIndex(initialIndex);
        }}
        showNextProduct={handleNextProduct}
        showPreviousProduct={handlePreviousProduct}
      />
    </>
  );
}
