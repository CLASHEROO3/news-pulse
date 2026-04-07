/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- DATABASE CONNECTION ---
const supabase = createClient(
  'https://hmylzizegexlxcltpxfb.supabase.co', 
  'PASTE_YOUR_ANON_KEY_HERE' 
);

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(saved));
    fetchBookmarkCount();
  }, []);

  const fetchBookmarkCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  return (
    <div className="App">
      {/* 1. Onboarding Popup */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Welcome to NewsPulse</h2>
            <p>Select your interests to build your personalized feed.</p>
            <div className="onboarding-grid">
              {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
                <button key={cat} className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`} onClick={() => {
                  if (selectedCats.includes(cat)) { if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)); }
                  else setSelectedCats([...selectedCats, cat]);
                }}> {cat} </button>
              ))}
            </div>
            <button className="save-btn" onClick={() => { localStorage.setItem('newspulse_config', JSON.stringify(selectedCats)); setShowOnboarding(false); setActiveView("for-you"); }}>Apply</button>
          </div>
        </div>
      )}

      {/* 2. Navbar */}
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
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙</button>
        </div>
      </nav>

      {/* 3. Sidebar Drawer */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button onClick={() => setIsMenuOpen(false)}>×</button></div>
        <div className="sidebar-content">
          <button onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ Saved Articles</button>
          <hr />
          <button onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India</button>
          <button onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. Horizontal Categories */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>For You</button>
        {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} supabase={supabase} onUpdate={fetchBookmarkCount} />
    </div>
  );
}
export default App;