"use client";
import Image from "next/image";
import Button from "./Button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Mobile Image - Full width */}
        <Image
          src="/hero-mobile.jpg"
          alt="Embody Perthshire - Specialist Neurological Physiotherapy"
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          priority
          className="md:hidden"
        />
        {/* Desktop Image - Positioned more to the right */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/hero-desktop.jpg"
            alt="Embody Perthshire - Specialist Neurological Physiotherapy"
            fill
            style={{ objectFit: "cover", transform: "translateX(20%)" }}
            priority
          />
        </div>

        {/* Pink overlay for desktop - left side only */}
        <div
          className="hidden md:block absolute inset-0 z-5"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(229, 170, 188, 1) 20%, rgba(229, 170, 188, 0.7) 30%, rgba(229, 170, 188, 0.4) 60%, transparent 80%)`,
          }}
        ></div>

        {/* Animated background patterns */}
        <div className="absolute inset-0 z-1 overflow-hidden">
          {/* Floating circles */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-40 right-40 w-6 h-6 bg-primary/30 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-60 right-60 w-3 h-3 bg-third/40 rounded-full blur-sm"
          />
        </div>

        {/* Content container */}
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left p-4 md:p-8 lg:p-12 z-10">
          {/* Mobile overlay */}
          <div
            className="md:hidden absolute inset-0 z-5"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(229, 170, 188, 0.8) 0%, rgba(229, 170, 188, 0.6) 30%, rgba(229, 170, 188, 0.3) 60%, transparent 80%)`,
            }}
          ></div>

          {/* Main heading with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-2xl z-10"
          >
            {/* Enhanced subtitle with gradient and animation */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl font-medium mb-4 md:mb-6 relative"
            >
              <h2 className="text-gray-700 mt-2 drop-shadow-lg font-medium bg-white/60 px-4 py-2 rounded w-fit">
                Specialist Neurological Physiotherapy & Fitness
              </h2>
              {/* Animated underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-0.5 bg-gradient-to-r from-white to-third mt-2"
              />
            </motion.h2>
          </motion.div>

          {/* Enhanced description with better typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <h4 className="text-white/95 max-w-lg md:max-w-xl leading-relaxed  ml-2 mb-6 md:mb-8 z-10 drop-shadow-lg">
              For lasting strength, balance, and confidence
            </h4>
          </motion.div>

          {/* Enhanced button section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="z-10 flex flex-col sm:flex-row gap-4 items-start"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.04, ease: "easeOut" }}
              className="z-10"
            >
              <Button variant="secondary" href="/contact">
                Book Your First Session
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="z-10"
            >
              <Button variant="outline" href="/about">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-third rounded-full flex justify-center">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-1 h-2 bg-third rounded-full mt-2"
          />
        </div>
      </motion.div>
    </>
  );
}
