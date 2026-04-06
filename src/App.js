/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the sidebar

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) setShowOnboarding(true);
    else setSelectedCats(JSON.parse(saved));
  }, []);

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const saveAndExit = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      
      {/* 1. ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" style={{height:'60px', marginBottom:'20px'}} />
            <h2>Personalize NewsPulse</h2>
            <div className="onboarding-grid">
              {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
                <button key={cat} className={`onboarding-chip ${selectedCats.includes(cat) ? 'active' : ''}`} onClick={() => toggleCategory(cat)}>
                  {cat} {selectedCats.includes(cat) ? '✓' : '+'}
                </button>
              ))}
            </div>
            <button className="save-btn" onClick={saveAndExit}>Start Reading</button>
          </div>
        </div>
      )}

      {/* 2. NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          {/* THE HAMBURGER BUTTON */}
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right">
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙ Customize</button>
          <span className="nav-date">{new Date().toLocaleDateString('en-IN', {month:'short', day:'numeric'})}</span>
        </div>
      </nav>

      {/* 3. SIDEBAR DRAWER - Check this logic */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <p className="sidebar-label">Edition</p>
          <button className={`region-btn ${country === 'in' ? 'active' : ''}`} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>India Edition</button>
          <button className={`region-btn ${country === 'us' ? 'active' : ''}`} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>Global Edition</button>
        </div>
      </div>

      {/* 4. OVERLAY (Darkens screen when menu is open) */}
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} />
      
      <footer className="footer-final">
        <p>© 2024 NewsPulse Aggregator</p>
      </footer>
    </div>
  );
}

export default App;