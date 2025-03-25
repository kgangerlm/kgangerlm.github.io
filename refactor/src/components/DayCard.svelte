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
