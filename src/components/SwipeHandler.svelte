<!-- src/components/SwipeHandler.svelte -->
<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    
    // Props
    export let minSwipeDistance = 50; // Minimum distance for a swipe to register
    export let enabled = true; // Whether swipe detection is enabled
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Touch state variables
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let fingerCount = 0;
    
    function handleTouchStart(event) {
      if (!enabled) return;
      
      // Store the number of fingers used
      fingerCount = event.touches.length;
      
      // Only track two-finger swipes
      if (fingerCount === 2) {
        // Calculate the center point between the two touches
        touchStartX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        touchStartY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      }
    }
    
    function handleTouchMove(event) {
      if (!enabled) return;
      
      // Prevent scrolling when detecting a horizontal two-finger swipe
      if (fingerCount === 2) {
        event.preventDefault();
      }
    }
    
    function handleTouchEnd(event) {
      if (!enabled || fingerCount !== 2) return;
      
      // Use changedTouches to get final positions since touches are removed
      if (event.changedTouches.length === 2) {
        // Calculate the center point between the two touches
        touchEndX = (event.changedTouches[0].clientX + event.changedTouches[1].clientX) / 2;
        touchEndY = (event.changedTouches[0].clientY + event.changedTouches[1].clientY) / 2;
        
        // Calculate the horizontal and vertical distances
        const horizontalDistance = touchEndX - touchStartX;
        const verticalDistance = touchEndY - touchStartY;
        
        // Only consider it a horizontal swipe if the horizontal movement
        // is greater than both the minimum distance and the vertical movement
        if (Math.abs(horizontalDistance) > minSwipeDistance && 
            Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
          
          if (horizontalDistance > 0) {
            dispatch('swipe', { direction: 'right', distance: horizontalDistance });
          } else {
            dispatch('swipe', { direction: 'left', distance: horizontalDistance });
          }
        }
      }
      
      // Reset finger count
      fingerCount = 0;
    }
    
    onMount(() => {
      // Add passive: false to allow preventDefault in touch handlers
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
    
    onDestroy(() => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    });
  </script>
  
  <slot></slot>