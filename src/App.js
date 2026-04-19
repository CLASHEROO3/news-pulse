/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

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

  const ALL_CATS = ["general", "business", "technology", "sports", "entertainment", "health", "science"];

  useEffect(() => {
    const init = async () => {
      let id = localStorage.getItem('np_device_id') || 'u_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('np_device_id', id);
      const { data } = await supabase.from('user_settings').select('*').eq('device_id', id).single();
      if (data) { setSelectedCats(data.selected_categories); setCountry(data.region); } 
      else { setShowOnboarding(true); }
      fetchCount();
    };
    init();
  }, []);

  useEffect(() => {
    const sync = async () => {
      await supabase.from('user_settings').upsert({
        device_id: localStorage.getItem('np_device_id'),
        selected_categories: selectedCats,
        region: country
      });
    };
    sync();
  }, [selectedCats, country]);

  const fetchCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  return (
    <div className="App">
      {/* 1. MOVING TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-title">BREAKING</div>
        <div className="ticker">
          <div className="ticker-item">Live Cloud Sync Enabled • NewsPulse Premium Aggregator v2.0 • Real-time News Engine Active •</div>
        </div>
      </div>

      {/* 2. PREMIUM ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2 className="modal-title">Personalize Your Feed</h2>
            <p className="modal-desc">Select topics to build your <b>Cloud-Synced</b> feed.</p>
            <div className="onboarding-grid">
              {ALL_CATS.map(cat => (
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
        <div className="nav-right">
          <div className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button className="settings-gear" onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date">{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
        </div>