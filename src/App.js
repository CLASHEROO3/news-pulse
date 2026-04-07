/* 
 * Project: NewsPulse Aggregator (Final Year Project)
 * Tech Stack: React.js, Supabase (PostgreSQL), REST APIs
 * Features: Multi-Category Personalization, AI Sentiment Engine, Cloud Sync
 */

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- SUPABASE CLOUD CONNECTION ---
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

  const CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health"];

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(saved));
    
    syncBookmarkCount();
    document.title = "NewsPulse | Professional Aggregator";
  }, []);

  const syncBookmarkCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const handlePreferences = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      
      {/* 1. ONBOARDING OVERLAY */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="NP Logo" className="modal-logo" />
            <h2>Personalize NewsPulse</h2>
            <p>Select your favorite topics for a <b>Cloud-Synced</b> news experience.</p>
            <div className="onboarding-grid">
              {CATEGORIES.map(cat => (
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
            <button className="save-btn" onClick={handlePreferences}>Start Reading</button>
          </div>
        </div>
      )}

      {/* 2. PREMIUM NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right">
          <div className="bookmark-indicator" onClick={() => setActiveView("bookmarks")}>
             🔖 <span>{bookmarksCount}</span>
          </div>
          <button className="settings-btn" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date">{new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
        </div>
      </nav>

      {/* 3. SIDEBAR DRAWER */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Menu</h3>
           <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`menu-link ${activeView === 'bookmarks'?'active':''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ My Saved Articles</button>
          <hr className="divider" />
          <p className="sidebar-label">Regional Settings</p>
          <button className={`menu-link ${country === 'in'?'active':''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India Edition</button>
          <button className={`menu-link ${country === 'us'?'active':''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global Edition</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. SUB-NAV (HORIZONTAL CHIPS) */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} supabase={supabase} onUpdate={syncBookmarkCount} />

      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Built with React & Supabase</p>
      </footer>
    </div>
  );
}

export default App;