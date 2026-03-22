/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, url, sourceName, publishedAt }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const getPreciseTime = (ts) => {
    const diff = Math.floor((new Date() - new Date(ts)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString('en-IN', {day:'numeric', month:'short'});
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <img src={urlToImage || defaultImg} alt="news" onError={(e) => { e.target.src = defaultImg; }} />
        <span className="card-badge">{sourceName}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getPreciseTime(publishedAt)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline..."}</h3>
        <p>{description ? description.slice(0, 95) : "Read full coverage below."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="read-btn">Read Full Story</a>
      </div>
    </div>
  );
};

export default NewsItem;