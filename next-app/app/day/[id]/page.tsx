import { getTripData, getAllDayIds, getDayById } from '../../../utils/data';
import DayDetail from '../../../components/DayDetail';
import Link from 'next/link';

export async function generateStaticParams() {
  const tripData = await getTripData();
  const dayIds = await getAllDayIds(tripData.totalDays);
  
  return dayIds.map((id) => ({
    id,
  }));
}

export default async function DayPage({ params }: { params: { id: string } }) {
  const tripData = await getTripData();
  const day = await getDayById(params.id, tripData.totalDays);
  
  // Handle case where day is not found
  if (!day) {
    return (
      <div className="error-container">
        <h2>Day Not Found</h2>
        <p>Sorry, we couldn't find the day you're looking for.</p>
        <Link href="/" className="card-details">
          Return to Trip Overview
        </Link>
      </div>
    );
  }
  
  // Find previous and next day IDs for navigation
  const allDayIds = await getAllDayIds(tripData.totalDays);
  const currentIndex = allDayIds.findIndex(id => id === params.id);
  const prevDayId = currentIndex > 0 ? allDayIds[currentIndex - 1] : null;
  const nextDayId = currentIndex < allDayIds.length - 1 ? allDayIds[currentIndex + 1] : null;
  
  return (
    <div className="app">
      <header className="site-header">
        <div className="container">
          <h1>{tripData.title}</h1>
          <div className="subtitle">{tripData.dateRange}</div>
        </div>
      </header>
      
      {/* Day Navigation */}
      <div className="container" style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {prevDayId && (
            <Link href={`/day/${prevDayId}`} className="card-details">
              ← Previous Day
            </Link>
          )}
        </div>
        <div>
          <Link href="/" className="card-details">
            Trip Overview
          </Link>
        </div>
        <div>
          {nextDayId && (
            <Link href={`/day/${nextDayId}`} className="card-details">
              Next Day →
            </Link>
          )}
        </div>
      </div>
      
      <DayDetail day={day} />
      
      {/* Day Navigation (Bottom) */}
      <div className="container" style={{ padding: '20px 0 40px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {prevDayId && (
            <Link href={`/day/${prevDayId}`} className="card-details">
              ← Previous Day
            </Link>
          )}
        </div>
        <div>
          <Link href="/" className="card-details">
            Trip Overview
          </Link>
        </div>
        <div>
          {nextDayId && (
            <Link href={`/day/${nextDayId}`} className="card-details">
              Next Day →
            </Link>
          )}
        </div>
      </div>
      
      <footer className="site-footer">
        <div className="container">
          <p>{tripData.title} | {tripData.dateRange}</p>
          <p>Safe travels and unforgettable adventures!</p>
        </div>
      </footer>
    </div>
  );
}
