import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('newspulse_visited');
    if (!visited) setShowOnboarding(true);
  }, []);

  const handleCustomization = (cat) => {
    setCategory(cat);
    localStorage.setItem('newspulse_visited', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="App">
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="/logo.png" alt="Logo" className="modal-logo" />
            <h2>Welcome to NewsPulse</h2>
            <p>Select your favorite topic to begin:</p>
            <div className="category-bar">
              {["technology", "business", "sports", "health"].map(cat => (
                <button key={cat} onClick={() => handleCustomization(cat)} className="cat-btn">{cat}</button>
              ))}
            </div>
            <button className="cat-btn" style={{marginTop:'20px', border:'none'}} onClick={() => handleCustomization("general")}>Skip</button>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="logo-section">
          <button className="cat-btn" style={{background:'none', color:'white', border:'none', fontSize:'1.5rem'}} onClick={() => setIsMenuOpen(true)}>☰</button>
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={() => setIsMenuOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'2rem', cursor:'pointer'}}>×</button>
        <h2 style={{color:'var(--gold)', paddingLeft:'15px'}}>Explore</h2>
        {["general", "technology", "business", "sports", "entertainment", "health"].map(cat => (
          <button key={cat} className={`sidebar-link ${category===cat?'active':''}`} onClick={() => {setCategory(cat); setIsMenuOpen(false);}}>{cat}</button>
        ))}
      </div>

      <div className="news-tabs">
        <button className={`tab-btn ${country==='in'?'active':''}`} onClick={() => setCountry('in')}>India News</button>
        <button className={`tab-btn ${country==='us'?'active':''}`} onClick={() => setCountry('us')}>Global News</button>
      </div>

      <NewsBoard category={category} country={country} />
    </div>
  );
}
export default App;