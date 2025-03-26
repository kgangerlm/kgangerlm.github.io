<!-- src/App.svelte -->
<script>
  import { onMount } from 'svelte';
  import DayCard from './components/DayCard.svelte';
  import DayDetail from './components/DayDetail.svelte';
  
  let tripData = {};
  let daysData = [];
  let currentDay = null;
  let isLoading = true;
  let loadError = null;

  onMount(async () => {
    console.log("App component mounted");
    try {
      // Load trip overview data
      console.log("Fetching trip overview data...");
      const tripResponse = await fetch('data/trip-overview.json');
      if (!tripResponse.ok) {
        throw new Error(`Failed to load trip overview data: ${tripResponse.status}`);
      }
      tripData = await tripResponse.json();
      console.log("Trip overview data loaded successfully");
      
      // Load all day data files with error handling
      const dayPromises = [];
      for (let i = 1; i <= tripData.totalDays; i++) {
        console.log(`Fetching day ${i} data...`);
        dayPromises.push(
          fetch(`data/day${i}.json`)
            .then(async res => {
              if (!res.ok) {
                console.warn(`Day ${i} data not found (${res.status}). This day will be skipped.`);
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
            .catch(err => {
              console.error(`Error loading day ${i} data:`, err);
              return null; // Return null for errors
            })
        );
      }
      
      // Filter out null values (days that weren't found or failed to load)
      const daysResults = await Promise.all(dayPromises);
      daysData = daysResults.filter(day => day !== null);
      console.log(`Successfully loaded ${daysData.length} days of data`);
      
      if (daysData.length === 0) {
        throw new Error('No day data could be loaded');
      }
      
      isLoading = false;
    } catch (error) {
      console.error('Error loading data:', error);
      loadError = error.message || 'Failed to load trip data';
      isLoading = false;
    }
  });

  function scrollToDay(dayId) {
    const element = document.getElementById(dayId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    currentDay = dayId;
  }
</script>

<div class="app">
  {#if isLoading}
    <div class="loading">Loading trip data...</div>
  {:else if loadError}
    <div class="error-container">
      <h2>Error Loading Data</h2>
      <p>{loadError}</p>
      <p>Please check that all data files are available and refresh the page.</p>
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
            <li><strong>Duration:</strong> {tripData.duration} ({tripData.dateRange})</li>
            <li><strong>Travelers:</strong> {tripData.travelers}</li>
            <li><strong>Vehicle:</strong> {tripData.vehicle}</li>
            <li><strong>Route:</strong> {tripData.route}</li>
            <li><strong>Total Distance:</strong> {tripData.totalDistance.km} km ({tripData.totalDistance.miles} miles)</li>
          </ul>
        </div>
        
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
    
    <!-- Map Section -->
    <section class="map-section">
      <div class="container">
        <h2 class="section-title">Trip Overview Map</h2>
        <div class="map-container">
          <iframe src="{tripData.mapUrl}" width="100%" height="450" style="border:0; border-radius: 10px;" allowfullscreen="" loading="lazy"></iframe>
         
        </div>
      </div>
    </section>
    
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
                              <a href={subitem.url} target="_blank">{subitem.name}</a>
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
      </div>
    </footer>
  {/if}
</div>

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
</style>