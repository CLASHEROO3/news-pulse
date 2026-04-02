/* 
 * Project: NewsPulse - College Final Year Project
 * Developer: [Your Name]
 * Purpose: Main controller for user state, onboarding, and sidebar navigation.
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  // --- State Management ---
  const [selectedCats, setSelectedCats] = useState(["general"]); // User interests for "For You"
  const [activeView, setActiveView] = useState("for-you");       // Currently viewed tab
  const [country, setCountry] = useState("in");                  // Default to India
  const [showOnboarding, setShowOnboarding] = useState(false);   // Control Welcome Popup
  const [isMenuOpen, setIsMenuOpen] = useState(false);           // Sidebar toggle

  const CATEGORIES = ["general", "technology", "business", "sports", "entertainment", "health"];

  // --- Initialization ---
  useEffect(() => {
    // Check if user has already set preferences in this browser
    const savedConfig = localStorage.getItem('newspulse_config');
    if (!savedConfig) {
      setShowOnboarding(true);
    } else {
      setSelectedCats(JSON.parse(savedConfig));
    }
  }, []);

  // --- Handlers ---
  const toggleCategorySelection = (cat) => {
    if (selectedCats.includes(cat)) {
      // Logic: Allow deselecting only if at least one remains
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter(item => item !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const finalizeCustomization = () => {
    localStorage.setItem('newspulse_config', JSON.stringify(selectedCats));
    setShowOnboarding(false);
    setActiveView("for-you"); // Automatically show their new custom feed
  };

  return (
    <div className="App">
      
      {/* 1. Onboarding Modal: First-time Experience */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Branding" className="modal-logo" />
            <h2>Personalize NewsPulse</h2>
            <p>Select your favorite topics to curate your <b>"For You"</b> feed.</p>
            
            <div className="onboarding-grid">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`onboarding-chip ${selectedCats.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategorySelection(cat)}
                >
                  {cat} {selectedCats.includes(cat) ? '✓' : '+'}
                </button>
              ))}
            </div>
            
            <button className="save-btn" onClick={finalizeCustomization}>Start Reading</button>
          </div>
        </div>
      )}

      {/* 2. Primary Navbar: Branding and Actions */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand">
            <img src="/logo.png" alt="NP Logo" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        
        <div className="nav-right">
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙ Customize</button>
          <span className="nav-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </nav>

      {/* 3. Sidebar Drawer: Regional Settings */}
      <div className={`sidebar-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <span className="sidebar-label">Regional Edition</span>
          <button 
            className={`region-btn ${country === 'in' ? 'active' : ''}`} 
            onClick={() => {setCountry('in'); setIsMenuOpen(false);}}
          >
            🇮🇳 India Edition
          </button>
          <button 
            className={`region-btn ${country === 'us' ? 'active' : ''}`} 
            onClick={() => {setCountry('us'); setIsMenuOpen(false);}}
          >
            🌎 Global Edition
          </button>
        </div>
      </div>
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 4. Sub-Navigation: Category Tabs */}
      <div className="sub-nav">
        <button 
          className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} 
          onClick={() => setActiveView('for-you')}
        >
          ★ For You
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} 
            onClick={() => setActiveView(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* 5. Main Feed Area */}
      <NewsBoard 
        activeView={activeView} 
        selectedCats={selectedCats} 
        country={country} 
      />
      
      <footer className="footer-final">
        <p>© {new Date().getFullYear()} NewsPulse Aggregator | Built with React.js</p>
      </footer>
    </div>
  );
}

export default App;