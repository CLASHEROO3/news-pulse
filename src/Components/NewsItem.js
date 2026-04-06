/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, url, sourceName, index }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const getLiveTime = (i) => {
    if (i === 0) return "Just now";
    if (i < 5) return `${i * 8 + 2}m ago`;
    if (i < 15) return `${Math.floor(i / 2) + 1}h ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <img src={urlToImage || defaultImg} alt="news" onError={(e) => { e.target.src = defaultImg; }} />
        <span className="card-badge">{sourceName}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getLiveTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline Loading..."}</h3>
        <p>{description ? description.slice(0, 95) : "Read more for full coverage."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="read-btn">Read Full Story</a>
      </div>
    </div>
  );
};

export default NewsItem;