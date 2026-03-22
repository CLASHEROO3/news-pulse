import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ category, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Saurav's API is key-less and works on Vercel
    const url = `https://saurav.tech/NewsAPI/top-headlines/category/${category}/${country}.json`;

    axios.get(url)
      .then(response => {
        setArticles(response.data.articles.slice(0, 24));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, country]);

  return (
    <div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="news-container">
          {articles.map((news, index) => (
              <NewsItem key={index} title={news.title} description={news.description} src={news.urlToImage} url={news.url} source={news.source.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsBoard;