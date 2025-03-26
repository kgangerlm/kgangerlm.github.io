<!-- src/components/DayCard.svelte -->
<script>
  export let day;
  export let isActive = false;
  export let onClick;
</script>

<div class="itinerary-card {isActive ? 'active' : ''}" on:click={onClick}>
  <div class="card-header" style="background-image: url({day.image && day.image.src})">
    <div class="header-content">
      <h3>Day {day.dayNumber}</h3>
      <div class="card-date">{day.date}</div>
    </div>
  </div>
  <div class="card-content">
    <div class="card-highlight">{day.emoji} {day.title}</div>
    <div class="card-route"><strong>Route:</strong> {day.route.from} → {day.route.to}</div>
    <p class="card-summary">{day.shortSummary || day.summary}</p>
    
    {#if day.highlights && day.highlights.length > 0}
      <div class="card-highlights">
        <h4>Key Highlights:</h4>
        <ul>
          {#each day.highlights.slice(0, 3) as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
    {/if}
    
    {#if day.accommodation && day.accommodation.name}
      <div class="card-accommodation">
        <div class="accommodation-icon">🏠</div>
        <div class="accommodation-details">
          <span class="accommodation-label">Stay at:</span>
          <span class="accommodation-name">{day.accommodation.name}</span>
        </div>
      </div>
    {/if}
    
    <button class="card-details" on:click|stopPropagation={onClick}>View Details</button>
  </div>
</div>

<style>
  .itinerary-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05), 0 6px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .itinerary-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.05);
  }
  
  .itinerary-card.active {
    border: 2px solid var(--primary);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.05);
  }

  .card-header {
    position: relative;
    height: 120px;
    background-color: var(--primary);
    color: white;
    background-size: cover;
    background-position: center;
    overflow: hidden;
  }

  .card-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  }

  .header-content {
    position: relative;
    z-index: 2;
    padding: 15px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .card-header h3 {
    margin: 0;
    font-size: 1.2em;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  .card-date {
    font-size: 0.85em;
    opacity: 0.9;
    font-weight: 400;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }

  .card-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .card-highlight {
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 10px;
  }

  .card-route {
    font-size: 0.9em;
    color: var(--gray);
    margin-bottom: 15px;
  }

  .card-route strong {
    color: var(--secondary);
  }
  
  .card-summary {
    margin-bottom: 15px;
    flex-grow: 1;
    font-size: 0.95em;
  }
  
  .card-highlights {
    background-color: var(--gray-light);
    border-radius: 8px;
    padding: 12px 15px;
    margin-bottom: 15px;
  }
  
  .card-highlights h4 {
    font-size: 0.95em;
    margin: 0 0 8px 0;
    color: var(--primary-dark);
  }
  
  .card-highlights ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .card-highlights li {
    font-size: 0.9em;
    margin-bottom: 5px;
  }
  
  .card-highlights li:last-child {
    margin-bottom: 0;
  }

  .card-accommodation {
    display: flex;
    align-items: center;
    background-color: var(--light-blue);
    border-radius: 8px;
    padding: 12px 15px;
    margin-bottom: 15px;
  }
  
  .accommodation-icon {
    font-size: 1.5em;
    margin-right: 10px;
    color: var(--primary);
  }
  
  .accommodation-details {
    display: flex;
    flex-direction: column;
  }
  
  .accommodation-label {
    font-size: 0.8em;
    color: var(--gray);
  }
  
  .accommodation-name {
    font-weight: 600;
    color: var(--primary-dark);
  }

  .card-details {
    display: inline-block;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 0.9em;
    transition: background-color 0.2s ease;
    margin-top: 10px;
    border: none;
    cursor: pointer;
    align-self: flex-start;
  }

  .card-details:hover {
    background-color: var(--primary-dark);
  }
</style>