/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';

// --- LARGE DIVERSE BACKUP (In case API is sleeping) ---
const backupArticles = [
  { title: "Sensex and Nifty hit All-Time High", description: "Indian markets surged today following strong global cues and infrastructure growth.", image: "https://images.unsplash.com/photo-1611974715853-2b8ef9a3d136?w=800", url: "https://moneycontrol.com", source: { name: "Financial Express" }, publishedAt: new Date().toISOString() },
  { title: "New AI Policy announced for Indian Startups", description: "The government has unveiled a new framework to support AI research and data centers.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", url: "https://techcrunch.com", source: { name: "Tech India" }, publishedAt: new Date().toISOString() },
  { title: "India vs Australia: Final Match Updates", description: "The cricket world looks on as the two giants face off in the final championship match.", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800", url: "https://espncricinfo.com", source: { name: "CricInfo" }, publishedAt: new Date().toISOString() },
  { title: "Health Revolution: New Vaccine Milestone", description: "Researchers have achieved a 95% success rate in new trials for malaria prevention.", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800", url: "https://who.int", source: { name: "Health Line" }, publishedAt: new Date().toISOString() },
  { title: "Tesla expands operations to Pune and Bangalore", description: "Elon Musk confirms the first Indian factory will be set up by the end of the next fiscal year.", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800", url: "https://reuters.com", source: { name: "Reuters Business" }, publishedAt: new Date().toISOString() }
];

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // YOUR API KEY
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
        // GNews logic: map 'general' to 'world' for better variety
        const mapCat = (c) => (c === 'general' || c === 'for-you') ? 'world' : c;
        
        // LIMIT: To save your API key, we only make ONE call per click
        const url = `https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&max=10&apikey=${API_KEY}`;
        
        const res = await axios.get(url);
        const allArticles = res.data.articles || [];

        if (allArticles.length === 0) throw new Error("API Limit");

        // Process sentiment logic
        const analyzed = allArticles.map(a => {
            const blob = (a.title + (a.description || "")).toLowerCase();
            if (blob.match(/death|crash|war|killed|fire|arrest/)) a.mood = "Urgent";
            else if (blob.match(/won|success|launch|gold|growth/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        setArticles(analyzed);
      } catch (err) { 
        console.warn("API Failed, using diverse backup data...");
        setArticles(backupArticles); 
      }
      setLoading(false);
    };
    fetchData();
  }, [activeView, country]); // Removed selectedCats from here to stop multiple unnecessary calls

  const handleSave = async (article) => {
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
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
            <img src={selectedArticle.image || selectedArticle.urlToImage} className="reader-img" alt="news" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Full Source →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} urlToImage={news.image || news.urlToImage} sourceName={news.source.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;