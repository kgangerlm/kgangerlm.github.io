'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

interface SwipeNavigationProps {
  children: ReactNode[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function SwipeNavigation({
  children,
  currentIndex,
  onNavigate
}: SwipeNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [swiping, setSwiping] = useState(false);
  
  // Handle touch events for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
    setSwiping(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    setTouchEndX(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isSignificantSwipe = Math.abs(distance) > 100;
    
    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swiped left, go to next day
        if (currentIndex < children.length - 1) {
          onNavigate(currentIndex + 1);
        }
      } else {
        // Swiped right, go to previous day
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      }
    }
    
    setSwiping(false);
    setTouchStartX(null);
    setTouchEndX(null);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < children.length - 1) {
          onNavigate(currentIndex + 1);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, children.length, onNavigate]);
  
  return (
    <div 
      ref={containerRef}
      className="swipe-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children[currentIndex]}
      
      <style jsx>{`
        .swipe-container {
          touch-action: pan-y;
          position: relative;
          width: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
