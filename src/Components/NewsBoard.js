import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ selectedCats, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMultiNews = async () => {
      setLoading(true);
      try {
        // Fetch from all selected categories at once
        const requests = selectedCats.map(cat => 
          axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`)
        );

        const responses = await Promise.all(requests);
        
        // Merge all articles into one big list
        let allArticles = [];
        responses.forEach(res => {
          allArticles = [...allArticles, ...res.data.articles];
        });

        // SORT BY TIME (Newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Remove duplicates and set
        const uniqueArticles = Array.from(new Set(allArticles.map(a => a.url)))
          .map(url => allArticles.find(a => a.url === url));

        setArticles(uniqueArticles.slice(0, 40));
        setLoading(false);
      } catch (error) {
        console.error("API Error", error);
        setLoading(false);
      }
    };

    fetchMultiNews();
  }, [selectedCats, country]);

  return (
    <div className="news-grid-wrapper">
      <div className="active-filters">
        {selectedCats.map(c => <span key={c} className="filter-tag">#{c}</span>)}
      </div>
      {loading ? <div className="spinner"></div> : (
        <div className="news-container">
          {articles.map((news, index) => (
            <NewsItem 
              key={index} 
              title={news.title} 
              description={news.description} 
              src={news.urlToImage} 
              url={news.url} 
              source={news.source.name} 
              publishedAt={news.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;