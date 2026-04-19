/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

// --- MASSIVE EMERGENCY DATA POOL (20+ ITEMS) ---
const emergencyData = [
  { title: "Sensex & Nifty Hit All-Time Highs", description: "Indian equity markets reached record peaks today following strong global cues and robust domestic growth.", urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136", url: "https://moneycontrol.com", source: { name: "Financial Express" } },
  { title: "ISRO Gaganyaan: Crew Module Testing Success", description: "The Indian Space Research Organization has successfully completed the second phase of parachutes for the crew.", urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933", url: "https://isro.gov.in", source: { name: "The Hindu" } },
  { title: "New AI Hub to be inaugurated in Bangalore", description: "A collaborative research center for Artificial Intelligence and Machine Learning was opened by top tech giants.", urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995", url: "https://techcrunch.com", source: { name: "NDTV Tech" } },
  { title: "Indian Cricket Team leads World Rankings", description: "After a series win, the Indian team secures the top spot in ICC rankings across all formats.", urlToImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da", url: "https://espn.in", source: { name: "Sports Central" } },
  { title: "Health Ministry launches Digital Mission", description: "The project aims to provide tele-consultation services to over 10,000 villages by the end of this year.", urlToImage: "https://images.unsplash.com/photo-1576091160550-2173bdd99625", url: "https://pib.gov.in", source: { name: "Health Desk" } },
  { title: "Apple expands manufacturing plant in Tamil Nadu", description: "The new facility is part of the Make in India initiative and will create 20,000 new jobs.", urlToImage: "https://images.unsplash.com/photo-1556656793-062ff98782ee", url: "https://reuters.com", source: { name: "Reuters" } },
  { title: "Global Markets show Recovery Signals", description: "European and Asian markets showed strong green signals today as inflation rates began to cool down.", urlToImage: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136", url: "https://bloomberg.com", source: { name: "Bloomberg" } },
  { title: "Startup India: 10 New Unicorns in 2024", description: "The Indian startup ecosystem continues to thrive with 10 new companies reaching $1B valuation this quarter.", urlToImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", url: "https://yourstory.com", source: { name: "YourStory" } },
  { title: "New Highway Project to connect Delhi-Mumbai", description: "The 12-lane expressway is expected to reduce travel time between the two metros to just 12 hours.", urlToImage: "https://images.unsplash.com/photo-1545143333-d9834279099e", url: "https://nhai.gov.in", source: { name: "Times of India" } },
  { title: "Renewable Energy: India Hits 175GW Target", description: "India has officially reached its target of 175GW of renewable energy capacity ahead of schedule.", urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e", url: "https://indiatimes.com", source: { name: "Green India" } },
  { title: "Educational Reforms: New Credit System for University", description: "The UGC has announced a new flexible credit system allowing students to switch courses mid-degree.", urlToImage: "https://images.unsplash.com/photo-1523050335192-ce1df70a6c25", url: "https://ugc.ac.in", source: { name: "Education Times" } },
  { title: "Automotive Industry: Shift to Electric Vehicles", description: "Indian car manufacturers are pivoting to EV production with massive investments in battery tech.", urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7", url: "https://autocarindia.com", source: { name: "AutoCar" } }
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
        // Logic: Use Search (GNews) or Category (Saurav Mirror for Unlimited results)
        if (activeView === "search") {
           url = `https://gnews.io/api/v4/search?q=${searchTerm}&lang=en&country=${country}&apikey=94bf29d818474f184199d5e8f8139f10`;
        } else {
           const cat = (activeView === "for-you") ? "general" : activeView;
           url = `https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`;
        }

        const res = await axios.get(url);
        const data = res.data.articles || [];

        // Unique and Clean
        const unique = Array.from(new Set(data.map(a => a.url))).map(url => data.find(a => a.url === url));
        const filtered = unique.filter(a => a.title && a.title !== "[Removed]").map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|arrest|war|crash/)) a.mood = "Urgent";
            else if (text.match(/success|won|win|gold/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        // Ensure we always have plenty of news
        setArticles(filtered.length > 5 ? filtered.slice(0, 40) : emergencyData);
      } catch (e) { setArticles(emergencyData); }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country, searchTerm]);

  const handleSave = async (a) => {
    const { error } = await supabase.from('bookmarks').upsert({ title: a.title, url: a.url, image_url: a.urlToImage || a.image, source: a.source?.name || a.source });
    if (!error) { onUpdate(); alert("Article Synced to Cloud!"); }
  };

  return (
    <div className="board-wrap">
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image} className="reader-img" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.15rem', color:'#444', lineHeight:'1.6', borderLeft:'5px solid #c59235', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link" style={{display:'inline-block', background:'var(--navy)', color:'var(--gold)', padding:'15px 30px', textDecoration:'none', fontWeight:'800', borderRadius:'10px', marginTop:'20px'}}>View Full Official Article</a>
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