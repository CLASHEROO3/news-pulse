/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- DATABASE CONFIGURATION ---
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const ALL_CATEGORIES = ["general", "business", "technology", "sports", "entertainment", "health", "science"];

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
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const syncToCloud = async () => {
        const deviceId = localStorage.getItem('np_device_id');
        await supabase.from('user_settings').upsert({
          device_id: deviceId,
          selected_categories: selectedCats,
          region: country
        });
      };
      syncToCloud();
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

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.search.value;
    if(val) { setSearchTerm(val); setActiveView("search"); }
  };

  return (
    <div className="App">
      <div className="ticker-wrap">
        <div className="ticker-title">BREAKING</div>
        <div className="ticker">
          <div className="ticker-item">Cloud Sync Active • v2.6 Production Build • Real-time News Engine Enabled • Developed by Rishi, Jay & Sarthak •</div>
        </div>
      </div>

      {/* --- PREMIUM MODAL --- */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2 className="modal-title">Personalize Your Feed</h2>
            <p className="modal-desc">Select topics to build your <b>Cloud-Synced</b> feed.</p>
            <div className="modal-grid">
              {ALL_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`modal-chip ${selectedCats.includes(cat) ? 'active' : ''}`} 
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="modal-start-btn" onClick={() => setShowOnboarding(false)}>
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>

        <form className="nav-search-pc" onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search news..." />
        </form>
        
        <div className="nav-right">
          <button className="nav-badge" onClick={() => setActiveView("bookmarks")}>
            🔖 <span>{bookmarksCount}</span>
          </button>
          <button className="nav-gear" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date">{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
        </div>
      </nav>

      {/* --- SIDEBAR --- */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Settings</h3>
           <button className="close-sidebar" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`side-link ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ Saved Library</button>
          <hr className="side-divider" />
          <p className="side-label">Region</p>
          <button className={`side-link ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India News</button>
          <button className={`side-link ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* --- CATEGORY SUB-NAV --- */}
      <div className="sub-nav">
        <button className={`sub-nav-btn ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => {setActiveView('for-you'); setSearchTerm("");}}>★ For You</button>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} className={`sub-nav-btn ${activeView === cat ? 'active' : ''}`} onClick={() => {setActiveView(cat); setSearchTerm("");}}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} searchTerm={searchTerm} supabase={supabase} onUpdate={updateBookmarkCount} />

      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Bharat Edition | S.P.P.U. Project</p>
      </footer>
    </div>
  );
}

export default App;