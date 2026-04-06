import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [selectedCats, setSelectedCats] = useState(["general"]);
  const [activeView, setActiveView] = useState("for-you");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      
      {/* 1. ONBOARDING OVERLAY */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Select your favorite topics for a custom feed.</p>
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

      {/* 2. NAVBAR */}
      <nav className="navbar">
        <div className="nav-left" style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button className="hamburger" style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}} onClick={() => setIsMenuOpen(true)}>☰</button>
          <div className="brand" style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <img src="/logo.png" alt="NP" className="nav-logo" />
            <h1 className="logo-text">News<span>Pulse</span></h1>
          </div>
        </div>
        <div className="nav-right" style={{display:'flex', alignItems:'center', gap:'20px'}}>
          <button className="customize-btn" onClick={() => setShowOnboarding(true)}>⚙ Customize</button>
          <span className="nav-date" style={{color:'#94a3b8', fontSize:'0.8rem', fontWeight:'700'}}>{new Date().toDateString()}</span>
        </div>
      </nav>

      {/* 3. TABS */}
      <div className="sub-nav">
        <button className={`sub-nav-item ${activeView === 'for-you' ? 'active' : ''}`} onClick={() => setActiveView('for-you')}>★ For You</button>
        {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
          <button key={cat} className={`sub-nav-item ${activeView === cat ? 'active' : ''}`} onClick={() => setActiveView(cat)}>{cat}</button>
        ))}
      </div>
      
      <NewsBoard activeView={activeView} selectedCats={selectedCats} country={country} />
      
      <footer className="footer-final" style={{textAlign:'center', padding:'3rem', background:'#0a192f', color:'#c59235', marginTop:'2rem'}}>
        <p>© 2024 NewsPulse Aggregator | Bharat Edition</p>
      </footer>
    </div>
  );
}

export default App;