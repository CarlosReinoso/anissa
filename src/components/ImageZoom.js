"use client";
import { useRef, useState } from "react";

export default function ImageZoom({ src }) {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: "3/4", minHeight: 300 }}
    >
      {/* Main image container */}
      <div
        ref={imageRef}
        className="w-full h-full bg-cover bg-center border border-gray-300"
        style={{ backgroundImage: `url(${src})` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      />

      {/* Zoomed-in view */}
      {isHovered && (
        <div
          className="fixed inset-0 w-[50vw] h-[80vh] top-1/2 left-2/3 -translate-x-1/3 -translate-y-1/2 z-50 bg-white/90 hidden md:block"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%", // Zoom level
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      )}
    </div>
  );
}
