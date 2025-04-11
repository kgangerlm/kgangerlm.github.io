'use client';

import { useEffect, useState, useCallback, RefObject } from 'react';

/**
 * Custom hook to detect if we're on the client-side
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};

/**
 * Custom hook to detect if the device is mobile
 */
export const useIsMobile = () => {
  const isClient = useIsClient();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);
  
  return isMobile;
};

/**
 * Custom hook to handle localStorage with SSR safety
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const isClient = useIsClient();
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Initial load from localStorage
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue, isClient]);
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (!isClient) return;
    
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, isClient]);
  
  return [storedValue, setValue] as const;
};

/**
 * Custom hook for detecting clicks outside of a specified element
 */
export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
