/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- DATABASE CONNECTION ---
const supabase = createClient(
  'https://hmylzizegexlxcltpxfb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWx6aXplZ2V4bHhjbHRweGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njg5NzgsImV4cCI6MjA5MTE0NDk3OH0.DAqG8sfCj9au1CSG3dchA7Em4wvS0m9C_PXR5QHjPKE'
);

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const CATEGORIES = ["general", "business", "technology", "sports", "entertainment", "health", "science"];

  useEffect(() => {
    const initUser = async () => {
      let id = localStorage.getItem('np_device_id') || 'u_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('np_device_id', id);
      const { data } = await supabase.from('user_settings').select('*').eq('device_id', id).single();
      if (data) { setSelectedCats(data.selected_categories); setCountry(data.region); } 
      else { setShowOnboarding(true); }
      setIsLoaded(true);
      refreshCount();
    };
    initUser();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      supabase.from('user_settings').upsert({
        device_id: localStorage.getItem('np_device_id'),
        selected_categories: selectedCats,
        region: country
      }).then(() => {});
    }
  }, [selectedCats, country, isLoaded]);

  const refreshCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.search.value;
    if(val) { setSearchQuery(val); setActiveView("search"); }
  };

  return (
    <div className="App">
      {/* 1. BREAKING NEWS TICKER */}
      <div className="news-ticker">
        <div className="ticker-label">BREAKING</div>
        <marquee>
          • New Tech Innovation in India • Market indices hit all-time high • ISRO successfully launches next-gen satellite • Global economy shows recovery signals •
        </marquee>
      </div>

      {/* 2. ONBOARDING */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Personalize NewsPulse</h2>
            <p>Select topics to build your <b>Cloud-Synced</b> feed.</p>
            <div className="onboarding-grid">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`chip ${selectedCats.includes(cat)?'active':''}`} onClick={() => {
                  if(selectedCats.includes(cat)) { if(selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)) }
                  else setSelectedCats([...selectedCats, cat])
                }}>{cat}</button>
              ))}
            </div>
            <button className="master-btn" onClick={() => setShowOnboarding(false)}>Start Reading</button>
          </div>
        </div>
      )}

      {/* 3. NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand"><img src="/logo.png" alt="NP" className="nav-logo" /><h1 className="logo-text">News<span>Pulse</span></h1></div>
        </div>

        <form className="nav-search-pc" onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search news..." />
        </form>

        <div className="nav-right">
          <div className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button className="gear-btn" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="live-date">{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
        </div>
      </nav>

      {/* 4. SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button onClick={() => setIsMenuOpen(false)}>×</button></div>
        <div className="sidebar-content">
          <button className={`menu-link ${activeView==='bookmarks'?'active':''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false)}}>⭐ Saved Articles</button>
          <hr />
          <p className="side-label">REGION</p>
          <button className={`menu-link ${country==='in'?'active':''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false)}}>🇮🇳 India</button>
          <button className={`menu-link ${country==='us'?'active':''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false)}}>🌎 Global</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 5. SUB-NAV */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => {setActiveView('for-you'); setSearchQuery("")}}>★ For You</button>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => {setActiveView(cat); setSearchQuery("")}}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} searchQuery={searchQuery} supabase={supabase} onUpdate={refreshCount} />
    </div>
  );
}
export default App;