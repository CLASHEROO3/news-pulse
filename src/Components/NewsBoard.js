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
          const requests = selectedCats.map(cat => axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`));
          const responses = await Promise.all(requests);
          responses.forEach(r => { if (r.data && r.data.articles) allArticles = [...allArticles, ...r.data.articles]; });
        } else {
          const res = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`);
          allArticles = res.data.articles || [];
        }

        // Sort by Time (Newest First)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Remove duplicates
        const unique = Array.from(new Set(allArticles.map(a => a.url))).map(url => allArticles.find(a => a.url === url));
        
        setArticles(unique.slice(0, 40));
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  return (
    <div>
      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} {...news} sourceName={news.source.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;