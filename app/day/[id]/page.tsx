import { Metadata } from 'next';
import { getTripData, getAllDayIds, getDayById } from '../../../utils/data';
import DayDetail from '../../../components/DayDetail';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Generate static paths for all day IDs
export async function generateStaticParams() {
  const tripData = await getTripData();
  const dayIds = await getAllDayIds(tripData.totalDays);
  
  return dayIds.map((id) => ({
    id,
  }));
}

// Generate dynamic metadata for each day page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const tripData = await getTripData();
    const day = await getDayById(params.id, tripData.totalDays);
    
    if (!day) {
      return {
        title: 'Day Not Found',
      };
    }
    
    return {
      title: `Day ${day.dayNumber}: ${day.title} | ${tripData.title}`,
      description: day.summary,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Iceland Trip Day',
      description: 'Day details for Iceland trip',
    };
  }
}

// Loading component for Suspense
function LoadingState() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading day information...</p>
    </div>
  );
}

export default async function DayPage({ params }: { params: { id: string } }) {
  try {
    const tripData = await getTripData();
    const day = await getDayById(params.id, tripData.totalDays);
    
    // Handle case where day is not found
    if (!day) {
      notFound(); // Use Next.js 13+ not-found handling
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
        <nav className="day-navigation">
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
        </nav>
        
        <Suspense fallback={<LoadingState />}>
          <DayDetail day={day} />
        </Suspense>
        
        {/* Day Navigation (Bottom) */}
        <nav className="day-navigation bottom">
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
        </nav>
        
        <footer className="site-footer">
          <div className="container">
            <p>{tripData.title} | {tripData.dateRange}</p>
            <p>Safe travels and unforgettable adventures!</p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('Error in Day page:', error);
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>We couldn't load the day information. Please try again later.</p>
        <Link href="/" className="card-details">
          Return to Trip Overview
        </Link>
      </div>
    );
  }
}
