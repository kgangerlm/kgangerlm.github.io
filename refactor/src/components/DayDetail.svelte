<script>
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
      {#each day.schedule as item}
        <div class="activity-item">
          <span class="activity-time">{item.time}</span>
          <div class="activity-content">
            <div class="activity-title">{item.title}</div>
            {#if item.description}
              <div class="activity-desc">{item.description}</div>
            {/if}
            {#if item.link}
              <div class="activity-links">
                <a href={item.link} target="_blank">More Info</a>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Highlights Section -->
    <div class="highlights-section">
      <h4>Key Highlights of the Day</h4>
      <ul class="highlights-list">
        {#each day.highlights as highlight}
          <li>{highlight.title}: {highlight.description}</li>
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
