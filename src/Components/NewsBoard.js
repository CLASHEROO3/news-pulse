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
          resps.forEach(r => { if (r.data && r.data.articles) allArticles = [...allArticles, ...r.data.articles]; });
        } else {
          const res = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${activeView}/${country}.json`);
          allArticles = res.data.articles || [];
        }

        const analyzed = allArticles.map(a => {
            const text = (a.title + (a.description || "")).toLowerCase();
            if (text.match(/death|arrest|war|crisis|killed|crash|fire|danger/)) a.mood = "Urgent";
            else if (text.match(/success|won|win|profit|new|launch/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        const unique = Array.from(new Set(analyzed.map(a => a.url))).map(url => analyzed.find(a => a.url === url));
        setArticles(unique.slice(0, 40));
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
    if (!error) { onUpdate(); alert("Successfully saved to Cloud Database!"); }
    else { alert("Error saving. Ensure RLS is disabled in Supabase."); }
  };

  return (
    <div>
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedArticle(null)}>× Close Reader</button>
            <img src={selectedArticle.urlToImage || selectedArticle.image_url} className="reader-img" alt="news" />
            <div className="reader-text-box">
              <span className="reader-source" style={{color:'var(--gold)', fontWeight:'800', fontSize:'0.8rem', textTransform:'uppercase'}}>{selectedArticle.source?.name || selectedArticle.source}</span>
              <h1 style={{fontSize:'2rem', color:'var(--navy)', margin:'15px 0'}}>{selectedArticle.title}</h1>
              <p style={{fontSize:'1.15rem', color:'#444', fontWeight:'600', marginBottom:'25px', borderLeft:'4px solid var(--gold)', paddingLeft:'15px'}}>{selectedArticle.description}</p>
              <a href={selectedArticle.url} target="_blank" className="source-link" style={{display:'inline-block', background:'var(--navy)', color:'var(--gold)', padding:'15px 30px', textDecoration:'none', fontWeight:'800', borderRadius:'10px'}}>View Full Official Article →</a>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="spinner-center"></div> : (
        <div className="news-container">
          {articles.map((news, i) => (
            <NewsItem key={i} index={i} {...news} sourceName={news.source?.name || news.source} onBookmark={() => handleSave(news)} onReadMore={() => setSelectedArticle(news)} mood={news.mood} />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsBoard;