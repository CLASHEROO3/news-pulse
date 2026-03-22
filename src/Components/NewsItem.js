import React from 'react';

/**
 * NewsItem Card Component
 */
const NewsItem = ({ title, description, src, url, source }) => {
  // Professional backup image if the news link is broken
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500&h=300&fit=crop";

  return (
    <div className="news-card">
      <div className="image-container">
        <img 
          src={src ? src : defaultImg} 
          className="news-image" 
          alt="news" 
          // Handles broken image links from the API server
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <span className="source-badge">{source || "Daily Pulse"}</span>
      </div>
      <div className="news-content">
        <h3>{title ? title.slice(0, 75) : "Full Headline Loading..."}...</h3>
        <p>{description ? description.slice(0, 110) : "Stay informed with the latest updates on this story. Click below to read the full report."}...</p>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="news-btn">
        Read Full Article
      </a>
    </div>
  );
};

export default NewsItem;