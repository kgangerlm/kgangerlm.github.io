<!-- src/components/ScrollSpy.svelte -->
<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    
    // Required props
    export let sectionIds = []; // Array of section IDs to monitor
    export let offset = 100; // Offset from top of viewport (in pixels)
    
    const dispatch = createEventDispatcher();
    let currentSection = null;
    let overviewVisible = false;
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateCurrentSection();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    function updateCurrentSection() {
      // First check if overview is visible
      const overview = document.querySelector('.overview-section');
      if (overview) {
        const rect = overview.getBoundingClientRect();
        // Overview is considered visible if it's near the top of the viewport
        overviewVisible = rect.top > -100 && rect.top < window.innerHeight / 2;
      }
      
      // If overview is prominently visible, we're not in a day section
      if (overviewVisible) {
        if (currentSection !== null) {
          currentSection = null;
          dispatch('change', { section: null, inOverview: true });
        }
        return;
      }
      
      // Find which section is currently visible
      let found = false;
      
      // Simple approach: the first section that's near the top of the viewport is active
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        
        const rect = section.getBoundingClientRect();
        
        // If this section is near the top of the viewport, consider it active
        if (rect.top <= offset && rect.bottom > offset) {
          found = true;
          if (currentSection !== id) {
            currentSection = id;
            dispatch('change', { section: id, inOverview: false });
          }
          break;
        }
      }
      
      // Fallback: if no section is exactly at the offset but we're not in overview,
      // find the section that's most visible in the viewport
      if (!found && !overviewVisible && currentSection === null) {
        const viewportHeight = window.innerHeight;
        let maxVisibleSection = null;
        let maxVisibleArea = 0;
        
        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (!section) continue;
          
          const rect = section.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > viewportHeight) continue; // Not visible
          
          // Calculate visible area
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleArea = visibleBottom - visibleTop;
          
          if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea;
            maxVisibleSection = id;
          }
        }
        
        if (maxVisibleSection) {
          currentSection = maxVisibleSection;
          dispatch('change', { section: maxVisibleSection, inOverview: false });
        }
      }
    }
    
    onMount(() => {
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check
      setTimeout(updateCurrentSection, 100);
      
      // Check again after content is fully loaded
      window.addEventListener('load', updateCurrentSection);
      
      // Create helper for debugging
      window.debugScrollSpy = () => {
        updateCurrentSection();
        console.log('Current section:', currentSection);
        console.log('Overview visible:', overviewVisible);
        
        // Show positions of all sections
        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (section) {
            const rect = section.getBoundingClientRect();
            console.log(`${id}: top=${rect.top.toFixed(0)}, bottom=${rect.bottom.toFixed(0)}`);
          }
        }
      };
    });
    
    onDestroy(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', updateCurrentSection);
      if (window.debugScrollSpy) delete window.debugScrollSpy;
    });
  </script>
  
  <!-- No visible content, this is a utility component -->
  <slot></slot>