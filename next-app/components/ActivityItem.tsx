import { Activity } from '../types';

interface ActivityItemProps {
  item: Activity;
}

export default function ActivityItem({ item }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <div className="activity-time">{item.time}</div>
      <div className="activity-content">
        <div className="activity-title">
          {item.title}
          {item.isHighlight && <span className="featured">Featured</span>}
          {item.isHiddenGem && <span className="gem">Hidden Gem</span>}
        </div>
        <div className="activity-desc">{item.description}</div>
        
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
    </div>
  );
}
