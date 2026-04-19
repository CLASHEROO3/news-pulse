/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- CLOUD DATABASE INITIALIZATION ---
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

  const ALL_CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health", "science"];

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
    document.title = "NewsPulse | Professional News Aggregator";
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

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.search.value;
    if(val) { setSearchTerm(val); setActiveView("search"); }
  };

  return (
    <div className="App">
      
      {/* 1. NEWS TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-title">BREAKING</div>
        <div className="ticker">
          <div className="ticker-item">Live Global Engine Active • Cloud Synchronization Enabled • Real-time News Aggregation • Built for Production Environments •</div>
        </div>
      </div>

      {/* 2. ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2 className="modal-title">Personalize Your Feed</h2>
            <p className="modal-desc">Select topics to build your <b>Cloud-Synced</b> feed.</p>
            <div className="onboarding-grid">
              {ALL_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`onboarding-chip ${selectedCats.includes(cat) ? 'active' : ''}`} 
                  onClick={() => {
                    if(selectedCats.includes(cat)) { if(selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)) }
                    else setSelectedCats([...selectedCats, cat])
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="modal-action-btn" onClick={() => setShowOnboarding(false)}>
              Start Reading
            </button>
          </div>
        </div>
      )}

      {/* 3. NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>

        <form className="nav-search-pc" onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search topics..." />
        </form>
        
        <div className="nav-right">
          <button className="nav-badge" onClick={() => setActiveView("bookmarks")}>
            🔖 <span>{bookmarksCount}</span>
          </button>
          <button className="nav-gear" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date">
            {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </nav>

      {/* 4. SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h3>Settings</h3>
           <button className="close-sidebar" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={`menu-item ${activeView === 'bookmarks' ? 'active' : ''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ Saved Articles</button>
          <hr />
          <p className="sidebar-label">Region</p>
          <button className={`menu-item ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India News</button>
          <button className={`menu-item ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 5. SUB-NAV TABS */}
      <div className="sub-nav">
        <button 
          className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} 
          onClick={() => {setActiveView('for-you'); setSearchTerm("");}}
        >
          ★ For You
        </button>
        {ALL_CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} 
            onClick={() => {setActiveView(cat); setSearchTerm("");}}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} searchTerm={searchTerm} supabase={supabase} onUpdate={updateBookmarkCount} />

      {/* --- FOOTER FIX --- */}
      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Built with React, Supabase & REST APIs</p>
      </footer>
    </div>
  );
}

export default App;