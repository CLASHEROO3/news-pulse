/**
 * NewsBoard Component
 * Handles data fetching logic and maps headlines into UI cards.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ category, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Using Saurav's News API (Mirror of NewsAPI that works on Hosted Sites)
    const url = `https://saurav.tech/NewsAPI/top-headlines/category/${category}/${country}.json`;

    axios.get(url)
      .then(response => {
        // Cleaning Data: Filter out articles with missing essential info
        const cleanData = response.data.articles.filter(item => item.title && item.url);
        setArticles(cleanData.slice(0, 24)); // Displaying top 24 results
        setLoading(false);
      })
      .catch((error) => {
        console.error("Critical API Error:", error);
        setLoading(false);
      });
  }, [category, country]); // Re-fetch data whenever category or country changes

  return (
    <div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="news-container">
          {articles.map((news, index) => (
              <NewsItem 
                key={index} 
                title={news.title} 
                description={news.description} 
                src={news.urlToImage} 
                url={news.url} 
                source={news.source.name} 
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;