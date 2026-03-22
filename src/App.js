import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  // Now using an array for multiple categories
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('newspulse_config');
    if (!saved) {
      setShowOnboarding(true);
    } else {
      setSelectedCats(JSON.parse(saved));
    }
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
  };

  return (
    <div className="App">
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <img src="/logo.png" alt="Logo" className="modal-logo" />
              <h2>Personalize Your Feed</h2>
              <p>Select the topics you want to follow. We'll curate a custom feed for you.</p>
            </div>
            <div className="onboarding-grid">
              {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
                <button 
                  key={cat} 
                  className={`onboarding-chip ${selectedCats.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat} {selectedCats.includes(cat) ? '✓' : '+'}
                </button>
              ))}
            </div>
            <button className="save-btn" onClick={saveAndExit}>Start Reading</button>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="logo-section">
          <button className="menu-icon" onClick={() => setIsMenuOpen(true)}>☰</button>
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="nav-actions">
          <button className="custom-btn" onClick={() => setShowOnboarding(true)}>⚙ Customize</button>
          <span className="date-label">{new Date().toDateString()}</span>
        </div>
      </nav>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={() => setIsMenuOpen(false)}>×</button>
        <h3 className="sidebar-header">Switch Source</h3>
        <div className="news-tabs-vertical">
          <button className={country === 'in' ? 'active' : ''} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>India News</button>
          <button className={country === 'us' ? 'active' : ''} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>Global News</button>
        </div>
      </div>

      <NewsBoard selectedCats={selectedCats} country={country} />
      
      <footer className="footer-professional">
        <p>© 2024 NewsPulse Aggregator | Powered by Real-time News Engine</p>
      </footer>
    </div>
  );
}

export default App;