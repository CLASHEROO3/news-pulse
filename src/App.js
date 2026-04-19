/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

const supabase = createClient(
  'https://hmylzizegexlxcltpxfb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWx6aXplZ2V4bHhjbHRweGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njg5NzgsImV4cCI6MjA5MTE0NDk3OH0.DAqG8sfCj9au1CSG3dchA7Em4wvS0m9C_PXR5QHjPKE'
);

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const ALL_CATS = ["general", "business", "technology", "sports", "entertainment", "health", "science"];

  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem('np_device_id') || 'u_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('np_device_id', id);
      const { data } = await supabase.from('user_settings').select('*').eq('device_id', id).single();
      if (data) { setSelectedCats(data.selected_categories); setCountry(data.region); } 
      else { setShowOnboarding(true); }
      fetchCount();
    };
    init();
  }, []);

  useEffect(() => {
    const sync = async () => {
      await supabase.from('user_settings').upsert({
        device_id: localStorage.getItem('np_device_id'),
        selected_categories: selectedCats,
        region: country
      });
    };
    sync();
  }, [selectedCats, country]);

  const fetchCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.search.value;
    if(val) { setSearchTerm(val); setActiveView("search"); }
  };

  return (
    <div className="App">
      {/* 1. MOVING BREAKING NEWS TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-title">BREAKING</div>
        <div className="ticker">
          <div className="ticker-item">ISRO successfully launches Gaganyaan test vehicle...</div>
          <div className="ticker-item">Sensex and Nifty hit record highs today...</div>
          <div className="ticker-item">Global Tech Summit begins in Bangalore...</div>
          <div className="ticker-item">New AI models introduced for Indian languages...</div>
        </div>
      </div>

      {/* 2. ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Personalize Your Feed</h2>
            <div className="onboarding-grid">
              {ALL_CATS.map(cat => (
                <button key={cat} className={`pill ${selectedCats.includes(cat)?'active':''}`} onClick={() => {
                  if(selectedCats.includes(cat)) { if(selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)) }
                  else setSelectedCats([...selectedCats, cat])
                }}>{cat}</button>
              ))}
            </div>
            <button className="master-btn" onClick={() => setShowOnboarding(false)}>Start Reading</button>
          </div>
        </div>
      )}

      {/* 3. MASTER NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand"><img src="/logo.png" alt="NP" className="nav-logo" /><h1 className="logo-text">News<span>Pulse</span></h1></div>
        </div>

        {/* restored search bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search news topic..." />
          <button type="submit">🔍</button>
        </form>

        <div className="nav-right">
          <div className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button className="gear-btn" onClick={() => setShowOnboarding(true)}>⚙</button>
        </div>
      </nav>

      {/* 4. SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button onClick={() => setIsMenuOpen(false)}>×</button></div>
        <div className="sidebar-content">
          <button className={`menu-item ${activeView==='bookmarks'?'active':''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false)}}>⭐ Saved Articles</button>
          <hr />
          <button className={`menu-item ${country==='in'?'active':''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false)}}>🇮🇳 India News</button>
          <button className={`menu-item ${country==='us'?'active':''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false)}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 5. SUB-NAV TABS */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => {setActiveView('for-you'); setSearchTerm("");}}>★ For You</button>
        {ALL_CATS.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => {setActiveView(cat); setSearchTerm("");}}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} searchTerm={searchTerm} supabase={supabase} onUpdate={fetchCount} />

      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse | Real-time Engine | Developed by [Your Group Names]</p>
      </footer>
    </div>
  );
}
export default App;