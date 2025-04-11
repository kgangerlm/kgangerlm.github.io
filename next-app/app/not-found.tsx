import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist',
};

export default function NotFound() {
  return (
    <div className="app">
      <div className="error-container">
        <h1>404 - Page Not Found</h1>
        <p>We couldn't find the page you're looking for.</p>
        <div className="error-actions">
          <Link href="/" className="card-details">
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
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--primary, #007bff);
        }
        
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        
        .error-actions {
          margin-top: 2rem;
        }
        
        .card-details {
          display: inline-block;
          background-color: var(--primary, #007bff);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .card-details:hover {
          background-color: var(--primary-dark, #0056b3);
        }
      `}</style>
    </div>
  );
}
