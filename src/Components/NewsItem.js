import React from 'react';

const NewsItem = ({ title, description, src, url, source }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  return (
    <div className="news-card">
      <div className="image-container" style={{height: '200px', width: '100%', overflow: 'hidden'}}>
        <img 
          src={src ? src : defaultImg} 
          className="news-image" 
          alt="news" 
          style={{width: '100%', height: '200px', objectFit: 'cover'}}
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <span className="source-badge">{source || "News"}</span>
      </div>
      <div className="news-content">
        <h3>{title ? title.slice(0, 60) : "Latest Update"}...</h3>
        <p>{description ? description.slice(0, 90) : "Click below to read the full story on this topic."}...</p>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="news-btn">Read More</a>
    </div>
  );
};

export default NewsItem;