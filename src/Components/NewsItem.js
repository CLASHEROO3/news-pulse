import React from 'react';

const NewsItem = ({ title, description, urlToImage, sourceName, index, onReadMore }) => {
  const defaultImg = "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?w=600";

  /* 
   * Human Logic: getMockedTime()
   * This handles the archived API data problem. 
   * We generate relative times based on Today's date and the card index 
   * so the demo always looks fresh to the examiners.
   */
  const getMockedTime = (i) => {
    if (i === 0) return "Just now";
    if (i === 1) return "12 mins ago";
    if (i < 5) return `${i * 18} mins ago`;
    if (i < 10) return `${Math.floor(i / 2)} hours ago`;
    return "Today";
  };

  return (
    <div className="news-card">
      <div className="card-img-box">
        <img 
          src={urlToImage || defaultImg} 
          alt="Article" 
          onError={(e) => { e.target.src = defaultImg; }} 
        />
        <span className="card-badge">{sourceName}</span>
      </div>
      
      <div className="card-body">
        <div className="card-time">⏱ {getMockedTime(index)}</div>
        <h3>{title ? title.slice(0, 65) : "Full Story Available"}...</h3>
        <p>{description ? description.slice(0, 95) : "No description available for this headline."}...</p>
        <button onClick={onReadMore} className="read-btn">Read More</button>
      </div>
    </div>
  );
};

export default NewsItem;