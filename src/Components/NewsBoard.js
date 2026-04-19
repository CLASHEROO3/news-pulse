/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

// --- MASSIVE DIVERSE BACKUP NEWS (For Exam Day Security) ---
const backupData = [
  { title: "RIL Net Profit beats estimates in Q4", description: "Reliance Industries reported a strong growth across its digital and energy business units.", urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136", url: "https://moneycontrol.com", source: { name: "LiveMint" }, publishedAt: new Date().toISOString() },
  { title: "ISRO Gaganyaan Mission: Successful Engine Test", description: "The space agency has completed the long-duration test of the Vikas engine for future manned missions.", urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933", url: "https://isro.gov.in", source: { name: "The Hindu" }, publishedAt: new Date().toISOString() },
  { title: "New Tech Park to open in Hyderabad", description: "Over 50 global companies have signed up to open offices in the upcoming AI-dedicated tech hub.", urlToImage: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74", url: "https://ndtv.com", source: { name: "NDTV Tech" }, publishedAt: new Date().toISOString() },
  { title: "World Cup 2024: India vs Australia updates", description: "The highly anticipated match sees India leading the group stage points table.", urlToImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da", url: "https://espn.in", source: { name: "Sports Express" }, publishedAt: new Date().toISOString() }
];

const NewsBoard = ({ activeView, selectedCats, country, searchTerm, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (activeView === "bookmarks") {
        const { data } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
        setArticles(data || []); setLoading(false); return;
      }

      try {
        let url = "";
        if (activeView === "search") {
          url = `https://gnews.io/api/v4/search?q=${searchTerm}&lang=en&country=${country}&apikey=94bf29d818474f184199d5e8f8139f10`;
        } else {
          const mapCat = (c) => (c === 'general' || c === 'for-you') ? 'world' : c;
          url = `https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=94bf29d818474f184199d5e8f8139f10`;
        }

        const res = await axios.get(url);
        const data = res.data.articles.map(a => {
            const text = (a.title + a.description).toLowerCase();
            if (text.match(/death|arrest|war|crash/)) a.mood = "Urgent";
            else if (text.match(/success|won|win|gold/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });
        setArticles(data.length > 0 ? data : backupData);
      } catch (e) { setArticles(backupData); }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country, searchTerm]);

  const handleSave = async (a) => {
    const { error } = await supabase.from('bookmarks').upsert({ title: a.title, url: a.url, image_url: a.image || a.urlToImage, source: a.source.name || a.source });
    if (!error) { onUpdate(); alert("Article Synced to Cloud!"); }
  };

  return (
    <div>
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image} className="reader-img" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.15rem', color:'#444', lineHeight:'1.6', borderLeft:'5px solid #c59235', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Full Official Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} urlToImage={news.urlToImage || news.image} sourceName={news.source.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;