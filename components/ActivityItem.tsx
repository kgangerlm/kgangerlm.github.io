import { Activity } from '../types';
import { memo } from 'react';

interface ActivityItemProps {
  item: Activity;
}

function ActivityItem({ item }: ActivityItemProps) {
  return (
    <article className="activity-item">
      <time className="activity-time">{item.time}</time>
      <div className="activity-content">
        <h4 className="activity-title">
          {item.title}
          {item.isHighlight && (
            <span className="featured" aria-label="Featured Activity">Featured</span>
          )}
          {item.isHiddenGem && (
            <span className="gem" aria-label="Hidden Gem">Hidden Gem</span>
          )}
        </h4>
        <p className="activity-desc">{item.description}</p>
        
        {item.subActivities && item.subActivities.length > 0 && (
          <ul className="sub-activities">
            {item.subActivities.map((subActivity, index) => (
              <li key={index}>
                <strong>{subActivity.title}</strong>
                {subActivity.description && `: ${subActivity.description}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default memo(ActivityItem);
