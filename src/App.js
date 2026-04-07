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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(saved));
    updateCount();
  }, []);

  const updateCount = async () => {
    const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
    setBookmarksCount(count || 0);
  };

  const handleApply = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" style={{height:'60px', marginBottom:'20px'}} />
            <h2>Welcome to NewsPulse</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', margin:'20px 0'}}>
              {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
                <button key={cat} className={`sub-nav-item ${selectedCats.includes(cat) ? 'active' : ''}`} onClick={() => {
                  if (selectedCats.includes(cat)) { if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)); }
                  else setSelectedCats([...selectedCats, cat]);
                }}>{cat}</button>
              ))}
            </div>
            <button className="read-btn-sm" style={{width:'100%'}} onClick={handleApply}>Start Reading</button>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand" style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right">
          <div className="bookmark-pill" onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button style={{background:'none', border:'none', color:'var(--gold)', fontSize:'1.2rem', cursor:'pointer'}} onClick={() => setShowOnboarding(true)}>⚙</button>
          <span className="nav-date" style={{color:'#94a3b8', fontSize:'0.8rem', fontWeight:'700'}}>{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
        </div>
      </nav>

      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button onClick={() => setIsMenuOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem'}}>×</button></div>
        <div className="sidebar-content">
          <button className={`menu-btn ${activeView === 'bookmarks'?'active':''}`} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false);}}>⭐ Saved Articles</button>
          <hr style={{border:'0.5px solid #1e293b', margin:'15px 0'}} />
          <button className={`menu-btn ${country === 'in'?'active':''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>🇮🇳 India News</button>
          <button className={`menu-btn ${country === 'us'?'active':''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>🌎 Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} supabase={supabase} onUpdate={updateCount} />
    </div>
  );
}

export default App;