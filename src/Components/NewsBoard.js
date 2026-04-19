/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // YOUR LIVE GNEWS API KEY
  const API_KEY = '94bf29d818474f184199d5e8f8139f10';

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
        // GNews uses 'world' instead of 'general' for better results
        const mapCat = (c) => c === 'general' ? 'world' : c;

        if (activeView === "for-you") {
          const reqs = selectedCats.map(cat => axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(cat)}&lang=en&country=${country}&apikey=${API_KEY}`));
          const resps = await Promise.all(reqs);
          resps.forEach(r => { if (r.data.articles) allArticles = [...allArticles, ...r.data.articles]; });
        } else {
          const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=${API_KEY}`);
          allArticles = res.data.articles || [];
        }

        // --- SENTIMENT ENGINE ---
        const analyzed = allArticles.map(a => {
            const blob = (a.title + (a.description || "")).toLowerCase();
            if (blob.match(/death|crash|war|killed|fire|emergency|arrest/)) a.mood = "Urgent";
            else if (blob.match(/won|launch|gold|success|growth|happy/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        setArticles(unique.slice(0, 30));
        setLoading(false);
      } catch (err) { 
        console.error("GNews API Limit or Error:", err);
        setLoading(false); 
      }
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
    if (!error) { onUpdate(); alert("Successfully saved to Cloud Database!"); }
  };

  return (
    <div>
      {/* IN-APP READER */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" alt="Cover" />
            <div className="reader-text-box">
              <span className="reader-source">{selectedArticle.source.name || selectedArticle.source}</span>
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                [In-App Reader] This live story has been synchronized from verified news kernels. 
                NewsPulse provides real-time data merging for a superior reading experience. 
                To view the original source including multimedia, use the link below.
              </p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Full Source →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} {...news} urlToImage={news.image || news.urlToImage} sourceName={news.source.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default NewsBoard;