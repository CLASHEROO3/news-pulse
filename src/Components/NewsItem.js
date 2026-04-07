import React from 'react';

const NewsItem = ({ title, description, urlToImage, image_url, sourceName, index, onReadMore, onBookmark, mood }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  const getTime = (i) => {
    if (i === 0) return "Just now";
    if (i < 5) return `${i * 12}m ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        {/* Sentiment Badge (Top Right) */}
        <span className={`mood-badge ${mood || 'Neutral'}`}>{mood || 'Neutral'}</span>
        
        <img src={urlToImage || image_url || defaultImg} alt="news" onError={e => e.target.src = defaultImg} />
        
        {/* Source Badge (Bottom Left) */}
        <span className="source-label">{sourceName}</span>
      </div>

      <div className="card-body">
        <div className="card-time">⏱ {getTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Headline Loading..."}</h3>
        <p>{description ? description.slice(0, 95) : "Full summary available in reader mode."}...</p>
        
        <div className="card-actions">
           <button onClick={onReadMore} className="btn-read">Read</button>
           <button onClick={onBookmark} className="btn-save">Save</button>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;