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
    
    // Set initial title
    document.title = "NewsPulse | Latest News";
  }, []);

  useEffect(() => {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    document.title = `NewsPulse | ${cap(category)} News`;
  }, [category]);

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
            <button className="skip-btn" onClick={() => handleCustomization("general")}>Skip for now</button>
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
        <h3 className="sidebar-title">Explore</h3>
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

      <div className="news-tabs-container">
        <button className={`tab-btn ${country === 'in' ? 'active' : ''}`} onClick={() => setCountry('in')}>India News</button>
        <button className={`tab-btn ${country === 'us' ? 'active' : ''}`} onClick={() => setCountry('us')}>Global News</button>
      </div>

      <NewsBoard category={category} country={country} />

      <footer className="footer-dark">
        <p><strong>NewsPulse Aggregator</strong> | Final Year Project</p>
      </footer>
    </div>
  );
}

export default App;