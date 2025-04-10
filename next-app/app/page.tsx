import { getTripData, getAllDaysData } from '../utils/data';
import DayCard from '../components/DayCard';
import Link from 'next/link';

export default async function Home() {
  // Fetch trip data
  const tripData = await getTripData();
  const daysData = await getAllDaysData(tripData.totalDays);
  
  return (
    <div className="app">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <h1>{tripData.title}</h1>
          <div className="subtitle">{tripData.dateRange}</div>
        </div>
      </header>
      
      {/* Trip Overview */}
      <section className="overview-section">
        <div className="container">
          <h2 className="section-title">Trip Overview</h2>
          
          <div className="daily-summary">
            <div className="summary-title">Adventure Details</div>
            <ul className="drive-info">
              <li><strong>Duration:</strong> {tripData.duration} ({tripData.dateRange})</li>
              <li><strong>Travelers:</strong> {tripData.travelers}</li>
              <li><strong>Vehicle:</strong> {tripData.vehicle}</li>
              <li><strong>Route:</strong> {tripData.route}</li>
              <li><strong>Total Distance:</strong> {tripData.totalDistance.km} km ({tripData.totalDistance.miles} miles)</li>
            </ul>
          </div>
          
          {/* Day Cards for Navigation */}
          <div className="itinerary-grid">
            {daysData.map((day) => (
              <Link key={day.id} href={`/day/${day.id}`} legacyBehavior>
                <a>
                  <DayCard day={day} />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Trip Overview Map</h2>
          <div className="map-container">
            <iframe 
              src={tripData.mapUrl} 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '10px' }} 
              allowFullScreen 
              loading="lazy"
            />
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section className="resources-section">
        <div className="container">
          <h2 className="section-title">Essential Resources</h2>
          
          <div className="resources-grid">
            {tripData.resources.map((resource, resourceIndex) => (
              <div key={resourceIndex} className="resource-card">
                <h3>{resource.title}</h3>
                <ul>
                  {resource.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener">{item.name}</a>
                      ) : (
                        <>
                          <strong>{item.name}:</strong> {item.description}
                        </>
                      )}
                      
                      {item.note && (
                        <span className="note">{item.note}</span>
                      )}
                      
                      {item.subitems && item.subitems.length > 0 && (
                        <ul>
                          {item.subitems.map((subitem, subitemIndex) => (
                            <li key={subitemIndex}>
                              {subitem.url ? (
                                <a href={subitem.url} target="_blank" rel="noopener">{subitem.name}</a>
                              ) : (
                                <>
                                  {subitem.name}
                                  {subitem.description && `: ${subitem.description}`}
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="site-footer">
        <div className="container">
          <p>{tripData.title} | {tripData.dateRange}</p>
          <p>Safe travels and unforgettable adventures!</p>
        </div>
      </footer>
    </div>
  );
}
