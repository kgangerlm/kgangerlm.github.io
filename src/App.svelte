<!-- src/App.svelte -->
<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import DayCard from "./components/DayCard.svelte";
  import DayDetail from "./components/DayDetail.svelte";
  import SwipeHandler from "./components/SwipeHandler.svelte";
  import SwipeTutorial from "./components/SwipeTutorial.svelte";
  import ScrollSpy from "./components/ScrollSpy.svelte";

  let tripData = {};
  let daysData = [];
  let currentDay = null;
  let currentDayIndex = 0;
  let isLoading = true;
  let loadError = null;

  // Navigation state
  let showNavigation = false;
  let isExpanded = false;
  let sectionIds = []; // Will be populated with day IDs
  let isScrolling = false; // Flag to prevent navigation updates during programmatic scrolling

  // Toggle navigation expansion state
  function toggleExpansion() {
    isExpanded = !isExpanded;
  }

  // Handle section change from scroll spy
  function handleSectionChange(event) {
    const { section, inOverview } = event.detail;

    // If we're programmatically scrolling, don't update current day based on scroll
    if (isScrolling) return;

    // Hide navigation when in overview section
    if (inOverview) {
      showNavigation = false;
      return;
    }

    // Update current day if it changed
    if (section !== null && section !== currentDay) {
      currentDay = section;
      currentDayIndex = daysData.findIndex((day) => day.id === section);

      // Make sure navigation is shown
      showNavigation = true;

      // If navigation just appeared, show it expanded initially
      if (!showNavigation) {
        isExpanded = true;
        autoMinimizeNavigation();
      }

      console.log(`Now viewing day ${currentDayIndex + 1}: ${section}`);
    }
  }

  // Auto-minimize navigation after a delay
  function autoMinimizeNavigation() {
    clearTimeout(window.autoMinimizeTimer);
    window.autoMinimizeTimer = setTimeout(() => {
      isExpanded = false;
    }, 4000);
  }

  onMount(async () => {
    console.log("App component mounted");
    try {
      // Load trip overview data
      const tripResponse = await fetch("data/trip-overview.json");
      if (!tripResponse.ok) {
        throw new Error(
          `Failed to load trip overview data: ${tripResponse.status}`
        );
      }
      tripData = await tripResponse.json();

      // Load all day data files with error handling
      const dayPromises = [];
      for (let i = 1; i <= tripData.totalDays; i++) {
        dayPromises.push(
          fetch(`data/day${i}.json`)
            .then(async (res) => {
              if (!res.ok) {
                console.warn(`Day ${i} data not found (${res.status})`);
                return null;
              }
              try {
                const dayData = await res.json();
                return dayData;
              } catch (parseError) {
                console.error(`Error parsing day ${i} JSON:`, parseError);
                return null;
              }
            })
            .catch((err) => {
              console.error(`Error loading day ${i} data:`, err);
              return null;
            })
        );
      }

      // Filter out null values (days that weren't found or failed to load)
      const daysResults = await Promise.all(dayPromises);
      daysData = daysResults.filter((day) => day !== null);

      if (daysData.length === 0) {
        throw new Error("No day data could be loaded");
      }

      // Set up section IDs for scroll detection
      sectionIds = daysData.map((day) => day.id);

      isLoading = false;

      // Add debug key handler
      window.addEventListener("keydown", (e) => {
        if (e.key === "d" && e.ctrlKey) {
          console.log("Current navigation state:", {
            currentDay,
            currentDayIndex,
            showNavigation,
            isExpanded,
          });

          // Run debug
          if (window.debugScrollSpy) {
            window.debugScrollSpy();
          }
        }
      });
    } catch (error) {
      console.error("Error loading data:", error);
      loadError = error.message || "Failed to load trip data";
      isLoading = false;
    }
  });

  function scrollToDay(dayId) {
    const element = document.getElementById(dayId);
    if (element) {
      // Set scrolling flag to prevent scroll event handling during programmatic scroll
      isScrolling = true;

      // Update our state directly
      currentDay = dayId;
      currentDayIndex = daysData.findIndex((day) => day.id === dayId);
      showNavigation = true;
      isExpanded = true;

      // Auto-minimize after a delay
      autoMinimizeNavigation();

      // Scroll to the element
      element.scrollIntoView({ behavior: "smooth" });

      // Clear the scrolling flag after scrolling should be complete
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  }

  function goToNextDay() {
    if (currentDayIndex < daysData.length - 1) {
      scrollToDay(daysData[currentDayIndex + 1].id);
    }
  }

  function goToPrevDay() {
    if (currentDayIndex > 0) {
      scrollToDay(daysData[currentDayIndex - 1].id);
    }
  }

  // Handle swipe navigation
  function handleSwipe(event) {
    const { direction } = event.detail;

    if (direction === "left") {
      // Move to next day (if available)
      if (currentDayIndex < daysData.length - 1) {
        scrollToDay(daysData[currentDayIndex + 1].id);
      }
    } else if (direction === "right") {
      // Move to previous day (if available)
      if (currentDayIndex > 0) {
        scrollToDay(daysData[currentDayIndex - 1].id);
      }
    }
  }
</script>

<SwipeHandler on:swipe={handleSwipe}>
  <ScrollSpy {sectionIds} on:change={handleSectionChange} offset={100}>
    <div class="app">
      <SwipeTutorial showOnce={true} delay={2000} />
      {#if isLoading}
        <div class="loading">Loading trip data...</div>
      {:else if loadError}
        <div class="error-container">
          <h2>Error Loading Data</h2>
          <p>{loadError}</p>
          <p>
            Please check that all data files are available and refresh the page.
          </p>
        </div>
      {:else}
        <!-- Header -->
        <header>
          <div class="container">
            <h1>{tripData.title}</h1>
            <div class="subtitle">{tripData.dateRange}</div>
          </div>
        </header>

        <!-- Trip Overview -->
        <section class="overview-section">
          <div class="container">
            <h2 class="section-title">Trip Overview</h2>

            <div class="daily-summary">
              <div class="summary-title">Adventure Details</div>
              <ul class="drive-info">
                <li>
                  <strong>Duration:</strong>
                  {tripData.duration} ({tripData.dateRange})
                </li>
                <li><strong>Travelers:</strong> {tripData.travelers}</li>
                <li><strong>Vehicle:</strong> {tripData.vehicle}</li>
                <li><strong>Route:</strong> {tripData.route}</li>
                <li>
                  <strong>Total Distance:</strong>
                  {tripData.totalDistance.km} km ({tripData.totalDistance.miles}
                  miles)
                </li>
              </ul>
            </div>
            <!-- Map Section -->
            <section class="map-section">
              <div class="container">
                <h2 class="section-title">Trip Overview Map</h2>
                <div class="map-container">
                  <iframe
                    src={tripData.mapUrl}
                    width="100%"
                    height="450"
                    style="border:0; border-radius: 10px;"
                    allowfullscreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </section>
            <!-- Day Cards for Navigation -->
            <div class="itinerary-grid">
              {#each daysData as day}
                <DayCard
                  {day}
                  isActive={currentDay === day.id}
                  onClick={() => scrollToDay(day.id)}
                />
              {/each}
            </div>
          </div>
        </section>

        <!-- Day Navigation - Only visible when viewing day details -->
        {#if showNavigation}
          <div
            class="day-navigation {isExpanded ? 'expanded' : 'minimized'}"
            transition:fade={{ duration: 300 }}
          >
            {#if isExpanded}
              <!-- Expanded Navigation -->
              <button
                class="nav-btn prev-btn"
                on:click={goToPrevDay}
                disabled={currentDayIndex === 0}
              >
                <span class="nav-arrow">←</span>
                {#if currentDayIndex > 0}
                  <span class="nav-day-info">
                    <span class="nav-day-number"
                      >Day {daysData[currentDayIndex - 1].dayNumber}</span
                    >
                    <span class="nav-day-title"
                      >{daysData[currentDayIndex - 1].title}</span
                    >
                  </span>
                {/if}
              </button>

              <div class="swipe-indicator">
                <span class="current-page">{currentDayIndex + 1}</span>
                <span class="total-pages">/ {daysData.length}</span>
                <span class="swipe-hint">
                  <span class="instruction-icon">👆👆</span>
                </span>
              </div>

              <button
                class="nav-btn next-btn"
                on:click={goToNextDay}
                disabled={currentDayIndex === daysData.length - 1}
              >
                {#if currentDayIndex < daysData.length - 1}
                  <span class="nav-day-info">
                    <span class="nav-day-number"
                      >Day {daysData[currentDayIndex + 1].dayNumber}</span
                    >
                    <span class="nav-day-title"
                      >{daysData[currentDayIndex + 1].title}</span
                    >
                  </span>
                {/if}
                <span class="nav-arrow">→</span>
              </button>

              <button class="minimize-btn" on:click={toggleExpansion}>
                <span class="minimize-icon">↓</span>
              </button>
            {:else}
              <!-- Minimized Navigation -->
              <button class="expand-btn" on:click={toggleExpansion}>
                <span class="day-indicator">
                  <span class="day-icon">📍</span>
                  <span class="day-current"
                    >Day {daysData[currentDayIndex].dayNumber}</span
                  >
                </span>
                <span class="expand-icon">↑</span>
              </button>
            {/if}
          </div>
        {/if}

        <!-- Day Details Sections -->
        {#each daysData as day}
          <DayDetail {day} />
        {/each}

        <!-- Resources Section -->
        <section class="resources-section">
          <div class="container">
            <h2 class="section-title">Essential Resources</h2>

            <div class="resources-grid">
              {#each tripData.resources as resource}
                <div class="resource-card">
                  <h3>{resource.title}</h3>
                  <ul>
                    {#each resource.items as item}
                      <li>
                        {#if item.url}
                          <a href={item.url} target="_blank">{item.name}</a>
                        {:else}
                          <strong>{item.name}:</strong> {item.description}
                        {/if}

                        {#if item.note}
                          <span class="note">{item.note}</span>
                        {/if}

                        {#if item.subitems && item.subitems.length > 0}
                          <ul>
                            {#each item.subitems as subitem}
                              <li>
                                {#if subitem.url}
                                  <a href={subitem.url} target="_blank"
                                    >{subitem.name}</a
                                  >
                                {:else}
                                  {subitem.name}{#if subitem.description}: {subitem.description}{/if}
                                {/if}
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>{tripData.title} | {tripData.dateRange}</p>
            <p>Safe travels and unforgettable adventures!</p>
            <p class="swipe-instruction">
              <span class="instruction-icon">👆👆</span>
              Use two-finger swipe to navigate between days
            </p>
          </div>
        </footer>
      {/if}
    </div>
  </ScrollSpy>
</SwipeHandler>

<style>
  .loading {
    text-align: center;
    padding: 50px;
    font-size: 1.5em;
    color: var(--secondary);
  }

  .error-container {
    max-width: 800px;
    margin: 100px auto;
    padding: 30px;
    background-color: #ffebee;
    border-left: 5px solid #f44336;
    color: #b71c1c;
    border-radius: 4px;
    text-align: center;
  }

  .day-navigation {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(44, 62, 80, 0.85);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    z-index: 100;
    border-radius: 50px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition:
      transform 0.3s,
      width 0.3s,
      height 0.3s,
      bottom 0.3s;
  }

  /* Expanded state */
  .day-navigation.expanded {
    bottom: 20px;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    min-width: 280px;
    width: auto;
    max-width: 90%;
  }

  .day-navigation.expanded:hover {
    transform: translateX(-50%) translateY(-5px);
  }

  /* Minimized state */
  .day-navigation.minimized {
    bottom: 0;
    padding: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: auto;
    max-width: 320px;
  }

  .expand-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    color: white;
    padding: 8px 16px;
    cursor: pointer;
    width: 100%;
    font-size: 0.9em;
    gap: 12px;
    transition: transform 0.2s;
  }

  .expand-btn:hover {
    transform: translateY(-2px);
  }

  .day-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .day-icon {
    font-size: 1.2em;
  }

  .day-current {
    font-weight: 600;
  }

  .expand-icon {
    font-size: 1.2em;
    opacity: 0.8;
  }

  .minimize-btn {
    position: absolute;
    top: -12px;
    right: 10px;
    background-color: rgba(44, 62, 80, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8em;
    cursor: pointer;
    transition: transform 0.2s;
    padding: 0;
  }

  .minimize-btn:hover {
    transform: scale(1.1);
  }

  .nav-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 0.9em;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 40px;
    max-width: 150px;
    overflow: hidden;
  }

  .nav-btn:hover:not(:disabled) {
    background-color: var(--primary-dark);
    transform: scale(1.05);
    max-width: 200px;
  }

  .nav-btn:disabled {
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    padding: 8px;
    min-width: 32px;
  }

  .nav-arrow {
    font-size: 1.2em;
    flex-shrink: 0;
  }

  .nav-day-info {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .next-btn .nav-day-info {
    text-align: right;
  }

  .nav-day-number {
    font-size: 0.75em;
    opacity: 0.9;
  }

  .nav-day-title {
    font-size: 0.85em;
    font-weight: 600;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .swipe-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 0 15px;
  }

  .current-page {
    font-weight: bold;
    color: white;
    font-size: 1.4em;
    line-height: 1;
  }

  .total-pages {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9em;
  }

  .swipe-hint {
    margin-top: 3px;
    animation: pulse 2s infinite;
  }

  .instruction-icon {
    font-size: 0.9em;
    color: rgba(255, 255, 255, 0.9);
  }

  .swipe-instruction {
    margin-top: 15px;
    font-size: 0.9em;
    color: var(--gray);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  @keyframes pulse {
    0% {
      opacity: 0.4;
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.4;
      transform: scale(0.95);
    }
  }

  /* For smaller screens, simplify the navigation */
  @media (max-width: 480px) {
    .nav-day-info {
      display: none;
    }

    .nav-btn {
      min-width: 32px;
      padding: 8px 12px;
    }

    .nav-btn:hover:not(:disabled) {
      max-width: 150px;
    }

    .nav-btn:hover:not(:disabled) .nav-day-info {
      display: flex;
    }
  }
</style>
