'use client';

import { useEffect, useState } from 'react';

interface SwipeTutorialProps {
  showOnce?: boolean;
  delay?: number;
}

export default function SwipeTutorial({ showOnce = true, delay = 2000 }: SwipeTutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  
  useEffect(() => {
    // Check if tutorial has already been shown (if showOnce is true)
    if (showOnce) {
      const hasShown = localStorage.getItem('swipeTutorialShown') === 'true';
      if (hasShown) {
        setHasBeenShown(true);
        return;
      }
    }
    
    // Show tutorial after delay
    const timer = setTimeout(() => {
      if (!hasBeenShown) {
        setIsVisible(true);
        
        // Mark as shown if showOnce is true
        if (showOnce) {
          localStorage.setItem('swipeTutorialShown', 'true');
          setHasBeenShown(true);
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [showOnce, delay, hasBeenShown]);
  
  // Only show on mobile devices
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      localStorage.setItem('swipeTutorialShown', 'true');
      setHasBeenShown(true);
    }
  };
  
  if (!isVisible || !isMobile) {
    return null;
  }
  
  return (
    <div className="swipe-tutorial" onClick={handleDismiss}>
      <div className="swipe-tutorial-content">
        <div className="swipe-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 4L18 8M18 8L14 12M18 8H10.5C8.01472 8 6 10.0147 6 12.5C6 14.9853 8.01472 17 10.5 17H18" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p>Swipe left and right to navigate between days</p>
        <button className="dismiss-btn">Got it</button>
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
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 90%;
          animation: fadeIn 0.5s;
        }
        
        .swipe-icon {
          margin-bottom: 10px;
          animation: swipeMotion 2s infinite;
        }
        
        .dismiss-btn {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 5px 15px;
          border-radius: 20px;
          margin-top: 10px;
          cursor: pointer;
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
    </div>
  );
}
