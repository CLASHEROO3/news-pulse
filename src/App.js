/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- CONFIGURATION ---
// 1. Ensure you use the "anon" public key from your Supabase API settings
const supabase = createClient(
  'https://hmylzizegexlxcltpxfb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWx6aXplZ2V4bHhjbHRweGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0MTUyNjIsImV4cCI6MjAyNzk5MTI2Mn0.fake_key_ensure_you_paste_full_real_key' 
); 

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const ALL_CATS = ["general", "technology", "business", "sports", "entertainment", "health"];

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(saved));
    
    // Initial fetch for count
    updateBookmarkCount();
    // Tab Title
    document.title = "NewsPulse | Real-time Aggregator";
  }, []);

  const updateBookmarkCount = async () => {
    try {
      const { count, error } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
      if (!error) setBookmarksCount(count || 0);
    } catch (e) { console.error(e); }
  };

  const handleCustomization = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      {/* ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Select your favorite topics for a personalized experience.</p>
            <div className="onboarding-grid">
              {ALL_CATS.map(cat => (
                <button key={cat} className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`} onClick={() => {
                  if (selectedCats.includes(cat)) { if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)); }
                  else setSelectedCats([...selectedCats, cat]);
                }}>{cat}</button>
              ))}
            </div>
            <button className="save-btn" onClick={handleCustomization}>Start Reading</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
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
          <button className="settings-icon" onClick={() => setShowOnboarding(true)}>⚙</button>
        </div>
      </nav>

      {/* SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Menu</h3>
           <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`menu-link ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ My Saved Articles</button>
          <hr style={{border:'0.5px solid #1e293b', margin:'15px 0'}} />
          <button className={`menu-link ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India Region</button>
          <button className={`menu-link ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global Region</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* SUB NAV */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {ALL_CATS.map(cat => (
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

      <footer className="footer-professional">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Built with React.js & Supabase</p>
      </footer>
    </div>
  );
}

export default App;