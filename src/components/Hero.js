"use client";
import Image from "next/image";
import Button from "./Button";
import { motion } from "framer-motion";
import { ARTIST_INFO } from "@/constants";

export default function Hero() {
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <Image
          src="/hero.png"
          alt="Anissa Aouar - Freelance Illustrator & Tattoo Artist"
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          priority
          className="object-cover"
        />

        {/* Dark overlay for black theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50 z-5"></div>

        {/* Additional dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40 z-6"></div>

        {/* Animated background patterns */}
        <div className="absolute inset-0 z-1 overflow-hidden">
          {/* Floating artistic elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-3 h-3 bg-white/10 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, -15, 0],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-40 right-40 w-4 h-4 bg-white/15 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              x: [0, 20, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-60 right-60 w-2 h-2 bg-white/20 rounded-full blur-sm"
          />
        </div>

        {/* Content container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-8 lg:p-12 z-10">
          {/* Main heading with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-4xl z-10"
          >
            {/* Artist name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 font-playfair"
              style={{
                color: "#ffffff",
                textShadow:
                  "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.8)",
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
              }}
            >
              {ARTIST_INFO.name}
            </motion.h1>

            {/* Title with elegant styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mb-6 md:mb-8"
            >
              <h2
                className="text-xl md:text-2xl lg:text-3xl font-medium font-figtree"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "0 0 15px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.8)",
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                }}
              >
                {ARTIST_INFO.title}
              </h2>
              <div className="flex items-center justify-center mt-2">
                <div
                  className="w-16 h-px"
                  style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                ></div>
                <span
                  className="mx-4 text-sm md:text-base"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  •
                </span>
                <div
                  className="w-16 h-px"
                  style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                ></div>
              </div>
              <p
                className="text-lg md:text-xl mt-2 font-figtree"
                style={{
                  color: "#e5e7eb",
                  textShadow:
                    "0 0 10px rgba(229,231,235,0.5), 0 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                in Marseille
              </p>
            </motion.div>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="h-0.5 my-4"
              style={{
                background:
                  "linear-gradient(to right, transparent, #ffffff, #e5e7eb, #ffffff, transparent)",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            />
          </motion.div>

          {/* Enhanced button section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="z-10 flex flex-col sm:flex-row gap-4 items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
              className="z-10"
            >
              <Button variant="gold" href="/graphics">
                View Graphics
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
              className="z-10"
            >
              <Button variant="pink" href="/tattoos">
                View Tattoos
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-1 h-2 bg-white/80 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>
    </>
  );
}
