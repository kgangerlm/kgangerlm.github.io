<!-- src/App.svelte -->
<script>
  import { onMount } from "svelte";
  import DayCard from "./components/DayCard.svelte";
  import DayDetail from "./components/DayDetail.svelte";
  import SwipeHandler from "./components/SwipeHandler.svelte";
  import SwipeTutorial from "./components/SwipeTutorial.svelte";

  let tripData = {};
  let daysData = [];
  let currentDay = null;
  let currentDayIndex = 0;
  let isLoading = true;
  let loadError = null;

  onMount(async () => {
    console.log("App component mounted");
    try {
      // Load trip overview data
      console.log("Fetching trip overview data...");
      const tripResponse = await fetch("data/trip-overview.json");
      if (!tripResponse.ok) {
        throw new Error(
          `Failed to load trip overview data: ${tripResponse.status}`
        );
      }
      tripData = await tripResponse.json();
      console.log("Trip overview data loaded successfully");

      // Load all day data files with error handling
      const dayPromises = [];
      for (let i = 1; i <= tripData.totalDays; i++) {
        console.log(`Fetching day ${i} data...`);
        dayPromises.push(
          fetch(`data/day${i}.json`)
            .then(async (res) => {
              if (!res.ok) {
                console.warn(
                  `Day ${i} data not found (${res.status}). This day will be skipped.`
                );
                return null; // Return null for days that aren't found
              }
              try {
                const dayData = await res.json();
                console.log(`Day ${i} data loaded successfully`);
                return dayData;
              } catch (parseError) {
                console.error(`Error parsing day ${i} JSON:`, parseError);
                return null;
              }
            })
            .catch((err) => {
              console.error(`Error loading day ${i} data:`, err);
              return null; // Return null for errors
            })
        );
      }

      // Filter out null values (days that weren't found or failed to load)
      const daysResults = await Promise.all(dayPromises);
      daysData = daysResults.filter((day) => day !== null);
      console.log(`Successfully loaded ${daysData.length} days of data`);

      if (daysData.length === 0) {
        throw new Error("No day data could be loaded");
      }

      // Set initial day
      if (daysData.length > 0) {
        currentDay = daysData[0].id;
        currentDayIndex = 0;
      }

      isLoading = false;
    } catch (error) {
      console.error("Error loading data:", error);
      loadError = error.message || "Failed to load trip data";
      isLoading = false;
    }
  });

  function scrollToDay(dayId) {
    const element = document.getElementById(dayId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    currentDay = dayId;

    // Update current day index
    currentDayIndex = daysData.findIndex((day) => day.id === dayId);
  }

  function handleSwipe(event) {
    const { direction } = event.detail;

    if (direction === "left") {
      // Move to next day (if available)
      if (currentDayIndex < daysData.length - 1) {
        const nextDay = daysData[currentDayIndex + 1];
        scrollToDay(nextDay.id);
      }
    } else if (direction === "right") {
      // Move to previous day (if available)
      if (currentDayIndex > 0) {
        const prevDay = daysData[currentDayIndex - 1];
        scrollToDay(prevDay.id);
      }
    }
  }

  // For navigation buttons
  function goToNextDay() {
    if (currentDayIndex < daysData.length - 1) {
      const nextDay = daysData[currentDayIndex + 1];
      scrollToDay(nextDay.id);
    }
  }

  function goToPrevDay() {
    if (currentDayIndex > 0) {
      const prevDay = daysData[currentDayIndex - 1];
      scrollToDay(prevDay.id);
    }
  }
</script>

<SwipeHandler on:swipe={handleSwipe}>
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
                {tripData.totalDistance.km} km ({tripData.totalDistance.miles} miles)
              </li>
            </ul>
          </div>

          <!-- Map Section -->
          <section class="map-section">
            <div class="container">
              <h2 class="section-title">Trip Overview Map</h2>
              <div class="map-container">
                <iframe
                title="Trip Overview Map"
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

      <!-- Day Navigation Buttons - Visible only on mobile -->
      <div class="day-navigation">
        <button
          class="nav-btn prev-btn"
          on:click={goToPrevDay}
          disabled={currentDayIndex === 0}
        >
          ← Previous Day
        </button>
        <div class="swipe-indicator">
          <span class="current-page">{currentDayIndex + 1}</span>
          <span class="total-pages">/ {daysData.length}</span>
        </div>
        <button
          class="nav-btn next-btn"
          on:click={goToNextDay}
          disabled={currentDayIndex === daysData.length - 1}
        >
          Next Day →
        </button>
      </div>

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
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    z-index: 100;
    margin-top: 20px;
    border-top: 1px solid var(--gray-light);
  }

  .nav-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .nav-btn:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }

  .nav-btn:disabled {
    background-color: var(--gray-light);
    color: var(--gray);
    cursor: not-allowed;
  }

  .swipe-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .current-page {
    font-weight: bold;
    color: var(--primary-dark);
    font-size: 1.2em;
  }

  .total-pages {
    color: var(--gray);
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

  .instruction-icon {
    font-size: 1.2em;
  }

  /* Hide navigation buttons on desktop */
  @media (min-width: 992px) {
    .day-navigation {
      display: none;
    }
  }
</style>
