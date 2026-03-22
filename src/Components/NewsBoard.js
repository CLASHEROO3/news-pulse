import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ selectedCats, country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const requests = selectedCats.map(cat => 
          axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`)
        );
        const responses = await Promise.all(requests);
        let combined = [];
        responses.forEach(r => combined = [...combined, ...r.data.articles]);
        
        // Sort by actual time (Newest first)
        combined.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Remove duplicates
        const unique = Array.from(new Set(combined.map(a => a.url)))
                            .map(url => combined.find(a => a.url === url));

        setArticles(unique.slice(0, 40));
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchAll();
  }, [selectedCats, country]);

  return (
    <div>
      {loading ? <div className="spinner" style={{margin:'100px auto', width:'40px', height:'40px', border:'4px solid #ddd', borderTopColor:'#c59235', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} title={news.title} description={news.description} src={news.urlToImage} url={news.url} source={news.source.name} publishedAt={news.publishedAt} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default NewsBoard;