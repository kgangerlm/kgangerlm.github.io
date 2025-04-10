import { DayData } from '../types';
import ActivityItem from './ActivityItem';
import Image from 'next/image';

interface DayDetailProps {
  day: DayData;
}

export default function DayDetail({ day }: DayDetailProps) {
  return (
    <section id={day.id} className="day-section">
      <div className="container">
        <div className="day-header">
          <h2 className="day-title">{day.emoji} Day {day.dayNumber}: {day.title}</h2>
          <div className="day-date">{day.date}</div>
        </div>
        
        <img 
          src={day.image.src} 
          alt={day.image.alt} 
          className="day-image"
        />
        
        <div className="quote-box">
          "{day.quote.text}" - {day.quote.author}
        </div>
        
        <div className="daily-summary">
          <div className="summary-title">Day Summary</div>
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
        
        <div 
          className="map-container"
          dangerouslySetInnerHTML={{ __html: day.mapUrl }}
        />
        
        <div className="day-schedule">
          <h3 className="section-heading">Daily Schedule</h3>
          <div className="activity-timeline">
            {day.schedule.map((item, index) => (
              <ActivityItem key={index} item={item} />
            ))}
          </div>
        </div>
        
        {/* Highlights Section */}
        <div className="highlights-section">
          <h4>Key Highlights of the Day</h4>
          <ul className="highlights-list">
            {day.highlights.map((highlight, index) => (
              <li key={index}>
                {typeof highlight === 'string' ? (
                  highlight
                ) : (
                  <>
                    {highlight.link ? (
                      <a href={highlight.link} target="_blank" rel="noopener">
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
        </div>
        
        {/* Accommodations Section */}
        <div className="accommodations-section">
          <h4>Accommodations</h4>
          <div className="accommodations-details">
            <strong>{day.accommodation.name}</strong>
            <br />
            {day.accommodation.address}
            <br />
            Cost: {day.accommodation.cost}
            <br />
            {day.accommodation.roomType}
            {day.accommodation.notes && (
              <>
                <br />
                Note: {day.accommodation.notes}
              </>
            )}
          </div>
        </div>
        
        {/* Alternatives Section */}
        <div className="alternatives-section">
          <h4>Alternative Activities</h4>
          <ul className="alternatives-list">
            {day.alternatives.map((alt, index) => (
              <li key={index}>
                {alt.link ? (
                  <a href={alt.link} target="_blank" rel="noopener">
                    <strong>{alt.title}:</strong>
                  </a>
                ) : (
                  <strong>{alt.title}:</strong>
                )}
                {' '}{alt.description}
                {alt.isGem && <span className="badge gem-badge">💎 Hidden Gem</span>}
                {alt.isUserSelected && <span className="badge selected-badge">✓ Selected</span>}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bad Weather Alternatives */}
        <div className="weather-section">
          <h4>Bad Weather Alternatives</h4>
          <ul className="weather-list">
            {day.badWeatherAlternatives.map((alt, index) => (
              <li key={index}>
                {alt.link ? (
                  <a href={alt.link} target="_blank" rel="noopener">
                    <strong>{alt.title}:</strong>
                  </a>
                ) : (
                  <strong>{alt.title}:</strong>
                )}
                {' '}{alt.description}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Hot Springs Section */}
        {day.hotSprings && day.hotSprings.length > 0 && (
          <div className="hotsprings-section">
            <h4><span className="hotspring-icon">♨️</span> Hot Springs</h4>
            <ul className="hotsprings-list">
              {day.hotSprings.map((spring, index) => (
                <li 
                  key={index} 
                  className={spring.isEveningRelaxation ? 'evening-relaxation' : ''}
                >
                  {spring.link ? (
                    <a href={spring.link} target="_blank" rel="noopener">
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
                      <span className="evening-badge">✨ Evening Relaxation</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Tips & Notes */}
        {day.tip && <div className="tip-box">{day.tip}</div>}
        
        {day.notes && (
          <div className="notes-container">
            <h4>Notes</h4>
            {typeof day.notes === 'string' ? (
              <p>{day.notes}</p>
            ) : Array.isArray(day.notes) && day.notes.length > 0 ? (
              <ul className="notes-list">
                {day.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
