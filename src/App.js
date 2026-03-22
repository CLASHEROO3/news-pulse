import React, { useState } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

/**
 * Main Application Component
 * Manages the global state for Category and Country filtering.
 */
function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in"); // Default: India

  return (
    <div className="App">
      {/* Professional Navigation Bar */}
      <nav className="navbar">
        <div className="logo">News<span>Pulse</span></div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      {/* Primary Tabs: India vs Global */}
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

      {/* Secondary Filter: Category Sub-menu */}
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

      {/* News Board Logic */}
      <NewsBoard category={category} country={country} />

      {/* Professional Footer */}
      <footer className="footer">
        <p><strong>NewsPulse Aggregator</strong></p>
        <p>A Final Year Engineering Project | © 2024</p>
      </footer>
    </div>
  );
}

export default App;