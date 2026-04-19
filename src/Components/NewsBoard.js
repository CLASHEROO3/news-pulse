/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const backupData = [
  { title: "RIL shares surge as profits beat estimates", description: "Reliance Industries reported a significant jump in quarterly net profit driven by energy and retail growth.", urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136", url: "https://moneycontrol.com", source: { name: "LiveMint" }, publishedAt: new Date().toISOString() },
  { title: "ISRO prepares for next-gen rocket launch", description: "The space agency is set to test its autonomous landing technology at the Sriharikota range.", urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933", url: "https://isro.gov.in", source: { name: "The Hindu" }, publishedAt: new Date().toISOString() },
  { title: "New Health-Tech Hub inaugurated in Hyderabad", description: "The hub will focus on AI-driven diagnostics and remote patient monitoring solutions.", urlToImage: "https://images.unsplash.com/photo-1576091160550-2173bdd99625", url: "https://ndtv.com", source: { name: "NDTV" }, publishedAt: new Date().toISOString() }
];

const NewsBoard = ({ activeView, selectedCats, country, searchQuery, supabase, onUpdate }) => {
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
        let url = "";
        if (activeView === "search") {
          url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&country=${country}&apikey=${API_KEY}`;
        } else if (activeView === "for-you") {
          url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=${country}&apikey=${API_KEY}`;
        } else {
          url = `https://gnews.io/api/v4/top-headlines?category=${activeView}&lang=en&country=${country}&apikey=${API_KEY}`;
        }

        const res = await axios.get(url);
        const analyzed = (res.data.articles || []).map(a => {
            const text = (a.title + a.description).toLowerCase();
            if (text.match(/death|arrest|war|crash/)) a.mood = "Urgent";
            else if (text.match(/success|won|win|gold/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });
        setArticles(analyzed.length > 0 ? analyzed : backupData);
      } catch (e) { setArticles(backupData); }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country, searchQuery]);

  const handleSave = async (a) => {
    const { error } = await supabase.from('bookmarks').upsert({ title: a.title, url: a.url, image_url: a.image || a.urlToImage, source: a.source.name || a.source });
    if (!error) { onUpdate(); alert("News Synced to Cloud!"); }
  };

  return (
    <div className="board">
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-box" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>Close Reader</button>
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" />
            <div className="reader-text">
                <h1>{selectedArticle.title}</h1>
                <p style={{fontSize:'1.2rem', color:'#444', fontWeight:'600', borderLeft:'5px solid #c59235', paddingLeft:'20px'}}>{selectedArticle.description}</p>
                <a href={selectedArticle.url} target="_blank" className="source-link">View Original Official Source →</a>
            </div>
          </div>
        </div>
      )}
      {loading ? <div className="spinner"></div> : (
        <div className="news-container">
          {articles.map((n, i) => (
            <NewsItem key={i} index={i} {...n} urlToImage={n.image || n.urlToImage} sourceName={n.source.name || n.source} onBookmark={() => handleSave(n)} onReadMore={() => setSelectedArticle(n)} mood={n.mood} />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;