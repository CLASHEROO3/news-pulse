import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. First Visit Check
  useEffect(() => {
    const hasVisited = localStorage.getItem('newspulse_visited');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  // 2. Save Preferences
  const handleCustomization = (selectedCat) => {
    setCategory(selectedCat);
    localStorage.setItem('newspulse_visited', 'true');
    setShowOnboarding(false);
  };

  // 3. Dynamic Title
  useEffect(() => {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    document.title = `NewsPulse | ${cap(category)} News`;
  }, [category]);

  return (
    <div className="App">
      {/* Onboarding Modal (The Popup) */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" style={{height: '50px'}} />
            <h2>Welcome to NewsPulse</h2>
            <p>What news interests you the most today?</p>
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

      {/* Navbar with Menu Toggle */}
      <nav className="navbar">
        <div className="logo-section">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
          <img src="/logo.png" alt="NP" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      {/* Sidebar Menu */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={() => setIsMenuOpen(false)}>×</button>
        <h3>Categories</h3>
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

      <div className="news-tabs">
        <button className={`tab-btn ${country === 'in' ? 'active' : ''}`} onClick={() => setCountry('in')}>India News</button>
        <button className={`tab-btn ${country === 'us' ? 'active' : ''}`} onClick={() => setCountry('us')}>Global News</button>
      </div>

      <NewsBoard category={category} country={country} />

      <footer className="footer">
        <p><strong>NewsPulse Aggregator</strong> | Final Year Project</p>
      </footer>
    </div>
  );
}

export default App;