/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country, searchTerm, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (activeView === "bookmarks") {
        const { data } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
        setArticles(data || []);
        setLoading(false);
        return;
      }

      try {
        let url = "";
        // Logic: Use Search API if user types, else use Category API
        if (activeView === "search") {
           url = `https://gnews.io/api/v4/search?q=${searchTerm}&lang=en&country=${country}&apikey=94bf29d818474f184199d5e8f8139f10`;
        } else {
           // We use the High-Speed Mirror for categories
           const cat = (activeView === "for-you") ? "general" : activeView;
           url = `https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`;
        }

        const res = await axios.get(url);
        const data = res.data.articles || [];

        // SENTIMENT LOGIC
        const analyzed = data.map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|war|crash|arrest|alert/)) a.mood = "Urgent";
            else if (text.match(/success|win|gold|launch|profit/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        setArticles(unique.slice(0, 30));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country, searchTerm]);

  const handleSave = async (article) => {
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
      image_url: article.urlToImage || article.image,
      source: article.source?.name || article.source,
      published_at: article.publishedAt
    });
    if (!error) { onUpdate(); alert("Successfully saved to Cloud Database!"); }
  };

  return (
    <div>
      {/* READER MODE */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image} className="reader-img" alt="news" />
            <div className="reader-text-box">
              <h1 style={{fontSize:'2rem', color:'var(--navy)'}}>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.1rem', color:'#444', borderLeft:'4px solid var(--gold)', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="btn-read" style={{display:'inline-block', textDecoration:'none', marginTop:'20px'}}>View Original Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center" style={{margin:'100px auto', width:'40px', height:'40px', border:'4px solid #ddd', borderTopColor:'#c59235', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} urlToImage={news.urlToImage || news.image} sourceName={news.source?.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default NewsBoard;