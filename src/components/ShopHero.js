import React from "react";
import Waves from "./Waves";
import Image from "next/image";

const ShopHero = () => {
  return (
    <div className="relative h-[60vh] bg-gradient-to-b from-primary via-primary to-third overflow-visible">
      <Waves />

      <div className="relative h-full w-full flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="relative w-full md:w-1/2 h-full">
          <Image
            src="/shop-lady.png"
            alt="Shop Lady"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Right side - Text */}
        <div className="relative flex items-center justify-center w-full md:w-1/2 px-8">
          <h3 className="text-black mb-4 md:mb-6 mt-12">
            Shop for treasure...
          </h3>
          {/* Gradient overlay for smooth transition - only on text side */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-third to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
