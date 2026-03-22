import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
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
      {/* 1. Onboarding Modal */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Personalize Your Feed</h2>
            <p>Select multiple topics to create your custom news stream.</p>
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

      {/* 2. Professional Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right">
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙ Customize</button>
          <span className="nav-date">{new Date().toDateString()}</span>
        </div>
      </nav>

      {/* 3. Hidden Sidebar Drawer */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Switch Region</h3>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button className={country === 'in' ? 'active' : ''} onClick={() => {setCountry('in'); setIsMenuOpen(false);}}>India News</button>
          <button className={country === 'us' ? 'active' : ''} onClick={() => {setCountry('us'); setIsMenuOpen(false);}}>Global News</button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. Content */}
      <div className="active-filters-bar">
        {selectedCats.map(c => <span key={c} className="tag">#{c}</span>)}
      </div>
      
      <NewsBoard selectedCats={selectedCats} country={country} />
      
      <footer className="footer-final">
        <p>© 2024 NewsPulse Aggregator | Bharat Edition</p>
      </footer>
    </div>
  );
}

export default App;