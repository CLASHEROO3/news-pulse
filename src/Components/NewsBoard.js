/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const backupData = [
  { title: "RIL shares surge 5% as profits beat estimates", description: "Reliance Industries reported a significant jump in quarterly net profit driven by energy and retail growth.", urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136", url: "https://moneycontrol.com", source: { name: "LiveMint" }, publishedAt: new Date().toISOString() },
  { title: "ISRO prepares for next-gen rocket launch", description: "The space agency is set to test its autonomous landing technology at the Sriharikota range.", urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933", url: "https://isro.gov.in", source: { name: "The Hindu" }, publishedAt: new Date().toISOString() },
  { title: "New Health-Tech Hub inaugurated in Hyderabad", description: "The hub will focus on AI-driven diagnostics and remote patient monitoring solutions.", urlToImage: "https://images.unsplash.com/photo-1576091160550-2173bdd99625", url: "https://ndtv.com", source: { name: "NDTV" }, publishedAt: new Date().toISOString() }
];

const NewsBoard = ({ activeView, selectedCats, country, searchTerm, supabase, onUpdate }) => {
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
          url = `https://gnews.io/api/v4/search?q=${searchTerm}&lang=en&country=${country}&apikey=${API_KEY}`;
        } else if (activeView === "for-you") {
          // Unified logic: Uses Saurav for unlimited "For You" experience
          url = `https://saurav.tech/NewsAPI/top-headlines/category/general/${country}.json`;
        } else {
          url = `https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`;
        }

        const res = await axios.get(url);
        const all = (res.data.articles || []).map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|arrest|war|crash|killed/)) a.mood = "Urgent";
            else if (text.match(/success|won|win|gold|launch/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(all.map(a => a.url))).map(url => all.find(a => a.url === url));
        setArticles(unique.length > 0 ? unique.slice(0, 40) : backupData);
      } catch (e) { setArticles(backupData); }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country, searchTerm]);

  const handleSave = async (a) => {
    const { error } = await supabase.from('bookmarks').upsert({ title: a.title, url: a.url, image_url: a.urlToImage || a.image, source: a.source?.name || a.source });
    if (!error) { onUpdate(); alert("News Synced to Cloud!"); }
  };

  return (
    <div className="board">
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image} className="reader-img" />
            <div className="reader-text-box">
              <span className="reader-source">{selectedArticle.source?.name || selectedArticle.source}</span>
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Full Official Article →</a>
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