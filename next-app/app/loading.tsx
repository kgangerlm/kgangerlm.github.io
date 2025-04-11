export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading trip information...</p>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          padding: 2rem;
          text-align: center;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          margin-bottom: 1rem;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: var(--primary, #007bff);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        p {
          font-size: 1.1rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
