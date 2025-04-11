import { DayData } from '../types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface DayCardProps {
  day: DayData;
  isActive?: boolean;
}

function DayCard({ day, isActive = false }: DayCardProps) {
  return (
    <article 
      className={`itinerary-card ${isActive ? 'active' : ''}`}
      aria-labelledby={`day-${day.dayNumber}-title`}
    >
      <div 
        className="card-header"
        style={{ 
          backgroundImage: `url(${day.image?.src})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
        }}
        role="img"
        aria-label={day.image?.alt || `Image for Day ${day.dayNumber}`}
      >
        <div className="header-content">
          <h3 id={`day-${day.dayNumber}-title`}>Day {day.dayNumber}</h3>
          <time className="card-date">{day.date}</time>
        </div>
      </div>
      <div className="card-content">
        <div className="card-highlight">
          <span aria-hidden="true">{day.emoji}</span> {day.title}
        </div>
        <div className="card-route">
          <strong>Route:</strong> {day.route.from} → {day.route.to}
          {day.driving?.total?.time && (
            <span className="driving-time"> ({day.driving.total.time})</span>
          )}
        </div>
        <p className="card-summary">{day.shortSummary || day.summary}</p>
        
        {day.highlights && day.highlights.length > 0 && (
          <div className="card-highlights">
            <h4>Key Highlights:</h4>
            <ul>
              {day.highlights.slice(0, 3).map((highlight, index) => (
                <li key={index}>
                  {typeof highlight === 'string' 
                    ? highlight 
                    : highlight.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {day.accommodation && day.accommodation.name && (
          <div className="card-accommodation">
            <div className="accommodation-icon" aria-hidden="true">🏠</div>
            <div className="accommodation-details">
              <span className="accommodation-label">Stay at:</span>
              <span className="accommodation-name">{day.accommodation.name}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(DayCard);
