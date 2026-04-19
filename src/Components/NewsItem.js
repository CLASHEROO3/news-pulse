/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, urlToImage, sourceName, index, onReadMore, onBookmark, mood }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  const getDisplayTime = (i) => {
    if (i === 0) return "Just now";
    if (i < 5) return `${i * 12}m ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <span className={`mood-pill ${mood || 'Neutral'}`}>{mood || 'Neutral'}</span>
        <img src={urlToImage || defaultImg} alt="news" onError={e => e.target.src = defaultImg} />
        <span className="source-label">{sourceName}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getDisplayTime(index)}</div>
        <h3>{title ? title.slice(0, 70) : "Headline Loading..."}</h3>
        <div className="card-actions">
           <button onClick={onReadMore} className="btn-read">Read</button>
           <button onClick={onBookmark} className="btn-save">🔖 Save</button>
        </div>
      </div>
    </div>
  );
};
export default NewsItem;