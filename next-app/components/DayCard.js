import { useState } from 'react';
import Link from 'next/link';

export default function DayCard({ day, isActive = false }) {
  return (
    <div 
      className={`itinerary-card ${isActive ? 'active' : ''}`}
    >
      <div 
        className="card-header"
        style={{ backgroundImage: `url(${day.image?.src})` }}
      >
        <div className="header-content">
          <h3>Day {day.dayNumber}</h3>
          <div className="card-date">{day.date}</div>
        </div>
      </div>
      <div className="card-content">
        <div className="card-highlight">{day.emoji} {day.title}</div>
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
            <div className="accommodation-icon">🏠</div>
            <div className="accommodation-details">
              <span className="accommodation-label">Stay at:</span>
              <span className="accommodation-name">{day.accommodation.name}</span>
            </div>
          </div>
        )}
        
        <Link href={`/day/${day.id}`}>
          <a className="card-details">View Details</a>
        </Link>
      </div>
    </div>
  );
}
