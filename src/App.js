/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- SUPABASE CONFIGURATION ---
const supabase = createClient(
  'https://hmylzizegexlxcltpxfb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWx6aXplZ2V4bHhjbHRweGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0MTUyNjIsImV4cCI6MjAyNzk5MTI2Mn0.fake_key_replaced_by_user' 
); // PASTE YOUR FULL ANON KEY HERE

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health"];

  useEffect(() => {
    const savedConfig = localStorage.getItem('newspulse_config');
    if (!savedConfig) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(savedConfig));
    updateBookmarkCount();
  }, []);

  const updateBookmarkCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const handleCustomization = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      {/* 1. PERSONALIZATION MODAL (OVERLAY) */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Personalize Your Feed</h2>
            <p>Select topics for your <b>AI-Powered</b> custom stream.</p>
            <div className="onboarding-grid">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`} onClick={() => {
                  if (selectedCats.includes(cat)) { if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)); }
                  else setSelectedCats([...selectedCats, cat]);
                }}>{cat}</button>
              ))}
            </div>
            <button className="save-btn" onClick={handleCustomization}>Apply Preferences</button>
          </div>
        </div>
      )}

      {/* 2. PREMIUM NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="Logo" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right">
          <div className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙</button>
        </div>
      </nav>

      {/* 3. SIDEBAR SETTINGS */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button></div>
        <div className="sidebar-content">
          <p className="sidebar-label">Your Space</p>
          <button className={`menu-btn ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ Saved Articles</button>
          <hr style={{border:'0.5px solid #1e293b', margin:'15px 0'}} />
          <p className="sidebar-label">Regional Edition</p>
          <button className={`menu-btn ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India News</button>
          <button className={`menu-btn ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. SUB-NAV (MOBILE RESPONSIVE SWIPE) */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard 
        activeView={activeView} 
        selectedCats={selectedCats} 
        country={country} 
        supabase={supabase} 
        onUpdate={updateBookmarkCount} 
      />

      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse | Real-time Cloud Aggregator</p>
      </footer>
    </div>
  );
}
export default App;