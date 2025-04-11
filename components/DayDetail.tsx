import { DayData } from '../types';
import ActivityItem from './ActivityItem';
import Image from 'next/image';
import { memo } from 'react';

interface DayDetailProps {
  day: DayData;
}

// Custom map component that safely handles the iframe
const SafeMapEmbed = memo(({ mapUrl }: { mapUrl: string }) => {
  // Extract the actual URL from the iframe HTML string
  const getMapUrl = (iframeString: string) => {
    const srcMatch = iframeString.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : '';
  };
  
  const actualMapUrl = getMapUrl(mapUrl);
  
  return (
    <div className="map-container">
      <iframe
        src={actualMapUrl}
        width="100%"
        height="450"
        style={{ border: 0, borderRadius: '10px' }}
        allowFullScreen
        loading="lazy"
        title="Day Map"
        aria-label="Interactive map for the day's route"
      />
    </div>
  );
});

SafeMapEmbed.displayName = 'SafeMapEmbed';

function DayDetail({ day }: DayDetailProps) {
  return (
    <section id={day.id} className="day-section">
      <div className="container">
        <div className="day-header">
          <h2 className="day-title">{day.emoji} Day {day.dayNumber}: {day.title}</h2>
          <div className="day-date">{day.date}</div>
        </div>
        
        {/* Using standard img tag since we're optimizing images externally 
            and we specified unoptimized: true in next.config.js */}
        <img 
          src={day.image.src} 
          alt={day.image.alt} 
          className="day-image"
          width={1200}
          height={600}
        />
        
        <blockquote className="quote-box">
          <p>"{day.quote.text}"</p>
          <footer>- {day.quote.author}</footer>
        </blockquote>
        
        <div className="daily-summary">
          <h3 className="summary-title">Day Summary</h3>
          <p>{day.summary}</p>
          
          <div className="drive-info">
            <strong>Total Driving:</strong> ~{day.driving.total.distance.km} km ({day.driving.total.distance.miles} miles), {day.driving.total.time}
            <ul>
              {day.driving.segments.map((segment, index) => (
                <li key={index}>
                  {segment.from} to {segment.to}: ~{segment.distance.km} km ({segment.distance.miles} miles), {segment.time}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Using a safe map component instead of dangerouslySetInnerHTML */}
        {day.mapUrl && (
          <SafeMapEmbed mapUrl={day.mapUrl} />
        )}
        
        <div className="day-schedule">
          <h3 className="section-heading">Daily Schedule</h3>
          <div className="activity-timeline">
            {day.schedule.map((item, index) => (
              <ActivityItem key={index} item={item} />
            ))}
          </div>
        </div>
        
        {/* Highlights Section */}
        <section className="highlights-section" aria-labelledby="highlights-heading">
          <h4 id="highlights-heading">Key Highlights of the Day</h4>
          <ul className="highlights-list">
            {day.highlights.map((highlight, index) => (
              <li key={index}>
                {typeof highlight === 'string' ? (
                  highlight
                ) : (
                  <>
                    {highlight.link ? (
                      <a href={highlight.link} target="_blank" rel="noopener noreferrer">
                        <strong>{highlight.title}:</strong>
                      </a>
                    ) : (
                      <strong>{highlight.title}:</strong>
                    )}
                    {' '}{highlight.description}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Accommodations Section */}
        <section className="accommodations-section" aria-labelledby="accommodations-heading">
          <h4 id="accommodations-heading">Accommodations</h4>
          <div className="accommodations-details">
            <strong>{day.accommodation.name}</strong>
            <address>
              {day.accommodation.address}
            </address>
            <p>
              <span className="label">Cost:</span> {day.accommodation.cost}<br />
              <span className="label">Room Type:</span> {day.accommodation.roomType}
              {day.accommodation.notes && (
                <>
                  <br />
                  <span className="label">Note:</span> {day.accommodation.notes}
                </>
              )}
            </p>
          </div>
        </section>
        
        {/* Alternatives Section */}
        <section className="alternatives-section" aria-labelledby="alternatives-heading">
          <h4 id="alternatives-heading">Alternative Activities</h4>
          <ul className="alternatives-list">
            {day.alternatives.map((alt, index) => (
              <li key={index}>
                {alt.link ? (
                  <a href={alt.link} target="_blank" rel="noopener noreferrer">
                    <strong>{alt.title}:</strong>
                  </a>
                ) : (
                  <strong>{alt.title}:</strong>
                )}
                {' '}{alt.description}
                {alt.isGem && <span className="badge gem-badge" aria-label="Hidden Gem">💎 Hidden Gem</span>}
                {alt.isUserSelected && <span className="badge selected-badge" aria-label="Selected Activity">✓ Selected</span>}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Bad Weather Alternatives */}
        <section className="weather-section" aria-labelledby="weather-heading">
          <h4 id="weather-heading">Bad Weather Alternatives</h4>
          <ul className="weather-list">
            {day.badWeatherAlternatives.map((alt, index) => (
              <li key={index}>
                {alt.link ? (
                  <a href={alt.link} target="_blank" rel="noopener noreferrer">
                    <strong>{alt.title}:</strong>
                  </a>
                ) : (
                  <strong>{alt.title}:</strong>
                )}
                {' '}{alt.description}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Hot Springs Section */}
        {day.hotSprings && day.hotSprings.length > 0 && (
          <section className="hotsprings-section" aria-labelledby="hotsprings-heading">
            <h4 id="hotsprings-heading"><span className="hotspring-icon" aria-hidden="true">♨️</span> Hot Springs</h4>
            <ul className="hotsprings-list">
              {day.hotSprings.map((spring, index) => (
                <li 
                  key={index} 
                  className={spring.isEveningRelaxation ? 'evening-relaxation' : ''}
                >
                  {spring.link ? (
                    <a href={spring.link} target="_blank" rel="noopener noreferrer">
                      <strong>{spring.name}:</strong>
                    </a>
                  ) : (
                    <strong>{spring.name}:</strong>
                  )}
                  {' '}{spring.description}
                  <div className="hotspring-details">
                    <span className="hotspring-location">
                      <strong>Location:</strong> {spring.location}
                    </span>
                    <span className="hotspring-cost">
                      <strong>Cost:</strong> {spring.cost}
                    </span>
                    {spring.isEveningRelaxation && (
                      <span className="evening-badge" aria-label="Evening Relaxation Option">✨ Evening Relaxation</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        
        {/* Tips & Notes */}
        {day.tip && <aside className="tip-box" aria-label="Tip">{day.tip}</aside>}
        
        {day.notes && (
          <section className="notes-container" aria-labelledby="notes-heading">
            <h4 id="notes-heading">Notes</h4>
            {typeof day.notes === 'string' ? (
              <p>{day.notes}</p>
            ) : Array.isArray(day.notes) && day.notes.length > 0 ? (
              <ul className="notes-list">
                {day.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            ) : null}
          </section>
        )}
      </div>
    </section>
  );
}

export default memo(DayDetail);
