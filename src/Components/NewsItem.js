import React from 'react';

const NewsItem = ({ title, description, src, url, source, publishedAt }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const formatTime = (dateStr) => {
    if(!dateStr) return "Recently";
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="news-card">
      <div className="card-img-container">
        <img src={src || defaultImg} className="card-img" alt="news" onError={(e) => e.target.src = defaultImg} />
        <span style={{position:'absolute', top:'10px', left:'10px', background:'var(--gold)', color:'var(--navy)', padding:'3px 8px', borderRadius:'4px', fontSize:'0.65rem', fontWeight:'800'}}>{source}</span>
      </div>
      <div className="news-content">
        <div className="time-tag">🕒 {formatTime(publishedAt)}</div>
        <h3>{title ? title.slice(0, 65) : "Latest Update"}...</h3>
        <p>{description ? description.slice(0, 100) : "No description available for this article. Click read more for full details."}...</p>
        <a href={url} target="_blank" rel="noreferrer" className="news-btn">Read More</a>
      </div>
    </div>
  );
};

export default NewsItem;