'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Day page error:', error);
  }, [error]);

  return (
    <div className="app">
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>We couldn't load the day information. Please try again later.</p>
        <div className="error-actions">
          <button onClick={reset} className="retry-button">
            Try Again
          </button>
          <Link href="/" className="home-link">
            Return to Trip Overview
          </Link>
        </div>
      </div>

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70vh;
          text-align: center;
          padding: 20px;
        }
        
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--primary, #007bff);
        }
        
        p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        
        .error-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .retry-button {
          background-color: var(--primary, #007bff);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .retry-button:hover {
          background-color: var(--primary-dark, #0056b3);
        }
        
        .home-link {
          display: inline-block;
          background-color: var(--secondary, #6c757d);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .home-link:hover {
          background-color: var(--secondary-dark, #545b62);
        }
      `}</style>
    </div>
  );
}
