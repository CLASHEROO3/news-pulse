import React from 'react';

const NewsItem = ({ title, description, src, url, source, publishedAt }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const published = new Date(timestamp);
    const diffInMs = now - published;
    
    const mins = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    return published.toLocaleDateString();
  };

  return (
    <div className="news-card">
      <div className="card-top">
        <img src={src || defaultImg} className="card-img" alt="news" onError={(e) => e.target.src = defaultImg} />
        <span className="card-source">{source || "News"}</span>
      </div>
      <div className="card-bottom">
        <div className="card-meta">⏱ {getRelativeTime(publishedAt)}</div>
        <h3>{title ? title.slice(0, 60) : "Headline..."}</h3>
        <p>{description ? description.slice(0, 90) : "Read more for full details."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="card-link">Read Full Story</a>
      </div>
    </div>
  );
};

export default NewsItem;