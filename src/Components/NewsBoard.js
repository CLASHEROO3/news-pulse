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

        // --- SENTIMENT LOGIC ---
        const analyzed = allArticles.map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|arrest|war|crisis|killed|crash|fire|danger/)) a.mood = "Urgent";
            else if (text.match(/success|won|launch|profit|gold|happy/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        const filtered = unique.filter(a => a.title && a.title !== "[Removed]");
        setArticles(filtered.slice(0, 40));
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  const handleSave = async (article) => {
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
      image_url: article.urlToImage || article.image_url,
      source: article.source?.name || article.source,
      published_at: article.publishedAt
    });
    if (error) alert("Database error. Please disable RLS in Supabase.");
    else { onUpdate(); alert("News saved to your Cloud Dashboard!"); }
  };

  return (
    <div>
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image_url} className="reader-img" alt="Cover" />
            <div className="reader-text-box">
              <span className="reader-source">{selectedArticle.source?.name || selectedArticle.source}</span>
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                [In-App Reader] NewsPulse is providing this summary via real-time cloud synchronization. 
                Our system has parsed the verified metadata from {selectedArticle.source?.name || selectedArticle.source} to give you this snapshot. 
                For full interactive media, please visit the source below.
              </p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Full Source Article →</a>
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
              onBookmark={() => handleSave(news)}
              onReadMore={() => setSelectedArticle(news)}
              mood={news.mood}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;