/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import NewsBoard from './Components/NewsBoard';

const supabase = createClient('https://hmylzizegexlxcltpxfb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWx6aXplZ2V4bHhjbHRweGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njg5NzgsImV4cCI6MjA5MTE0NDk3OH0.DAqG8sfCj9au1CSG3dchA7Em4wvS0m9C_PXR5QHjPKE');

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const ALL_CATS = ["general", "technology", "business", "sports", "entertainment", "health", "science"];

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
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Select interests to build your <b>Cloud-Synced</b> feed.</p>
            <div style={{display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center', margin:'20px 0'}}>
              {ALL_CATS.map(cat => (
                <button key={cat} className={`chip-btn ${selectedCats.includes(cat)?'active':''}`} onClick={() => {
                  if(selectedCats.includes(cat)) { if(selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat)) }
                  else setSelectedCats([...selectedCats, cat])
                }}>{cat}</button>
              ))}
            </div>
            <button className="chip-btn active" style={{width:'100%', padding:'15px'}} onClick={() => setShowOnboarding(false)}>Get Started</button>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand"><img src="/logo.png" alt="NP" className="nav-logo" /><h1 className="logo-text">News<span>Pulse</span></h1></div>
        </div>
        <div className="nav-right">
          <div style={{background:'var(--gold)', color:'var(--navy)', padding:'5px 12px', borderRadius:'15px', fontWeight:'800', fontSize:'0.75rem'}} onClick={() => setActiveView("bookmarks")}>🔖 {bookmarksCount}</div>
          <button style={{background:'none', border:'none', color:'var(--gold)', fontSize:'1.2rem', cursor:'pointer'}} onClick={() => setShowOnboarding(true)}>⚙</button>
        </div>
      </nav>

      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h3>Settings</h3><button onClick={() => setIsMenuOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem'}}>×</button></div>
        <div className="sidebar-content">
          <button className={`chip-btn ${activeView==='bookmarks'?'active':''}`} style={{width:'100%', textAlign:'left', borderRadius:'8px'}} onClick={() => {setActiveView('bookmarks'); setIsMenuOpen(false)}}>⭐ Saved Articles</button>
          <hr style={{border:'0.5px solid #1e293b', margin:'15px 0'}} />
          <button className={`chip-btn ${country==='in'?'active':''}`} style={{width:'100%', textAlign:'left', borderRadius:'8px', marginBottom:'10px'}} onClick={() => {setCountry('in'); setIsMenuOpen(false)}}>🇮🇳 India</button>
          <button className={`chip-btn ${country==='us'?'active':''}`} style={{width:'100%', textAlign:'left', borderRadius:'8px'}} onClick={() => {setCountry('us'); setIsMenuOpen(false)}}>🌎 Global</button>
        </div>
      </div>
      {isMenuOpen && <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', zIndex:1500}} onClick={() => setIsMenuOpen(false)}></div>}

      <div className="sub-nav">
        <button className={`chip-btn ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {ALL_CATS.map(cat => (
          <button key={cat} className={`chip-btn ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} supabase={supabase} onUpdate={fetchCount} />
    </div>
  );
}
export default App;