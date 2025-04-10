'use client';

import { useEffect, useState, useRef } from 'react';

interface ScrollSpyProps {
  sectionIds: string[];
  offset?: number;
  onSectionChange?: (section: string | null, inOverview: boolean) => void;
}

export default function ScrollSpy({ 
  sectionIds, 
  offset = 150, 
  onSectionChange 
}: ScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isOverviewVisible, setIsOverviewVisible] = useState(false);
  const observersRef = useRef<IntersectionObserver[]>([]);
  
  useEffect(() => {
    // Clean up any existing observers
    if (observersRef.current.length > 0) {
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];
    }
    
    // Create observer for overview section
    const overviewObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsOverviewVisible(entry.isIntersecting);
        
        if (entry.isIntersecting && !activeSection) {
          if (onSectionChange) {
            onSectionChange(null, true);
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: `-${offset}px 0px 0px 0px`
      }
    );
    
    // Observe overview section
    const overviewSection = document.querySelector('.overview-section');
    if (overviewSection) {
      overviewObserver.observe(overviewSection);
      observersRef.current.push(overviewObserver);
    }
    
    // Create observers for each day section
    sectionIds.forEach(id => {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          
          if (entry.isIntersecting) {
            setActiveSection(id);
            if (onSectionChange) {
              onSectionChange(id, isOverviewVisible);
            }
          }
        },
        {
          threshold: 0.2,
          rootMargin: `-${offset}px 0px 0px 0px`
        }
      );
      
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
        observersRef.current.push(observer);
      }
    });
    
    // Cleanup function
    return () => {
      observersRef.current.forEach(observer => observer.disconnect());
    };
  }, [sectionIds, offset, onSectionChange, isOverviewVisible]);
  
  // This component doesn't render anything visible
  return null;
}
