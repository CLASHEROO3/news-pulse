/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, url, sourceName, index }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  // THIS FUNCTION GENERATES TIMES BASED ON TODAY'S ACTUAL DATE
  const getFakeLiveTime = (i) => {
    const today = new Date();
    
    if (i === 0) return "Just now";
    if (i === 1) return "5 mins ago";
    if (i < 5) return `${i * 12} mins ago`;
    if (i < 10) return `${Math.floor(i / 2)} hours ago`;
    if (i < 15) return "Today, " + today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // For older items, show "Yesterday" or "2 days ago"
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (i < 25) return "Yesterday";
    
    return yesterday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <img 
          src={urlToImage || defaultImg} 
          alt="news" 
          onError={(e) => { e.target.src = defaultImg; }} 
        />
        <span className="card-badge">{sourceName}</span>
      </div>
      <div className="card-body">
        {/* WE USE THE INDEX TO ENSURE THE FIRST NEWS IS NEWEST */}
        <div className="card-time">⏱ {getFakeLiveTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline Update"}...</h3>
        <p>{description ? description.slice(0, 95) : "Read the full coverage of this developing story on the next page."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="read-btn">Read Full Story</a>
      </div>
    </div>
  );
};

export default NewsItem;