/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Disable body scroll when reader is open
  useEffect(() => {
    if (selectedArticle) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [selectedArticle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let allArticles = [];
        if (activeView === "for-you") {
          const requests = selectedCats.map(cat => axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`));
          const responses = await Promise.all(requests);
          responses.forEach(r => { if (r.data && r.data.articles) allArticles = [...allArticles, ...r.data.articles]; });
        } else {
          const res = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`);
          allArticles = res.data.articles || [];
        }
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        const unique = Array.from(new Set(allArticles.map(a => a.url))).map(url => allArticles.find(a => a.url === url));
        setArticles(unique.slice(0, 40));
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  return (
    <div>
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage} alt="news" className="reader-img" />
            <div className="reader-text-box">
              <span className="reader-source">{selectedArticle.source.name}</span>
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                {selectedArticle.content || "NewsPulse AI Summary: This developing story from " + selectedArticle.source.name + " provides key updates on the current situation. Our aggregator has compiled this summary for a quick read. For the full experience including videos and live commentary, please use the button below to visit the official broadcaster."}
              </p>
              <a href={selectedArticle.url} target="_blank" rel="noreferrer" className="source-link">View Full Official Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center" style={{margin:'100px auto', width:'40px', height:'40px', border:'4px solid #ddd', borderTopColor:'#c59235', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} sourceName={news.source.name} onReadMore={() => setSelectedArticle(news)} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default NewsBoard;