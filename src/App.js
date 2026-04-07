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
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const ALL_CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health"];

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(saved));
    updateCount();
    document.title = "NewsPulse | Professional News Aggregator";
  }, []);

  const updateCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const handleApply = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      {/* 1. PERSONALIZATION MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Pick interests to build your <b>Cloud-Synced</b> feed.</p>
            <div className="onboarding-grid">
              {ALL_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`} 
                  onClick={() => {
                    if (selectedCats.includes(cat)) { if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)); }
                    else setSelectedCats([...selectedCats, cat]);
                  }}
                > {cat} </button>
              ))}
            </div>
            <button className="save-btn" onClick={handleApply}>Start Reading</button>
          </div>
        </div>
      )}

      {/* 2. NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right">
          <div className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button className="settings-trigger" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      </nav>

      {/* 3. SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Settings</h3>
           <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`menu-btn ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ My Saved Articles</button>
          <hr className="sidebar-hr" />
          <span className="sidebar-label">Regional Edition</span>
          <button className={`menu-btn ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India</button>
          <button className={`menu-btn ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. SUB-NAV */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} supabase={supabase} onUpdate={updateCount} />

      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse | Bharat Edition | Cloud Connected</p>
      </footer>
    </div>
  );
}

export default App;