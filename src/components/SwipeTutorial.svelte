<!-- src/components/SwipeTutorial.svelte -->
<script>
    import { onMount } from 'svelte';
    
    export let showOnce = true; // Show tutorial only once
    export let delay = 1000; // Delay before showing the tutorial (ms)
    
    let visible = false;
    
    // Check if the user has seen the tutorial before
    function hasSeenTutorial() {
      return localStorage.getItem('swipeTutorialSeen') === 'true';
    }
    
    function setTutorialSeen() {
      localStorage.setItem('swipeTutorialSeen', 'true');
    }
    
    function dismiss() {
      visible = false;
      if (showOnce) {
        setTutorialSeen();
      }
    }
    
    // Only show on mobile/touch devices
    function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    onMount(() => {
      // Only show if this is a touch device and (if showOnce is true) user hasn't seen it before
      if (isTouchDevice() && (!showOnce || !hasSeenTutorial())) {
        setTimeout(() => {
          visible = true;
        }, delay);
      }
    });
  </script>
  
  {#if visible}
    <div class="tutorial-overlay" on:click={dismiss}>
      <div class="tutorial-modal" on:click|stopPropagation>
        <div class="tutorial-content">
          <h3>Navigate with Two Fingers</h3>
          <div class="gesture-demo">
            <div class="hand-icon">👆👆</div>
            <div class="swipe-animation"></div>
          </div>
          <p>Swipe left or right with two fingers to navigate between days of your trip</p>
          <button class="tutorial-button" on:click={dismiss}>Got it!</button>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .tutorial-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .tutorial-modal {
      background-color: white;
      border-radius: 12px;
      width: 90%;
      max-width: 350px;
      padding: 25px;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    
    .tutorial-content h3 {
      margin-top: 0;
      color: var(--primary-dark);
      font-size: 1.4em;
      margin-bottom: 20px;
    }
    
    .gesture-demo {
      margin: 30px 0;
      position: relative;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .hand-icon {
      font-size: 2.5em;
      animation: handMove 2s infinite;
    }
    
    .swipe-animation {
      position: absolute;
      top: 50%;
      width: 60%;
      height: 2px;
      background: linear-gradient(to right, transparent, var(--primary), transparent);
      z-index: -1;
    }
    
    .tutorial-button {
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 50px;
      font-size: 1em;
      margin-top: 20px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .tutorial-button:hover {
      background-color: var(--primary-dark);
    }
    
    @keyframes handMove {
      0%, 100% {
        transform: translateX(-30px);
      }
      50% {
        transform: translateX(30px);
      }
    }
  </style>