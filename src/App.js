import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

/**
 * Main App Component
 * Manages State for Category, Country, and Dynamic Browser Tab Title.
 */
function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in"); // Starts with India

  // DYNAMIC TAB TITLE LOGIC
  useEffect(() => {
    // Capitalizes the first letter for the tab title
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    document.title = `NewsPulse | ${capitalize(category)} News`;
  }, [category]); // Updates every time the category changes

  return (
    <div className="App">
      {/* Top Header */}
      <nav className="navbar">
        <div className="logo">News<span>Pulse</span></div>
        <div className="current-date">{new Date().toDateString()}</div>
      </nav>

      {/* Primary Navigation: India vs Global */}
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

      {/* Secondary Navigation: Categories */}
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

      {/* Professional Footer */}
      <footer className="footer">
        <h3>NewsPulse Aggregator</h3>
        <p>A Professional Final Year College Project | © 2024</p>
        <p className="footer-tag">Live Data powered by Saurav's Open-Source API</p>
      </footer>
    </div>
  );
}

export default App;