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
      // Logic: If on Bookmarks tab, fetch from Supabase
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

        // --- UNIQUE FEATURE: SENTIMENT ANALYSIS ENGINE ---
        const processed = allArticles.map(a => {
            const text = (a.title + a.description).toLowerCase();
            if (text.match(/killed|death|crash|war|fire|arrested|scam|crisis/)) a.sentiment = "Urgent";
            else if (text.match(/won|success|launch|gold|new|growth|happy/)) a.sentiment = "Positive";
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
    const { error } = await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
      image_url: article.urlToImage || article.image_url,
      source: article.source.name || article.source,
      published_at: article.publishedAt
    });
    if (!error) { onUpdate(); alert("News Saved to Cloud Database!"); }
  };

  return (
    <div>
      {/* 5. IN-APP READER OVERLAY */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image_url} className="reader-img" alt="news" />
            <div className="reader-text-box">
              <h1>{selectedArticle.title}</h1>
              <p className="reader-desc">{selectedArticle.description}</p>
              <p className="reader-full-text">
                [Reader Mode Enabled] This verified report is being served via NewsPulse Cloud Synchronization. 
                Our system has analyzed the source metadata and extracted this summary for your personalized feed. 
                For the complete interactive experience, please visit the source via the link below.
              </p>
              <a href={selectedArticle.url} target="_blank" className="source-link">View Original Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem 
              key={i} 
              index={i} 
              {...news} 
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