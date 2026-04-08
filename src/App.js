/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- CLOUD DATABASE CONFIGURATION ---
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const ALL_CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health"];

  // 1. Initial Load from Cloud
  useEffect(() => {
    const initializeUser = async () => {
      let deviceId = localStorage.getItem('np_device_id');
      if (!deviceId) {
        deviceId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('np_device_id', deviceId);
      }

      const { data } = await supabase.from('user_settings').select('*').eq('device_id', deviceId).single();
      
      if (data) {
        setSelectedCats(data.selected_categories);
        setCountry(data.region);
        setIsInitialLoad(false);
      } else {
        setShowOnboarding(true);
        setIsInitialLoad(false);
      }
    };
    initializeUser();
    updateBookmarkCount();
    document.title = "NewsPulse | Cloud Aggregator";
  }, []);

  // 2. Auto-Sync to Cloud Logic
  useEffect(() => {
    if (!isInitialLoad) {
      const sync = async () => {
        const deviceId = localStorage.getItem('np_device_id');
        await supabase.from('user_settings').upsert({
          device_id: deviceId,
          selected_categories: selectedCats,
          region: country
        });
      };
      sync();
    }
  }, [selectedCats, country, isInitialLoad]);

  const updateBookmarkCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  return (
    <div className="App">
      
      {/* ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Select your favorite topics. We sync your choices to the cloud <b>automatically</b>.</p>
            <div className="onboarding-grid">
              {ALL_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`onboarding-chip ${selectedCats.includes(cat) ? 'active' : ''}`} 
                  onClick={() => toggleCategory(cat)}
                >
                  {cat} {selectedCats.includes(cat) ? '✓' : '+'}
                </button>
              ))}
            </div>
            <button className="save-btn" onClick={() => { setShowOnboarding(false); setActiveView("for-you"); }}>
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* MASTER ALIGNED NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        
        <div className="nav-right">
          <button className="bookmark-indicator" onClick={() => setActiveView("bookmarks")}>
            🔖 <span>{bookmarksCount}</span>
          </button>
          <button className="settings-trigger" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </nav>

      {/* SIDEBAR DRAWER */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Settings</h3>
           <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`menu-btn ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ My Saved Articles</button>
          <hr className="sidebar-hr" />
          <p className="sidebar-label">Regional Edition</p>
          <button className={`menu-btn ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India</button>
          <button className={`menu-btn ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* STICKY SUB-NAV */}
      <div className="sub-nav">
        <button 
          className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} 
          onClick={() => setActiveView('for-you')}
        >
          ★ For You
        </button>
        {ALL_CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} 
            onClick={() => setActiveView(cat)}
          >
            {cat}
          </button>
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
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Bharat Edition</p>
      </footer>
    </div>
  );
}

export default App;