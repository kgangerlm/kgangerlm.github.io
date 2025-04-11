'use client';

import { useEffect, useState, useRef, useCallback, memo } from 'react';

interface ScrollSpyProps {
  sectionIds: string[];
  offset?: number;
  onSectionChange?: (section: string | null, inOverview: boolean) => void;
}

function ScrollSpy({ 
  sectionIds, 
  offset = 150, 
  onSectionChange 
}: ScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isOverviewVisible, setIsOverviewVisible] = useState(false);
  const observersRef = useRef<IntersectionObserver[]>([]);
  const isInitializedRef = useRef(false);
  
  // Memoize the section change handler
  const handleSectionChange = useCallback((section: string | null, isInOverview: boolean) => {
    setActiveSection(section);
    if (onSectionChange) {
      onSectionChange(section, isInOverview);
    }
  }, [onSectionChange]);
  
  // Setup intersection observers
  useEffect(() => {
    // Avoid duplicate initialization on strict mode double render
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    try {
      // Clean up any existing observers
      if (observersRef.current.length > 0) {
        observersRef.current.forEach(observer => observer.disconnect());
        observersRef.current = [];
      }
      
      // Observer factory to reduce code duplication
      const createObserver = (
        callback: (entry: IntersectionObserverEntry) => void
      ): IntersectionObserver => {
        return new IntersectionObserver(
          (entries) => {
            if (entries.length > 0) {
              callback(entries[0]);
            }
          },
          {
            threshold: 0.2,
            rootMargin: `-${offset}px 0px 0px 0px`
          }
        );
      };
      
      // Create observer for overview section
      const overviewObserver = createObserver((entry) => {
        const isIntersecting = entry.isIntersecting;
        setIsOverviewVisible(isIntersecting);
        
        if (isIntersecting && !activeSection) {
          handleSectionChange(null, true);
        }
      });
      
      // Observe overview section
      const overviewSection = document.querySelector('.overview-section');
      if (overviewSection) {
        overviewObserver.observe(overviewSection);
        observersRef.current.push(overviewObserver);
      }
      
      // Create observers for each day section
      sectionIds.forEach(id => {
        const observer = createObserver((entry) => {
          if (entry.isIntersecting) {
            handleSectionChange(id, isOverviewVisible);
          }
        });
        
        const section = document.getElementById(id);
        if (section) {
          observer.observe(section);
          observersRef.current.push(observer);
        }
      });
    } catch (error) {
      console.error('Error setting up intersection observers:', error);
    }
    
    // Cleanup function
    return () => {
      observersRef.current.forEach(observer => {
        try {
          observer.disconnect();
        } catch (error) {
          console.error('Error disconnecting observer:', error);
        }
      });
      isInitializedRef.current = false;
    };
  }, [sectionIds, offset, handleSectionChange, isOverviewVisible, activeSection]);
  
  // This component doesn't render anything visible
  return null;
}

export default memo(ScrollSpy);
