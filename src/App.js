import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");

  // DYNAMIC TAB TITLE: Changes browser tab based on category
  useEffect(() => {
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    document.title = `NewsPulse | ${capitalize(category)} News`;
  }, [category]);

  return (
    <div className="App">
      {/* PROFESSIONAL NAVBAR WITH LOGO */}
      <nav className="navbar">
        <div className="logo-section">
          <img src="/logo.png" alt="NP Logo" className="nav-logo" />
          <div className="logo-text">News<span>Pulse</span></div>
        </div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      {/* INDIA vs GLOBAL TABS */}
      <div className="news-tabs">
        <button className={`tab-btn ${country === 'in' ? 'active' : ''}`} onClick={() => setCountry('in')}>India News</button>
        <button className={`tab-btn ${country === 'us' ? 'active' : ''}`} onClick={() => setCountry('us')}>Global News</button>
      </div>

      {/* CATEGORY FILTER */}
      <div className="category-bar">
        {["general", "technology", "business", "sports", "entertainment", "health"].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`cat-btn ${category === cat ? 'active' : ''}`}>{cat}</button>
        ))}
      </div>

      <NewsBoard category={category} country={country} />

      <footer className="footer">
        <img src="/logo.png" alt="Logo" style={{height: '30px', marginBottom: '10px'}} />
        <p><strong>NewsPulse Aggregator</strong></p>
        <p>Final Year Engineering Project | © 2024</p>
      </footer>
    </div>
  );
}

export default App;