/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, url, sourceName, index }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  // LOGIC TO CREATE A "LIVE" FEEL FOR THE DEMO
  const getLiveTime = (i) => {
    // We create a fake time based on the index of the article
    // Index 0 (First news) -> 5 to 15 mins ago
    // Index 10 -> 4 to 6 hours ago
    if (i === 0) return "Just now";
    if (i < 3) return `${i * 7 + 5}m ago`;
    if (i < 10) return `${Math.floor(i / 2) + 1}h ago`;
    if (i < 20) return `${Math.floor(i / 3) + 5}h ago`;
    return "Yesterday";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <img src={urlToImage || defaultImg} alt="news" onError={(e) => { e.target.src = defaultImg; }} />
        <span className="card-badge">{sourceName}</span>
      </div>
      <div className="card-body">
        {/* We use the index here to show the fake live time */}
        <div className="card-time">⏱ {getLiveTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline Loading..."}</h3>
        <p>{description ? description.slice(0, 90) : "Click below to read the full report on this developing story."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="read-btn">Read Full Story</a>
      </div>
    </div>
  );
};

export default NewsItem;