/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const API_KEY = '94bf29d818474f184199d5e8f8139f10';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (activeView === "bookmarks") {
        const { data } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
        setArticles(data || []); setLoading(false); return;
      }

      try {
        const mapCat = (c) => (c === 'general' || c === 'for-you') ? 'world' : c;
        const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=${API_KEY}`);
        
        const analyzed = (res.data.articles || []).map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|arrest|war|crash|killed/)) a.mood = "Urgent";
            else if (text.match(/success|won|win|gold|launch/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        // Unique articles only
        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        setArticles(unique.slice(0, 30));
      } catch (err) { 
        console.warn("API Error, demoing backup news...");
      }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country]);

  const handleSave = async (article) => {
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title, url: article.url, 
      image_url: article.image || article.urlToImage, 
      source: article.source.name || article.source,
      published_at: article.publishedAt
    });
    if (!error) { onUpdate(); alert("Successfully saved to Cloud!"); }
  };

  return (
    <div>
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" />
            <div className="reader-text-box">
              <span className="reader-source" style={{color:'var(--gold)', fontWeight:'800', textTransform:'uppercase'}}>{selectedArticle.source.name || selectedArticle.source}</span>
              <h1 style={{fontSize:'2rem', color:'var(--navy)', margin:'15px 0'}}>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.15rem', color:'#444', borderLeft:'4px solid var(--gold)', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link" style={{display:'inline-block', background:'var(--navy)', color:'var(--gold)', padding:'15px 30px', textDecoration:'none', fontWeight:'800', borderRadius:'10px', marginTop:'20px'}}>View Full Official Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center" style={{margin:'100px auto', width:'40px', height:'40px', border:'4px solid #ddd', borderTopColor:'#c59235', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} urlToImage={news.image || news.urlToImage} sourceName={news.source.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default NewsBoard;