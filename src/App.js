/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- SUPABASE CLOUD INITIALIZATION ---
// This connects the app to your real PostgreSQL database
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
  const [isLoaded, setIsLoaded] = useState(false);

  const CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health"];

  // 1. App Initialization: Link device to Cloud Database
  useEffect(() => {
    const initializeUser = async () => {
      // Use a persistent Device ID to identify the user in the cloud
      let deviceId = localStorage.getItem('np_device_id');
      if (!deviceId) {
        deviceId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('np_device_id', deviceId);
      }

      // Fetch user settings from Supabase user_settings table
      const { data } = await supabase.from('user_settings').select('*').eq('device_id', deviceId).single();
      
      if (data) {
        setSelectedCats(data.selected_categories);
        setCountry(data.region);
      } else {
        setShowOnboarding(true); // New user: show the premium modal
      }
      setIsLoaded(true);
      refreshBookmarkCount();
    };
    initializeUser();
    document.title = "NewsPulse | Cloud Aggregator";
  }, []);

  // 2. Automated Background Sync: Mirror preferences to Cloud PostgreSQL
  useEffect(() => {
    if (isLoaded) {
      const syncData = async () => {
        const deviceId = localStorage.getItem('np_device_id');
        await supabase.from('user_settings').upsert({
          device_id: deviceId,
          selected_categories: selectedCats,
          region: country
        });
      };
      syncData();
    }
  }, [selectedCats, country, isLoaded]);

  const refreshBookmarkCount = async () => {
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
      
      {/* 1. PREMIUM ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Select your favorite topics. Your choices sync to the cloud <b>automatically</b>.</p>
            <div className="onboarding-grid">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`pill-chip ${selectedCats.includes(cat) ? 'active' : ''}`} 
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="primary-save-btn" onClick={() => setShowOnboarding(false)}>
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* 2. MASTER ALIGNED NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger-menu" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand-group">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        
        <div className="nav-right">
          <button className="cloud-bookmark-pill" onClick={() => setActiveView("bookmarks")}>
            🔖 <span>{bookmarksCount}</span>
          </button>
          <button className="settings-cog" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="live-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </nav>

      {/* 3. SIDEBAR DRAWER (SETTINGS) */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Settings</h3>
           <button className="close-sidebar-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`menu-link ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ My Saved Articles</button>
          <hr className="sidebar-divider" />
          <p className="sidebar-label">Regional Edition</p>
          <button className={`menu-link ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India News</button>
          <button className={`menu-link ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. SUB-NAVBAR (HORIZONTAL CATEGORY SWIPE) */}
      <div className="sub-nav">
        <button 
          className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} 
          onClick={() => setActiveView('for-you')}
        >
          ★ For You
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} 
            onClick={() => setActiveView(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* 5. NEWS CONTENT BOARD */}
      <NewsBoard 
        activeView={activeView} 
        selectedCats={selectedCats} 
        country={country} 
        supabase={supabase} 
        onUpdate={refreshBookmarkCount} 
      />

      <footer className="footer-professional">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Cloud PostgreSQL Architecture</p>
      </footer>
    </div>
  );
}

export default App;