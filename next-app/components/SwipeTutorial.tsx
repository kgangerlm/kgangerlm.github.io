'use client';

import { useEffect, useState, useCallback, memo } from 'react';

interface SwipeTutorialProps {
  showOnce?: boolean;
  delay?: number;
  autoHideDelay?: number;
}

function SwipeTutorial({ 
  showOnce = true, 
  delay = 2000,
  autoHideDelay = 5000 
}: SwipeTutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    // Use media query for better detection
    const mobileMediaQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    
    // Initial check
    handleMediaQueryChange(mobileMediaQuery);
    
    // Listen for changes
    mobileMediaQuery.addEventListener('change', handleMediaQueryChange);
    
    return () => {
      mobileMediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);
  
  // Handle tutorial visibility
  useEffect(() => {
    // Don't proceed if not mobile
    if (!isMobile) return;
    
    // Check if tutorial has already been shown (if showOnce is true)
    if (showOnce) {
      try {
        const hasShown = localStorage.getItem('swipeTutorialShown') === 'true';
        if (hasShown) {
          setHasBeenShown(true);
          return;
        }
      } catch (error) {
        // localStorage might not be available in some contexts
        console.warn('Could not access localStorage:', error);
      }
    }
    
    // Show tutorial after delay
    const showTimer = setTimeout(() => {
      if (!hasBeenShown) {
        setIsVisible(true);
        
        // Mark as shown if showOnce is true
        if (showOnce) {
          try {
            localStorage.setItem('swipeTutorialShown', 'true');
          } catch (error) {
            console.warn('Could not access localStorage:', error);
          }
          setHasBeenShown(true);
        }
        
        // Auto-hide after specified delay
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
        
        return () => clearTimeout(hideTimer);
      }
    }, delay);
    
    return () => clearTimeout(showTimer);
  }, [showOnce, delay, hasBeenShown, isMobile, autoHideDelay]);
  
  // Dismiss handler
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    if (showOnce) {
      try {
        localStorage.setItem('swipeTutorialShown', 'true');
      } catch (error) {
        console.warn('Could not access localStorage:', error);
      }
      setHasBeenShown(true);
    }
  }, [showOnce]);
  
  // Don't render if not visible or not mobile
  if (!isVisible || !isMobile) {
    return null;
  }
  
  return (
    <aside 
      className="swipe-tutorial" 
      onClick={handleDismiss}
      role="alert"
      aria-live="polite"
    >
      <div className="swipe-tutorial-content">
        <div className="swipe-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 4L18 8M18 8L14 12M18 8H10.5C8.01472 8 6 10.0147 6 12.5C6 14.9853 8.01472 17 10.5 17H18" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p id="swipe-instructions">Swipe left and right to navigate between days</p>
        <button 
          className="dismiss-btn"
          onClick={handleDismiss}
          aria-label="Dismiss swipe tutorial"
        >
          Got it
        </button>
      </div>
      
      <style jsx>{`
        .swipe-tutorial {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
        }
        
        .swipe-tutorial-content {
          background-color: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 90%;
          animation: fadeIn 0.5s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .swipe-icon {
          margin-bottom: 10px;
          animation: swipeMotion 2s infinite;
        }
        
        .dismiss-btn {
          background-color: var(--primary, #007bff);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
          margin-top: 12px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .dismiss-btn:hover, .dismiss-btn:focus {
          background-color: var(--primary-dark, #0056b3);
          outline: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes swipeMotion {
          0% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(-5px); }
        }
      `}</style>
    </aside>
  );
}

export default memo(SwipeTutorial);
