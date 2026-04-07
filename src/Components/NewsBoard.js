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

        // --- UNIQUE FEATURE: SENTIMENT ANALYSIS ---
        const processed = allArticles.map(a => {
            const text = (a.title + a.description).toLowerCase();
            if (text.match(/killed|death|crash|war|fire|arrested|scam/)) a.sentiment = "Urgent";
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
    await supabase.from('bookmarks').upsert({
      title: article.title,
      url: article.url,
      image_url: article.urlToImage || article.image_url,
      source: article.source.name || article.source,
      published_at: article.publishedAt
    });
    onUpdate();
    alert("Saved to Database!");
  };

  return (
    <div className="news-container">
      {loading ? <div className="spinner"></div> : articles.map((news, i) => (
        <NewsItem key={i} {...news} sourceName={news.source?.name || news.source} onBookmark={() => handleBookmark(news)} index={i} />
      ))}
    </div>
  );
};
export default NewsBoard;