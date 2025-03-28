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
              {#if highlight.link}
                <a href={highlight.link} target="_blank" rel="noopener"><strong>{highlight.title}:</strong></a> {highlight.description}
              {:else}
                <strong>{highlight.title}:</strong> {highlight.description}
              {/if}
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
            {#if alt.link}
              <a href={alt.link} target="_blank" rel="noopener"><strong>{alt.title}:</strong></a> {alt.description}
            {:else}
              <strong>{alt.title}:</strong> {alt.description}
            {/if}
            {#if alt.isGem}<span class="badge gem-badge">💎 Hidden Gem</span>{/if}
            {#if alt.isUserSelected}<span class="badge selected-badge">✓ Selected</span>{/if}
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
            {#if alt.link}
              <a href={alt.link} target="_blank" rel="noopener"><strong>{alt.title}:</strong></a> {alt.description}
            {:else}
              <strong>{alt.title}:</strong> {alt.description}
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Hot Springs Section -->
    {#if day.hotSprings && day.hotSprings.length > 0}
      <div class="hotsprings-section">
        <h4><span class="hotspring-icon">♨️</span> Hot Springs</h4>
        <ul class="hotsprings-list">
          {#each day.hotSprings as spring}
            <li class={spring.isEveningRelaxation ? 'evening-relaxation' : ''}>
              {#if spring.link}
                <a href={spring.link} target="_blank" rel="noopener"><strong>{spring.name}:</strong></a> {spring.description}
              {:else}
                <strong>{spring.name}:</strong> {spring.description}
              {/if}
              <div class="hotspring-details">
                <span class="hotspring-location"><strong>Location:</strong> {spring.location}</span>
                <span class="hotspring-cost"><strong>Cost:</strong> {spring.cost}</span>
                {#if spring.isEveningRelaxation}
                  <span class="evening-badge">✨ Evening Relaxation</span>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    <!-- Tips & Notes -->
    {#if day.tip}
      <div class="tip-box">{day.tip}</div>
    {/if}
    
    {#if day.notes}
      <div class="notes-container">
        <h4>Notes</h4>
        {#if typeof day.notes === 'string'}
          <p>{day.notes}</p>
        {:else if Array.isArray(day.notes) && day.notes.length > 0}
          <ul class="notes-list">
            {#each day.notes as note}
              <li>{note}</li>
            {/each}
          </ul>
        {/if}
      </div>
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
  
  .notes-container {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 12px;
    margin: 25px 0;
    border-left: 3px solid var(--primary);
  }
  
  .notes-container h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--primary-dark);
  }
  
  .notes-list {
    margin-top: 10px;
    margin-left: 20px;
    list-style-type: disc;
  }
  
  .notes-list li {
    margin-bottom: 8px;
  }
  
  /* Hot Springs Section Styles */
  .hotsprings-section {
    padding: 25px;
    background-color: #e9f7fb;
    border-radius: 12px;
    margin: 25px 0;
    border-left: 4px solid #17a2b8;
    position: relative;
    overflow: hidden;
  }
  
  .hotsprings-section:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(23, 162, 184, 0.15) 20%, rgba(23, 162, 184, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  .hotsprings-section h4 {
    display: flex;
    align-items: center;
    font-size: 1.3em;
    margin-bottom: 15px;
    color: #17a2b8;
  }
  
  .hotspring-icon {
    font-size: 1.2em;
    margin-right: 10px;
  }
  
  .hotsprings-list {
    list-style: none;
    padding: 0;
  }
  
  .hotsprings-list li {
    position: relative;
    padding: 15px;
    margin-bottom: 15px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .hotsprings-list li:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .hotsprings-list li.evening-relaxation {
    background: linear-gradient(to right, white, #f8f4ff);
    border-left: 3px solid #9c27b0;
  }
  
  .hotspring-details {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 8px;
    font-size: 0.9em;
    color: #666;
  }
  
  .evening-badge {
    display: inline-block;
    background-color: #9c27b0;
    color: white;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.75em;
    margin-left: auto;
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
</style>