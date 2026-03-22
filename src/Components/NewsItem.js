import React from 'react';

const NewsItem = ({ title, description, src, url, source, publishedAt }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const formatTime = (dateStr) => {
    if(!dateStr) return "Recently";
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="news-card">
      <div className="image-container">
        <img src={src || defaultImg} className="news-image" alt="news" onError={(e) => { e.target.src = defaultImg; }} />
        <span className="source-badge">{source || "News"}</span>
      </div>
      <div className="news-content">
        <div className="time-tag">🕒 {formatTime(publishedAt)}</div>
        <h3>{title ? title.slice(0, 60) : "Latest Update"}...</h3>
        <p>{description ? description.slice(0, 90) : "Stay informed with the latest updates on this story."}...</p>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="news-btn">Read More</a>
    </div>
  );
};

export default NewsItem;