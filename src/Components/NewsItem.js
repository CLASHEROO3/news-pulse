/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, sourceName, publishedAt, onReadMore, onBookmark, mood }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  const getRealTime = (ts) => {
    const diff = Math.floor((new Date() - new Date(ts)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString('en-IN', {day:'numeric', month:'short'});
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <span className={`mood-pill ${mood || 'Neutral'}`}>{mood || 'Neutral'}</span>
        <img src={urlToImage || defaultImg} alt="news" onError={e => e.target.src = defaultImg} />
        <span className="card-badge">{sourceName}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getRealTime(publishedAt)}</div>
        <h3 style={{fontSize:'1.1rem', margin:'0', color:'var(--navy)', height:'2.8em', overflow:'hidden'}}>{title}</h3>
        <div className="card-actions">
           <button onClick={onReadMore} className="btn-read">Read</button>
           <button onClick={onBookmark} className="btn-save">🔖 Save</button>
        </div>
      </div>
    </div>
  );
};
export default NewsItem;