/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, image_url, sourceName, index, onReadMore, onBookmark, sentiment }) => {
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
        <img src={urlToImage || image_url || defaultImg} alt="news" onError={e => e.target.src = defaultImg} />
        <span className="card-badge">{sourceName}</span>
        {/* SENTIMENT PILL */}
        <span className={`sentiment-pill ${sentiment || 'Neutral'}`}>{sentiment || "Neutral"}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getFakeLiveTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline Loading..."}</h3>
        <p>{description ? description.slice(0, 95) : "Details available in reader."}...</p>
        <div className="card-actions">
           <button onClick={onReadMore} className="read-btn-sm">Read</button>
           <button onClick={onBookmark} className="bookmark-btn">🔖 Save</button>
        </div>
      </div>
    </div>
  );
};
export default NewsItem;