/* eslint-disable */
import React from 'react';

const NewsItem = ({ title, description, urlToImage, sourceName, index, onReadMore, onBookmark, mood }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  const getFakeTime = (i) => {
    if (i === 0) return "Just now";
    if (i < 5) return `${i * 12}m ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <span className={`mood-badge ${mood || 'Neutral'}`}>{mood || 'Neutral'}</span>
        <img src={urlToImage || defaultImg} alt="news" onError={e => e.target.src = defaultImg} />
        <span className="source-label">{sourceName}</span>
      </div>
      <div className="card-body">
        <div className="card-time">⏱ {getFakeTime(index)}</div>
        <h3 style={{fontSize:'1.1rem', margin:'0', color:'var(--navy)', height:'2.8em', overflow:'hidden'}}>{title ? title.slice(0, 65) : "Headline Loading..."}</h3>
        <div className="card-actions">
           <button onClick={onReadMore} className="btn-read">Read</button>
           <button onClick={onBookmark} className="btn-save">Save</button>
        </div>
      </div>
    </div>
  );
};
export default NewsItem;