import React from 'react';

const NewsItem = ({ title, description, src, url, source }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="news-card">
      <div className="image-container">
        <img src={src ? src : defaultImg} className="news-image" alt="news" onError={(e) => { e.target.src = defaultImg; }} />
        <span className="source-badge">{source || "Trending"}</span>
      </div>
      <div className="news-content">
        <h3>{title ? title.slice(0, 75) : "Headline Loading..."}...</h3>
        <p>{description ? description.slice(0, 110) : "Stay informed with the latest updates on this story. Click below for full coverage."}...</p>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="news-btn">Read More</a>
    </div>
  );
};

export default NewsItem;