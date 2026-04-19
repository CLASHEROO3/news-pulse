/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_KEY = '94bf29d818474f184199d5e8f8139f10';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg(null);
      
      // 1. Handle Bookmarks View
      if (activeView === "bookmarks") {
        const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
        if (error) setErrorMsg("Could not load bookmarks from Supabase.");
        setArticles(data || []);
        setLoading(false);
        return;
      }

      try {
        let allArticles = [];
        // GNews Category Mapping
        const mapCat = (c) => (c === 'general' || c === 'for-you') ? 'general' : c;

        if (activeView === "for-you") {
          // To prevent API blocking, we fetch the first 3 categories only in 'For You'
          const limitedCats = selectedCats.slice(0, 3);
          const requests = limitedCats.map(cat => 
            axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(cat)}&lang=en&country=${country}&apikey=${API_KEY}`)
          );
          
          const responses = await Promise.all(requests);
          responses.forEach(r => {
            if (r.data && r.data.articles) allArticles = [...allArticles, ...r.data.articles];
          });
        } else {
          // Fetch single category
          const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=${API_KEY}`);
          allArticles = res.data.articles || [];
        }

        if (allArticles.length === 0) {
          setErrorMsg("No news found for this selection. Try a different category.");
        }

        // --- SENTIMENT ENGINE ---
        const analyzed = allArticles.map(a => {
            const blob = (a.title + (a.description || "")).toLowerCase();
            if (blob.match(/death|arrest|war|crisis|killed|crash|fire|danger/)) a.mood = "Urgent";
            else if (blob.match(/success|won|win|profit|new|launch|happy/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        // Unique and Filter
        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        setArticles(unique.slice(0, 30));
      } catch (err) { 
        console.error(err);
        if (err.response && err.response.status === 403) {
            setErrorMsg("API Daily Limit Reached (100 requests). Please wait or use a new key.");
        } else {
            setErrorMsg("Failed to connect to News Servers. Check your internet.");
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  const handleSave = async (article) => {
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
      image_url: article.image || article.urlToImage,
      source: article.source.name || article.source,
      published_at: article.publishedAt
    });
    if (!error) { onUpdate(); alert("Saved to Cloud!"); }
  };

  return (
    <div style={{minHeight: '60vh'}}>
      {/* READER OVERLAY */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" alt="news" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Full Source →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner-center"></div>
      ) : errorMsg ? (
        <div style={{textAlign: 'center', padding: '100px', color: '#64748b'}}>
          <h3>{errorMsg}</h3>
          <button onClick={() => window.location.reload()} className="chip-btn active" style={{marginTop:'20px'}}>Refresh Page</button>
        </div>
      ) : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} {...news} urlToImage={news.image || news.urlToImage} sourceName={news.source.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;