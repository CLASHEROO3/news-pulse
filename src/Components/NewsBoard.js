/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

const emergencyNews = [
  { title: "RIL shares surge 5% as net profit beats estimates", description: "Reliance Industries reported a strong quarterly growth driven by retail and telecom sectors.", urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136", url: "https://moneycontrol.com", source: { name: "LiveMint" }, publishedAt: new Date().toISOString() },
  { title: "ISRO tests next-gen rocket engine for Gaganyaan", description: "The space agency successfully completed the high-thrust engine test at the Mahendragiri facility.", urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933", url: "https://isro.gov.in", source: { name: "The Hindu" }, publishedAt: new Date().toISOString() },
  { title: "New AI Hub inaugurated in Bangalore by Tech Giants", description: "A collaborative research center for Artificial Intelligence and Machine Learning was opened today.", urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995", url: "https://techcrunch.com", source: { name: "NDTV Tech" }, publishedAt: new Date().toISOString() },
  { title: "Indian Cricket Team leads World Rankings", description: "After a series win, the Indian team secures the top spot in ICC rankings across all formats.", urlToImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da", url: "https://espn.in", source: { name: "Sports Central" }, publishedAt: new Date().toISOString() },
  { title: "Health Ministry launches Digital Mission for Rural India", description: "The project aims to provide tele-consultation services to over 10,000 villages by year end.", urlToImage: "https://images.unsplash.com/photo-1576091160550-2173bdd99625", url: "https://pib.gov.in", source: { name: "Health Desk" }, publishedAt: new Date().toISOString() },
  { title: "Apple expands manufacturing plant in Tamil Nadu", description: "The new facility is part of the Make in India initiative and will create 20,000 new jobs.", urlToImage: "https://images.unsplash.com/photo-1556656793-062ff98782ee", url: "https://reuters.com", source: { name: "Reuters" }, publishedAt: new Date().toISOString() }
];

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
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
        const mapCat = (c) => (c === 'general' || c === 'for-you') ? 'general' : c;
        const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=94bf29d818474f184199d5e8f8139f10`);
        
        const all = (res.data.articles || []).map(a => {
            const text = (a.title + a.description).toLowerCase();
            if (text.match(/death|war|crash|arrest/)) a.mood = "Urgent";
            else if (text.match(/success|won|launch|profit/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        setArticles(all.length > 0 ? all : emergencyNews);
      } catch (e) { setArticles(emergencyNews); }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country]);

  const handleSave = async (a) => {
    const { error } = await supabase.from('bookmarks').upsert({ title: a.title, url: a.url, image_url: a.image || a.urlToImage, source: a.source.name || a.source });
    if (!error) { onUpdate(); alert("News synced to Cloud!"); }
  };

  return (
    <div>
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.2rem', color:'#444', lineHeight:'1.5', borderLeft:'5px solid #c59235', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link" style={{display:'inline-block', background:'var(--navy)', color:'var(--gold)', padding:'15px 30px', textDecoration:'none', fontWeight:'800', borderRadius:'10px', marginTop:'20px'}}>View Official Article</a>
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