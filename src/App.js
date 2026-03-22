import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in"); // Default: India

  // Dynamic Browser Tab Title
  useEffect(() => {
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    document.title = `NewsPulse | ${capitalize(category)} News`;
  }, [category]);

  return (
    <div className="App">
      {/* Responsive Navbar */}
      <nav className="navbar">
        <div className="logo-section">
          <img src="/logo.png" alt="NP" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      {/* India vs Global Switching Tabs */}
      <div className="news-tabs">
        <button 
          className={`tab-btn ${country === 'in' ? 'active' : ''}`} 
          onClick={() => setCountry('in')}
        >
          India News
        </button>
        <button 
          className={`tab-btn ${country === 'us' ? 'active' : ''}`} 
          onClick={() => setCountry('us')}
        >
          Global News
        </button>
      </div>

      {/* Horizontal Category Bar (Swipeable on Mobile) */}
      <div className="category-bar">
        {["general", "technology", "business", "sports", "entertainment", "health"].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)} 
            className={`cat-btn ${category === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <NewsBoard category={category} country={country} />

      {/* Professional Navy & Gold Footer */}
      <footer className="footer">
        <img src="/logo.png" alt="Logo" className="footer-logo" />
        <h3>NewsPulse Aggregator</h3>
        <p>A Professional Final Year College Project | © 2024</p>
        <p className="tech-tag">Built with React.js & Saurav's News API</p>
      </footer>
    </div>
  );
}

export default App;