<!-- src/components/DayCard.svelte -->
<script>
  export let day;
  export let isActive = false;
  export let onClick;
</script>

<div class="itinerary-card {isActive ? 'active' : ''}" on:click={onClick}>
  <div class="card-header">
    <h3>Day {day.dayNumber}</h3>
    <div class="card-date">{day.date}</div>
  </div>
  <div class="card-content">
    <div class="card-highlight">{day.emoji} {day.title}</div>
    <div class="card-route"><strong>Route:</strong> {day.route.from} → {day.route.to}</div>
    <p>{day.summary}</p>
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
    background-color: var(--primary);
    color: white;
    padding: 15px 20px;
    font-weight: 600;
  }

  .card-header h3 {
    margin: 0;
    font-size: 1.2em;
  }

  .card-date {
    font-size: 0.85em;
    opacity: 0.9;
    font-weight: 400;
  }

  .card-content {
    padding: 20px;
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
  }

  .card-details:hover {
    background-color: var(--primary-dark);
  }
</style>