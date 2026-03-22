/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let allArticles = [];

        if (activeView === "for-you") {
          // Get news for all selected categories
          const requests = selectedCats.map(cat => 
            axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`)
          );
          const responses = await Promise.all(requests);
          responses.forEach(r => {
            if (r.data && r.data.articles) {
              allArticles = [...allArticles, ...r.data.articles];
            }
          });
        } else {
          // Get news for one specific category
          const res = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`);
          allArticles = res.data.articles || [];
        }

        // Sort: Newest first
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Remove duplicates based on URL
        const uniqueArticles = Array.from(new Set(allArticles.map(a => a.url)))
          .map(url => allArticles.find(a => a.url === url));

        setArticles(uniqueArticles.slice(0, 40));
        setLoading(false);
      } catch (e) { 
        console.error("Fetch Error:", e);
        setLoading(false); 
      }
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  return (
    <div>
      <div className="view-indicator">
        {activeView === 'for-you' ? (
          <p>Personalized feed: <b>{selectedCats.join(", ")}</b></p>
        ) : (
          <p>Browsing <b>{activeView}</b></p>
        )}
      </div>
      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem 
              key={i} 
              title={news.title}
              description={news.description}
              urlToImage={news.urlToImage}
              url={news.url}
              sourceName={news.source ? news.source.name : "News"}
              publishedAt={news.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;