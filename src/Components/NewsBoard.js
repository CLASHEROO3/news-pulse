/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

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
      {/* IN-APP READER OVERLAY */}
      {selectedArticle && (
        <div className="reader-overlay">
          <div className="reader-content">
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage} alt="news" className="reader-img" />
            <div className="reader-text-box">
              <span className="reader-source">{selectedArticle.source.name}</span>
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                {selectedArticle.content || "Summary: This reported story from " + selectedArticle.source.name + " is currently developing. NewsPulse is aggregating live data to provide the most accurate updates. To view the full multimedia report, please use the link below."}
              </p>
              <a href={selectedArticle.url} target="_blank" rel="noreferrer" className="source-link">View Original Official Source →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem 
              key={i} 
              index={i} 
              {...news} 
              sourceName={news.source.name} 
              onReadMore={() => setSelectedArticle(news)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;