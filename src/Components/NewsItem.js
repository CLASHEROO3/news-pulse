/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, image_url, sourceName, index, onReadMore, onBookmark, sentiment }) => {
  // Use professional backup image if news image is missing
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  // Create a live feel for the time display
  const getMockedTime = (i) => {
    if (i === 0) return "Just now";
    if (i < 5) return `${i * 12}m ago`;
    if (i < 10) return `${Math.floor(i / 2)}h ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        {/* Sentiment Badge (Unique Feature) */}
        <span className={`sentiment-pill ${sentiment}`}>{sentiment}</span>
        
        <img 
          src={urlToImage || image_url || defaultImg} 
          alt="news" 
          onError={(e) => { e.target.src = defaultImg; }} 
        />
        <span className="card-badge">{sourceName}</span>
      </div>

      <div className="card-body">
        <div className="card-time">⏱ {getMockedTime(index)}</div>
        <h3>{title ? title.slice(0, 60) : "News Update"}...</h3>
        <p>{description ? description.slice(0, 90) : "Full details available in reader."}...</p>
        
        {/* Action Buttons */}
        <div className="card-actions" style={{display:'flex', gap:'10px', marginTop:'auto'}}>
          <button onClick={onReadMore} className="read-btn-sm" style={{flex:'2'}}>Read</button>
          <button onClick={onBookmark} className="bookmark-btn" style={{flex:'1'}}>🔖 Save</button>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;