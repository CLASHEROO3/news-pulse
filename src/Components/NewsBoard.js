import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

/**
 * NewsBoard Component
 * Fetches data from Saurav's Open-Source News API (Mirror of NewsAPI).
 */
const NewsBoard = ({ category, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Choosing Saurav's API because it allows free hosting on Vercel/Netlify
    const url = `https://saurav.tech/NewsAPI/top-headlines/category/${category}/${country}.json`;

    axios.get(url)
      .then(response => {
        // Cleaning data: showing only articles that have a title
        const cleanData = response.data.articles.filter(item => item.title && item.title !== "[Removed]");
        setArticles(cleanData.slice(0, 24));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Critical API Error:", error);
        setLoading(false);
      });
  }, [category, country]);

  return (
    <div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="news-container">
          {articles.length > 0 ? (
            articles.map((news, index) => (
              <NewsItem 
                key={index} 
                title={news.title} 
                description={news.description} 
                src={news.urlToImage} 
                url={news.url} 
                source={news.source.name} 
              />
            ))
          ) : (
            <div style={{textAlign:'center', width:'100%', padding:'100px'}}>
              <h2>News currently unavailable for this category.</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;