import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = images.length - 1;
    if (nextIndex >= images.length) nextIndex = 0;
    
    setDirection(newDirection);
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center overflow-visible group">
      {/* Main Slide Area */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0 flex items-center justify-center px-8"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100 flex items-center justify-center">
              <img
                src={images[currentIndex]}
                alt={`Carousel ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Peek Images */}
        <div className="absolute inset-y-0 -left-16 w-32 flex items-center justify-end pointer-events-none opacity-40 blur-[2px] scale-75 transition-all group-hover:opacity-60">
             <div className="w-full h-[80%] rounded-[2.5rem] overflow-hidden bg-white shadow-lg border border-slate-100">
                <img 
                  src={images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]} 
                  className="w-full h-full object-cover opacity-50"
                  alt="Prev slide peek"
                />
             </div>
        </div>
        <div className="absolute inset-y-0 -right-16 w-32 flex items-center justify-start pointer-events-none opacity-40 blur-[2px] scale-75 transition-all group-hover:opacity-60">
             <div className="w-full h-[80%] rounded-[2.5rem] overflow-hidden bg-white shadow-lg border border-slate-100">
                <img 
                  src={images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]} 
                  className="w-full h-full object-cover opacity-50"
                  alt="Next slide peek"
                />
             </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-2 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="absolute right-2 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
        onClick={() => paginate(1)}
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute -bottom-8 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-primary" : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
