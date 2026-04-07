/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
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
        let allArticles = [];
        if (activeView === "for-you") {
          const reqs = selectedCats.map(cat => axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`));
          const resps = await Promise.all(reqs);
          resps.forEach(r => allArticles = [...allArticles, ...r.data.articles]);
        } else {
          const res = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`);
          allArticles = res.data.articles || [];
        }

        // SENTIMENT ANALYSIS LOGIC
        const processed = allArticles.map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|arrest|killed|war|crisis|danger/)) a.sentiment = "Urgent";
            else if (text.match(/success|won|win|profit|new|launch/)) a.sentiment = "Positive";
            else a.sentiment = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(processed.map(a => a.url))).map(url => processed.find(a => a.url === url));
        setArticles(unique.slice(0, 40));
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  const handleBookmark = async (article) => {
    try {
        const { error } = await supabase.from('bookmarks').upsert({
            title: article.title,
            url: article.url,
            image_url: article.urlToImage || article.image_url,
            source: article.source?.name || article.source,
            published_at: article.publishedAt
        });

        if (error) {
            console.error("Supabase Error:", error.message);
            alert("Database Error: Check if RLS is disabled in Supabase.");
        } else {
            onUpdate();
            alert("Article saved to your Cloud Dashboard!");
        }
    } catch (e) {
        alert("Connection failed. Check your internet.");
    }
  };

  return (
    <div>
      {/* READER OVERLAY */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image_url} className="reader-img" alt="news" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                [Cloud Sync Active] This verified report from {selectedArticle.source?.name || selectedArticle.source} has been analyzed by the NewsPulse engine.
                To read the full multimedia story, please use the source link below.
              </p>
              <a href={selectedArticle.url} target="_blank" className="source-link">Read Full Official Article</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem 
              key={i} index={i} {...news} 
              sourceName={news.source?.name || news.source} 
              onBookmark={() => handleBookmark(news)}
              onReadMore={() => setSelectedArticle(news)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;