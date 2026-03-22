import React, { useState, useEffect } from 'react';
import './App.css';
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");

  // DYNAMIC TAB TITLE LOGIC
  useEffect(() => {
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    document.title = `NewsPulse | ${capitalize(category)} News`;
  }, [category]);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">News<span>Pulse</span></div>
        <div className="date-display">{new Date().toDateString()}</div>
      </nav>

      <div className="news-tabs">
        <button className={`tab-btn ${country === 'in' ? 'active' : ''}`} onClick={() => setCountry('in')}>India News</button>
        <button className={`tab-btn ${country === 'us' ? 'active' : ''}`} onClick={() => setCountry('us')}>Global News</button>
      </div>

      <div className="category-bar">
        {["general", "technology", "business", "sports", "entertainment", "health"].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`cat-btn ${category === cat ? 'active' : ''}`}>{cat}</button>
        ))}
      </div>

      <NewsBoard category={category} country={country} />

      <footer className="footer">
        <p><strong>NewsPulse Aggregator</strong></p>
        <p>A Final Year Engineering Project | © 2024</p>
      </footer>
    </div>
  );
}

export default App;