import React, { useState } from 'react';
import './App.css'; // <--- THIS MUST BE HERE
import NewsBoard from './Components/NewsBoard';

function App() {
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">News<span>Pulse</span></div>
        <div style={{fontWeight: 'bold', color: '#64748b'}}>{new Date().toDateString()}</div>
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
    </div>
  );
}

export default App;