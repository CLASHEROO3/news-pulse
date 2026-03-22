import React from 'react';

const NewsItem = ({ title, description, src, url, source, publishedAt }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const getDetailedTime = (timestamp) => {
    const now = new Date();
    const published = new Date(timestamp);
    const diffInMs = now - published;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return "Yesterday";
    
    // More than 48 hours: Show full date like "March 22, 2024"
    return published.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="news-card">
      <div className="card-image-wrap">
        <img src={src || defaultImg} className="card-img" alt="news" onError={(e) => e.target.src = defaultImg} />
        <span className="card-badge">{source || "News"}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getDetailedTime(publishedAt)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline..."}</h3>
        <p>{description ? description.slice(0, 95) : "Full details available in the article."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="read-more-btn">Read Full Story</a>
      </div>
    </div>
  );
};

export default NewsItem;