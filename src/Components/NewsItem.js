/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, sourceName, index, onReadMore }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=500";

  const getFakeLiveTime = (i) => {
    if (i === 0) return "Just now";
    if (i < 5) return `${i * 12}m ago`;
    if (i < 10) return `${Math.floor(i / 2) + 1}h ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <img src={urlToImage || defaultImg} alt="news" onError={(e) => { e.target.src = defaultImg; }} />
        <span className="card-badge">{sourceName}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getFakeLiveTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline..."}</h3>
        <p>{description ? description.slice(0, 95) : "Details available in reader."}...</p>
        <button onClick={onReadMore} className="read-btn">Read More</button>
      </div>
    </div>
  );
};

export default NewsItem;