<!-- src/components/SwipeNavigation.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  
  // Props
  export let currentIndex = 0;
  export let totalItems = 0;
  export let onNavigate = (newIndex) => {};
  export let threshold = 100; // Minimum distance to trigger a swipe
  export let disabled = false;
  
  // State
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;
  let swipeOffset = 0;
  let element;
  
  // Handle touch start
  function handleTouchStart(e) {
    if (disabled) return;
    
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
    swipeOffset = 0;
  }
  
  // Handle touch move
  function handleTouchMove(e) {
    if (!isSwiping || disabled) return;
    
    touchEndX = e.touches[0].clientX;
    swipeOffset = touchEndX - touchStartX;
    
    // Prevent scrolling while swiping horizontally
    if (Math.abs(swipeOffset) > 10) {
      e.preventDefault();
    }
  }
  
  // Handle touch end
  function handleTouchEnd() {
    if (!isSwiping || disabled) return;
    
    const swipeDistance = touchEndX - touchStartX;
    
    if (swipeDistance > threshold && currentIndex > 0) {
      // Swiped right - go to previous
      onNavigate(currentIndex - 1);
    } else if (swipeDistance < -threshold && currentIndex < totalItems - 1) {
      // Swiped left - go to next
      onNavigate(currentIndex + 1);
    }
    
    isSwiping = false;
    swipeOffset = 0;
  }
  
  // Set up and clean up event listeners
  onMount(() => {
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
  });
  
  onDestroy(() => {
    if (element) {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    }
  });
</script>

<div class="swipe-container" bind:this={element}>
  <slot></slot>
  
  {#if isSwiping && Math.abs(swipeOffset) > 20}
    <div class="swipe-indicator {swipeOffset > 0 ? 'prev' : 'next'}" 
         style="opacity: {Math.min(Math.abs(swipeOffset) / threshold, 0.9)}">
      <div class="indicator-content">
        <span class="arrow">{swipeOffset > 0 ? '←' : '→'}</span>
        <span class="text">{swipeOffset > 0 ? 'Previous Day' : 'Next Day'}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .swipe-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    touch-action: pan-y; /* Allow vertical scrolling */
  }
  
  .swipe-indicator {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 80px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 900;
  }
  
  .swipe-indicator.prev {
    left: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  
  .swipe-indicator.next {
    right: 0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  
  .indicator-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .arrow {
    font-size: 2rem;
    margin-bottom: 4px;
  }
  
  .text {
    font-size: 0.8rem;
    font-weight: 600;
  }
</style>