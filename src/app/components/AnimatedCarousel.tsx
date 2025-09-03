"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

type Props = {
  images: string[];
};

const VisibleSlides = 3;
const fixedSlideHeight = 250; // Fixed slide height in pixels
const gapHeight = 150; // Fixed vertical gap between slides in pixels

const VerticalCarousel: React.FC<Props> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const totalStep = fixedSlideHeight + gapHeight;

    // This offset centers the current slide vertically on the screen:
    // 1. Move container up to the position of current slide
    // 2. Push down by half the total viewport height minus half the slide height, to center slide vertically
    const yOffset =
      -currentIndex * totalStep + window.innerHeight / 2 - fixedSlideHeight / 2;

    gsap.to(container, {
      y: yOffset,
      duration: 0.6,
      ease: "power2.inOut",
    });

    // Update on window resize maintaining center alignment
    const handleResize = () => {
      const newYOffset =
        -currentIndex * totalStep +
        window.innerHeight / 2 -
        fixedSlideHeight / 2;

      gsap.to(container, {
        y: newYOffset,
        duration: 0.3,
        ease: "power2.inOut",
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center will-change-transform"
        style={{
          height: images.length * (fixedSlideHeight + gapHeight),
        }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            style={{
              height: fixedSlideHeight,
              width: "500px",
              flexShrink: 0,
              marginBottom: gapHeight,
              padding: "0 1rem",
              boxSizing: "border-box",
              opacity: idx === currentIndex ? 1 : 0.5,
              scale: idx === currentIndex ? 1 : 0.85,
              transition: "opacity 0.3s, transform 0.3s",
            }}
          >
            <img
              src={src}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover rounded-md "
              draggable={false}
            />
          </div>
        ))}
      </div>
      {/* Controls */}
      <div className="absolute left-1/2 bottom top-[70%] flex gap-4 -translate-x-1/2 cursor-pointer z-10">
        <button
          onClick={nextSlide}
          aria-label="Next"
          className="p-2 rounded-md  hover:bg-black/30 transition"
        >
          <img
            src="/box-arrow.svg"
            alt="Next"
            className="w-8 h-8 -rotate-180" // Rotate arrow to point down
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
};

export default VerticalCarousel;
