<!-- src/components/ActivityItem.svelte -->
<script>
  export let item;
  
  // Handle backward compatibility by providing defaults
  const typeEmoji = item.typeEmoji || '';
  const isFeatured = item.isFeatured || false;
  const isGem = item.isGem || false;
  const isUserSelected = item.isUserSelected || false;
  const details = item.details || [];
  const quickStops = item.quickStops || [];
  const cost = item.cost !== undefined ? item.cost : null;
  
  // If it's an older format, links might be just a string
  const links = item.links || (item.link ? [{ text: "More Info", url: item.link }] : []);
</script>

<div class="activity-item">
  <span class="activity-time">{item.time}</span>
  <div class="activity-content {isFeatured ? 'featured' : ''} {isGem ? 'gem' : ''} {isUserSelected ? 'user-selected' : ''}">
    <!-- Badges row -->
    {#if isFeatured || isGem || isUserSelected}
      <div class="badge-container">
        {#if isFeatured}<span class="badge featured-badge">⭐ Featured</span>{/if}
        {#if isGem}<span class="badge gem-badge">💎 Hidden Gem</span>{/if}
        {#if isUserSelected}<span class="badge selected-badge">✓ Selected</span>{/if}
      </div>
    {/if}
    
    <!-- Title with type emoji -->
    <div class="activity-title">
      {#if typeEmoji}<span class="type-emoji">{typeEmoji}</span>{/if}
      {item.title}
    </div>
    
    <!-- Description -->
    {#if item.description}
      <div class="activity-desc">{item.description}</div>
    {/if}
    
    <!-- Details -->
    {#if details.length > 0}
      <ul class="details-list">
        {#each details as detail}
          <li>{detail}</li>
        {/each}
      </ul>
    {/if}
    
    <!-- Cost -->
    {#if cost !== null}
      <div class="activity-cost">
        <span class="cost-label">Cost:</span> 
        <span class="cost-value">{cost || "Free"}</span>
      </div>
    {/if}
    
    <!-- Links -->
    {#if links.length > 0}
      <div class="activity-links">
        {#each links as link}
          <a href={link.url} target="_blank">{link.text}</a>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Quick stops that follow this activity -->
{#if quickStops.length > 0}
  <div class="quick-stops-container">
    <div class="quick-stops-header">Quick Stops</div>
    <ul class="quick-stops-list">
      {#each quickStops as stop}
        <li>{stop}</li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .activity-item {
    position: relative;
    padding-bottom: 25px;
  }
  
  .activity-time {
    position: absolute;
    left: -30px;
    top: 0;
    background-color: var(--primary);
    color: white;
    font-size: 0.8em;
    padding: 2px 8px;
    border-radius: 50px;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  
  .activity-content {
    background-color: var(--light);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    border-left: 3px solid transparent;
  }
  
  .activity-content.featured {
    border-left: 3px solid var(--warning);
    background-color: var(--light-yellow);
  }
  
  .activity-content.gem {
    border-left: 3px solid var(--primary);
    background-color: var(--light-blue);
  }
  
  .activity-content.user-selected {
    border-left: 3px solid var(--success);
    background-color: #e8f5e9;
  }
  
  /* Combined styling for multiple flags */
  .activity-content.featured.gem,
  .activity-content.featured.user-selected,
  .activity-content.gem.user-selected,
  .activity-content.featured.gem.user-selected {
    border-left: 3px solid var(--accent);
    background: linear-gradient(to right, var(--light-yellow), var(--light-blue), #e8f5e9);
    background-size: 600% 100%;
    animation: gradient-shift 8s ease infinite;
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 8px;
  }
  
  .badge {
    font-size: 0.75em;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  
  .featured-badge {
    background-color: var(--warning);
    color: #856404;
  }
  
  .gem-badge {
    background-color: var(--primary);
    color: white;
  }
  
  .selected-badge {
    background-color: var(--success);
    color: white;
  }
  
  .activity-title {
    font-weight: 600;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .type-emoji {
    font-size: 1.2em;
  }
  
  .activity-desc {
    font-size: 0.95em;
    margin-bottom: 8px;
  }
  
  .details-list {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  .details-list li {
    margin-bottom: 4px;
  }
  
  .activity-cost {
    margin: 8px 0;
    font-size: 0.9em;
  }
  
  .cost-label {
    font-weight: 600;
  }
  
  .cost-value {
    color: var(--primary-dark);
  }
  
  .activity-links {
    margin-top: 8px;
  }
  
  .activity-links a {
    color: var(--primary);
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.2s;
  }
  
  .activity-links a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
  
  .quick-stops-container {
    margin: -15px 0 20px 30px;
    padding: 10px 15px;
    background-color: #f5f5f5;
    border-left: 2px dashed var(--gray);
    border-radius: 0 0 8px 8px;
  }
  
  .quick-stops-header {
    font-size: 0.8em;
    font-weight: 600;
    color: var(--gray);
    margin-bottom: 5px;
  }
  
  .quick-stops-list {
    list-style-type: none;
    padding-left: 5px;
    margin: 0;
  }
  
  .quick-stops-list li {
    font-size: 0.85em;
    padding: 3px 0;
    color: var(--secondary);
    position: relative;
    padding-left: 20px;
  }
  
  .quick-stops-list li::before {
    content: '↪';
    position: absolute;
    left: 0;
    color: var(--primary);
  }
</style>
