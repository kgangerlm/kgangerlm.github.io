import { getTripData, getAllDaysData } from '../utils/data';
import DayCard from '../components/DayCard';
import Link from 'next/link';
import { Suspense } from 'react';
import { Metadata } from 'next';

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const tripData = await getTripData();
  return {
    title: tripData.title,
    description: `${tripData.title} - ${tripData.dateRange} - Trip Diary`,
  };
}

// Loading component for Suspense
function LoadingState() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading trip information...</p>
    </div>
  );
}

export default async function Home() {
  try {
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
              <Suspense fallback={<LoadingState />}>
                {daysData.map((day) => (
                  <Link key={day.id} href={`/day/${day.id}`} className="day-card-link">
                    <DayCard day={day} />
                  </Link>
                ))}
              </Suspense>
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
                title="Trip Overview Map"
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
                          <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
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
                                  <a href={subitem.url} target="_blank" rel="noopener noreferrer">{subitem.name}</a>
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
  } catch (error) {
    console.error('Error in Home page:', error);
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>We couldn't load the trip information. Please try again later.</p>
      </div>
    );
  }
}
