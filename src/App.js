/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

// --- SUPABASE CONFIGURATION ---
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

  const ALL_CATS = ["general", "technology", "business", "sports", "entertainment", "health"];

  // --- CLOUD INITIALIZATION ---
  useEffect(() => {
    initializeUser();
    fetchBookmarkCount();
  }, []);

  const initializeUser = async () => {
    // 1. We use a single persistent key to find the user in the cloud
    let deviceId = localStorage.getItem('np_device_id');
    if (!deviceId) {
      deviceId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('np_device_id', deviceId);
    }

    // 2. Fetch settings from Supabase Table
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (error || !data) {
      setShowOnboarding(true); // New user: show customization
    } else {
      setSelectedCats(data.selected_categories);
      setCountry(data.region);
    }
  };

  const fetchBookmarkCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const saveCloudPreferences = async () => {
    const deviceId = localStorage.getItem('np_device_id');
    const { error } = await supabase.from('user_settings').upsert({
      device_id: deviceId,
      selected_categories: selectedCats,
      region: country
    });

    if (!error) {
      setShowOnboarding(false);
      setActiveView("for-you");
    } else {
      alert("Database error: " + error.message);
    }
  };

  return (
    <div className="App">
      {/* 1. ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Personalize NewsPulse</h2>
            <p>Your preferences will be <b>saved to our Cloud Database</b>.</p>
            <div className="onboarding-grid">
              {ALL_CATS.map(cat => (
                <button key={cat} className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`} onClick={() => {
                  if (selectedCats.includes(cat)) { if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)); }
                  else setSelectedCats([...selectedCats, cat]);
                }}>{cat}</button>
              ))}
            </div>
            <button className="save-btn" onClick={saveCloudPreferences}>Sync to Cloud & Start</button>
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
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙</button>
        </div>
      </nav>

      {/* 3. SIDEBAR */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button onClick={() => setIsMenuOpen(false)}>×</button></div>
        <div className="sidebar-content">
          <button className={`menu-link ${activeView === 'bookmarks'?'active':''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ Saved Articles</button>
          <hr />
          <button onClick={() => {setCountry('in'); setIsMenuOpen(false); saveCloudPreferences();}}>🇮🇳 India Edition</button>
          <button onClick={() => {setCountry('us'); setIsMenuOpen(false); saveCloudPreferences();}}>🌎 Global Edition</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. SUB NAV */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {ALL_CATS.map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} supabase={supabase} onUpdate={fetchBookmarkCount} />
    </div>
  );
}
export default App;