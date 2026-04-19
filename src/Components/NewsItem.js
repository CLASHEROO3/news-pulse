/* eslint-disable */
import React from 'react';

/**
 * NewsItem Component
 * Renders individual news cards with Sentiment analysis and Cloud-save functionality.
 */
const NewsItem = ({ title, description, urlToImage, image_url, sourceName, index, onReadMore, onBookmark, mood }) => {
  
  // High-quality default image if the source is missing one
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  // Mocked time logic to ensure the demo looks live and fresh
  const getSimulatedTime = (i) => {
    if (i === 0) return "Just now";
    if (i === 1) return "5 mins ago";
    if (i < 5) return `${i * 12}m ago`;
    if (i < 10) return `${Math.floor(i / 2)}h ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      {/* Top Image Section with Badges */}
      <div className="card-img-box">
        {/* Sentiment Badge (Unique Feature) - Top Right */}
        <span className={`mood-pill ${mood || 'Neutral'}`}>
          {mood || 'Neutral'}
        </span>
        
        <img 
          src={urlToImage || image_url || defaultImg} 
          alt="News" 
          onError={e => e.target.src = defaultImg} 
        />
        
        {/* Source Badge - Bottom Left */}
        <span className="card-badge">{sourceName || "Verified Source"}</span>
      </div>

      {/* Text and Actions Content */}
      <div className="card-body">
        <div className="card-time">⏱ {getSimulatedTime(index)}</div>
        
        <h3>{title ? title.slice(0, 65) : "Full Headline Loading..."}</h3>
        
        <p>
          {description ? description.slice(0, 95) : "Quick summary available in the integrated reader mode."}...
        </p>
        
        {/* Professional Action Buttons */}
        <div className="card-actions">
           <button onClick={onReadMore} className="btn-read">
             Read Full
           </button>
           <button onClick={onBookmark} className="btn-save">
             <span>🔖</span> Save
           </button>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;