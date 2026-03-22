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
            <h2>Welcome to NewsPulse</h2>
            <p>Pick a topic to begin:</p>
            <div style={{display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center'}}>
              {["technology", "business", "sports", "health"].map(cat => (
                <button key={cat} onClick={() => handleCustomization(cat)} style={{padding:'8px 15px', borderRadius:'20px', cursor:'pointer'}}>{cat}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="logo-section">
          <button style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}} onClick={() => setIsMenuOpen(true)}>☰</button>
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={() => setIsMenuOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'2rem', cursor:'pointer', marginBottom:'20px'}}>×</button>
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