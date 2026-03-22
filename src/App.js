import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('newspulse_visited');
    if (!hasVisited) setShowOnboarding(true);
  }, []);

  const handleCustomization = (selectedCat) => {
    setCategory(selectedCat);
    localStorage.setItem('newspulse_visited', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="App">
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" style={{height: '60px', width:'auto'}} />
            <h2>Welcome to NewsPulse</h2>
            <p>Pick a topic to personalize your feed</p>
            <div className="onboarding-options">
              {["technology", "business", "sports", "health"].map(cat => (
                <button key={cat} onClick={() => handleCustomization(cat)} className="cat-btn">
                  {cat}
                </button>
              ))}
            </div>
            <button className="skip-btn" style={{marginTop:'20px', background:'none', border:'none', cursor:'pointer', color:'#64748b', textDecoration:'underline'}} onClick={() => handleCustomization("general")}>Skip for now</button>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="logo-section">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>☰</button>
          <img src="/logo.png" alt="NP" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={() => setIsMenuOpen(false)}>×</button>
        <h3 style={{color: '#c59235', marginBottom: '20px', borderBottom:'1px solid #c59235', paddingBottom:'10px'}}>Explore</h3>
        {["general", "technology", "business", "sports", "entertainment", "health"].map((cat) => (
          <button 
            key={cat} 
            onClick={() => { setCategory(cat); setIsMenuOpen(false); }} 
            className={`sidebar-link ${category === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="news-tabs" style={{display:'flex', justifyContent:'center', background:'#fff', borderBottom:'1px solid #e2e8f0'}}>
        <button className={`tab-btn ${country === 'in' ? 'active' : ''}`} style={{padding:'15px 30px', border:'none', background:'none', fontWeight:'700', cursor:'pointer', borderBottom: country==='in'?'3px solid #c59235':'3px solid transparent', color: country==='in'?'#c59235':'#94a3b8'}} onClick={() => setCountry('in')}>India News</button>
        <button className={`tab-btn ${country === 'us' ? 'active' : ''}`} style={{padding:'15px 30px', border:'none', background:'none', fontWeight: