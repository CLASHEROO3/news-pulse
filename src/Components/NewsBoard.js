import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null); // Controls Reader Mode

  // Control body scrolling when Reader Mode is active
  useEffect(() => {
    document.body.style.overflow = selectedArticle ? 'hidden' : 'auto';
  }, [selectedArticle]);

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      try {
        let allArticles = [];

        // Scenario A: User is viewing their multi-category "For You" feed
        if (activeView === "for-you") {
          const apiRequests = selectedCats.map(cat => 
            axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`)
          );
          const results = await Promise.all(apiRequests);
          results.forEach(res => {
            if (res.data.articles) allArticles = [...allArticles, ...res.data.articles];
          });
        } 
        // Scenario B: User clicked a specific category tab
        else {
          const res = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`);
          allArticles = res.data.articles || [];
        }

        // Logic: Sort combined news by timestamp (Newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Logic: Remove duplicate articles by checking URLs
        const uniqueArticles = Array.from(new Set(allArticles.map(a => a.url)))
                                    .map(url => allArticles.find(a => a.url === url));

        setArticles(uniqueArticles.slice(0, 40));
        setLoading(false);
      } catch (err) {
        console.error("API Connection Error:", err);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [activeView, selectedCats, country]);

  return (
    <div className="board-container">
      
      {/* --- In-App Reader Overlay --- */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage} alt="Cover" className="reader-img" />
            <div className="reader-text-box">
              <span className="reader-source">{selectedArticle.source.name}</span>
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                Summary: This developing story is being tracked by NewsPulse. Our aggregator 
                collects real-time snippets from verified sources like {selectedArticle.source.name}. 
                The full multimedia experience including videos and expert analysis is available via 
                the official link below.
              </p>
              <a href={selectedArticle.url} target="_blank" rel="noreferrer" className="source-link">
                View Original Full Article →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- Loading and Grid Logic --- */}
      {loading ? (
        <div className="spinner-center"></div>
      ) : (
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