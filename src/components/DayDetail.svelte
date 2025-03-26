<!-- src/components/DayDetail.svelte -->
<script>
  import ActivityItem from './ActivityItem.svelte';
  export let day;
</script>

<section id={day.id} class="day-section">
  <div class="container">
    <div class="day-header">
      <h2 class="day-title">{day.emoji} Day {day.dayNumber}: {day.title}</h2>
      <div class="day-date">{day.date}</div>
    </div>
    
    <img src={day.image.src} alt={day.image.alt} class="day-image">
    
    <div class="quote-box">
      "{day.quote.text}" - {day.quote.author}
    </div>
    
    <div class="daily-summary">
      <div class="summary-title">Day Summary</div>
      <p>{day.summary}</p>
      
      <div class="drive-info">
        <strong>Total Driving:</strong> ~{day.driving.total.distance.km} km ({day.driving.total.distance.miles} miles), {day.driving.total.time}
        <ul>
          {#each day.driving.segments as segment}
            <li>{segment.from} to {segment.to}: ~{segment.distance.km} km ({segment.distance.miles} miles), {segment.time}</li>
          {/each}
        </ul>
      </div>
    </div>
    
    <div class="map-container">
      {@html day.mapUrl}
    </div>
    
    <div class="day-schedule">
      <h3 class="section-heading">Daily Schedule</h3>
      <div class="activity-timeline">
        {#each day.schedule as item}
          <ActivityItem {item} />
        {/each}
      </div>
    </div>
    
    <!-- Highlights Section -->
    <div class="highlights-section">
      <h4>Key Highlights of the Day</h4>
      <ul class="highlights-list">
        {#each day.highlights as highlight, i}
          <li>
            {#if typeof highlight === 'string'}
              {highlight}
            {:else}
              <strong>{highlight.title}:</strong> {highlight.description}
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Accommodations Section -->
    <div class="accommodations-section">
      <h4>Accommodations</h4>
      <div class="accommodations-details">
        <strong>{day.accommodation.name}</strong>
        <br>
        {day.accommodation.address}
        <br>
        Cost: {day.accommodation.cost}
        <br>
        {day.accommodation.roomType}
        {#if day.accommodation.notes}
          <br>
          Note: {day.accommodation.notes}
        {/if}
      </div>
    </div>
    
    <!-- Alternatives Section -->
    <div class="alternatives-section">
      <h4>Alternative Activities</h4>
      <ul class="alternatives-list">
        {#each day.alternatives as alt}
          <li>
            <strong>{alt.title}:</strong> {alt.description}
            {#if alt.isGem}<span class="badge gem-badge">💎 Hidden Gem</span>{/if}
            {#if alt.isUserSelected}<span class="badge selected-badge">✓ Selected</span>{/if}
            {#if alt.link}
              <br>
              <a href={alt.link} target="_blank">More Info</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Bad Weather Alternatives -->
    <div class="weather-section">
      <h4>Bad Weather Alternatives</h4>
      <ul class="weather-list">
        {#each day.badWeatherAlternatives as alt}
          <li>
            <strong>{alt.title}:</strong> {alt.description}
            {#if alt.link}
              <br>
              <a href={alt.link} target="_blank">More Info</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Tips & Notes -->
    {#if day.tip}
      <div class="tip-box">{day.tip}</div>
    {/if}
    
    {#if day.notes}
      <div class="notes-box">{day.notes}</div>
    {/if}
  </div>
</section>

<style>
  .section-heading {
    font-size: 1.4em;
    color: var(--primary-dark);
    margin-bottom: 20px;
    position: relative;
    padding-left: 20px;
  }

  .section-heading:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background-color: var(--primary);
    border-radius: 50%;
  }
  
  .activity-timeline {
    position: relative;
    padding-left: 30px;
  }

  .activity-timeline:before {
    content: '';
    position: absolute;
    left: 5px;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: var(--gray-light);
  }
  
  .badge {
    font-size: 0.75em;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  
  .gem-badge {
    background-color: var(--primary);
    color: white;
  }
  
  .selected-badge {
    background-color: var(--success);
    color: white;
  }
</style>