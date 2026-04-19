/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

// --- FAILSAFE DATA (Embedded directly so it never errors) ---
const backupArticles = [
  {
    title: "Indian Economy Shows Strong Recovery in Recent Quarter",
    description: "The latest fiscal reports indicate a significant surge in the manufacturing and service sectors across India.",
    urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136?w=800",
    url: "https://moneycontrol.com",
    source: { name: "Financial Times" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "ISRO Successfully Tests New Rocket Engine for Future Missions",
    description: "The space agency has reached a new milestone in indigenous propulsion technology for deep space exploration.",
    urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800",
    url: "https://isro.gov.in",
    source: { name: "ISRO News" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "New AI Hub to be Established in Bangalore Tech Park",
    description: "Major tech giants are collaborating with the government to create an advanced research center for Artificial Intelligence.",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    url: "https://techcrunch.com",
    source: { name: "Tech India" },
    publishedAt: new Date().toISOString()
  }
];

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
        setArticles(data || []);
        setLoading(false);
        return;
      }

      try {
        let allArticles = [];
        const mapCat = (c) => (c === 'general' || c === 'for-you') ? 'general' : c;
        const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=${API_KEY}`);
        
        allArticles = res.data.articles || [];
        if (allArticles.length === 0) throw new Error("No data");

        const analyzed = allArticles.map(a => {
            const blob = (a.title + (a.description || "")).toLowerCase();
            if (blob.match(/death|crash|war|killed|fire|arrest|crisis/)) a.mood = "Urgent";
            else if (blob.match(/success|won|win|profit|new|launch/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        setArticles(unique.slice(0, 30));
      } catch (e) { 
        console.warn("API offline, showing backup news...");
        setArticles(backupArticles); 
      }
      setLoading(false);
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  const handleSave = async (article) => {
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
      image_url: article.image || article.urlToImage || article.image_url,
      source: article.source?.name || article.source,
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
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" alt="Hero" />
            <div className="reader-text-box">
              <span className="reader-source" style={{color:'var(--gold)', fontWeight:'800', fontSize:'0.8rem', textTransform:'uppercase'}}>{selectedArticle.source?.name || selectedArticle.source}</span>
              <h1 style={{fontSize:'2rem', color:'var(--navy)', margin:'15px 0'}}>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.15rem', color:'#444', fontWeight:'600', marginBottom:'25px', borderLeft:'4px solid var(--gold)', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link" style={{display:'inline-block', background:'var(--navy)', color:'var(--gold)', padding:'15px 30px', textDecoration:'none', fontWeight:'800', borderRadius:'10px', marginTop:'20px'}}>View Full Official Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center" style={{margin:'100px auto', width:'40px', height:'40px', border:'4px solid #ddd', borderTopColor:'#c59235', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} urlToImage={news.image || news.urlToImage} sourceName={news.source?.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default NewsBoard;