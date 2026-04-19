/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

const supabase = createClient('https://hmylzizegexlxcltpxfb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWx6aXplZ2V4bHhjbHRweGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njg5NzgsImV4cCI6MjA5MTE0NDk3OH0.DAqG8sfCj9au1CSG3dchA7Em4wvS0m9C_PXR5QHjPKE');

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [searchTerm, setSearchTerm] = useState(""); // --- SEARCH FEATURE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const ALL_CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health", "science"];

  useEffect(() => {
    updateBookmarkCount();
    document.title = "NewsPulse | Real-time Dashboard";
  }, []);

  const updateBookmarkCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search news keywords..." 
            onChange={(e) => { setSearchTerm(e.target.value); if(e.target.value) setActiveView("search"); }}
          />
        </div>
        
        <div className="nav-right">
          <button className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</button>
          <span className="nav-date">{new Date().toLocaleDateString('en-IN', {month:'short', day:'numeric'})}</span>
        </div>
      </nav>

      {/* SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button></div>
        <div className="sidebar-content">
          <button className={`menu-btn ${activeView === 'bookmarks'?'active':''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ My Saved Articles</button>
          <hr />
          <button className={`menu-btn ${country === 'in'?'active':''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India News</button>
          <button className={`menu-btn ${country === 'us'?'active':''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:1500}} onClick={() => setIsMenuOpen(false)}></div>}

      {/* CATEGORIES */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} searchTerm={searchTerm} supabase={supabase} onUpdate={updateBookmarkCount} />
    </div>
  );
}

export default App;