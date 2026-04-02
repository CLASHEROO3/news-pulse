/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

/**
 * NewsPulse Main Application
 * Features: Multi-category customization, Region switching, 
 * Mobile sidebar, and persistent user preferences.
 */
function App() {
  // States for Personalization
  const [selectedCats, setSelectedCats] = useState(["general"]); // User's interests
  const [activeView, setActiveView] = useState("for-you"); // Current active tab
  const [country, setCountry] = useState("in"); // India by default
  
  // UI States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load user preferences from Browser Storage on startup
  useEffect(() => {
    const savedConfig = localStorage.getItem('newspulse_config');
    if (!savedConfig) {
      setShowOnboarding(true); // Show welcome popup if first time
    } else {
      setSelectedCats(JSON.parse(savedConfig));
    }
  }, []);

  // Logic to select/deselect multiple categories in the modal
  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      // Don't allow removing the last category
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter(c => c !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  // Save selection and show the personalized feed
  const saveAndExit = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you");
  };

  return (
    <div className="App">
      
      {/* 1. WELCOME POPUP (ONBOARDING MODAL) */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" style={{height: '60px', marginBottom: '15px'}} />
            <h2>Welcome to NewsPulse</h2>
            <p>Select your favorite topics to build a <b>Personalized Feed</b>.</p>
            
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

      {/* 2. MAIN NAVIGATION BAR */}
      <nav className="navbar">
        <div className="nav-left">
          {/* Hamburger Menu Icon */}
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        
        <div className="nav-right">
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙ Customize</button>
          {/* Fixed Real-time Date Display */}
          <span className="nav-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </nav>

      {/* 3. SIDEBAR DRAWER (Region Selection) */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <p className="sidebar-label">Regional Edition</p>
          <button 
            className={country === 'in' ? 'active' : ''} 
            onClick={() => {setCountry('in'); setIsMenuOpen(false);}}
          >
            🇮🇳 India Edition
          </button>
          <button 
            className={country === 'us' ? 'active' : ''} 
            onClick={() => {setCountry('us'); setIsMenuOpen(false);}}
          >
            🌎 Global Edition
          </button>
        </div>
      </div>
      
      {/* Dimmed background when sidebar is open */}
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. SUB-NAVBAR (Tabs for Categories) */}
      <div className="sub-nav">
        <button 
          className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} 
          onClick={() => setActiveView('for-you')}
        >
          ★ For You
        </button>
        {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
          <button 
            key={cat} 
            className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} 
            onClick={() => setActiveView(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* 5. NEWS BOARD (Main Grid) */}
      <NewsBoard 
        activeView={activeView} 
        selectedCats={selectedCats} 
        country={country} 
      />
      
      {/* 6. FOOTER */}
      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Built for College Final Year Project</p>
      </footer>
    </div>
  );
}

export default App;