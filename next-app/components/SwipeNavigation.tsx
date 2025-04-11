'use client';

import { useEffect, useState, useRef, ReactNode, useCallback, memo } from 'react';

interface SwipeNavigationProps {
  children: ReactNode[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

function SwipeNavigation({
  children,
  currentIndex,
  onNavigate
}: SwipeNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [swiping, setSwiping] = useState(false);
  
  // Memoize navigation functions to prevent unnecessary rerenders
  const navigateNext = useCallback(() => {
    if (currentIndex < children.length - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, children.length, onNavigate]);
  
  const navigatePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);
  
  // Handle touch events for swipe detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
    setSwiping(true);
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return;
    setTouchEndX(e.targetTouches[0].clientX);
  }, [swiping]);
  
  const handleTouchEnd = useCallback(() => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isSignificantSwipe = Math.abs(distance) > 100;
    
    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swiped left, go to next day
        navigateNext();
      } else {
        // Swiped right, go to previous day
        navigatePrevious();
      }
    }
    
    setSwiping(false);
    setTouchStartX(null);
    setTouchEndX(null);
  }, [touchStartX, touchEndX, navigateNext, navigatePrevious]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePrevious, navigateNext]);
  
  // Add navigation buttons for accessibility
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < children.length - 1;
  
  return (
    <div 
      ref={containerRef}
      className="swipe-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Day navigation"
    >
      {children[currentIndex]}
      
      {/* Accessible navigation controls */}
      <div className="navigation-controls" aria-hidden="true">
        <button 
          onClick={navigatePrevious}
          disabled={!hasPrevious}
          className={`nav-button prev ${!hasPrevious ? 'disabled' : ''}`}
          aria-label="Previous day"
          tabIndex={hasPrevious ? 0 : -1}
        >
          ←
        </button>
        <button 
          onClick={navigateNext}
          disabled={!hasNext}
          className={`nav-button next ${!hasNext ? 'disabled' : ''}`}
          aria-label="Next day"
          tabIndex={hasNext ? 0 : -1}
        >
          →
        </button>
      </div>
      
      <p className="screen-reader-text">
        {hasPrevious ? "Swipe right or press left arrow key for previous day." : ""}
        {hasNext ? "Swipe left or press right arrow key for next day." : ""}
      </p>
      
      <style jsx>{`
        .swipe-container {
          touch-action: pan-y;
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .navigation-controls {
          display: none;
        }
        
        .screen-reader-text {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        /* Only show buttons on non-touch devices */
        @media (pointer: fine) {
          .navigation-controls {
            display: flex;
            justify-content: space-between;
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            z-index: 10;
            padding: 0 20px;
          }
          
          .nav-button {
            background-color: rgba(0, 0, 0, 0.3);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .nav-button:hover:not(.disabled) {
            background-color: rgba(0, 0, 0, 0.5);
          }
          
          .nav-button.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(SwipeNavigation);
