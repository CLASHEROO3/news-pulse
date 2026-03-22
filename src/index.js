import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// THIS FORCES THE TITLE THE MOMENT THE APP LOADS
document.title = "NewsPulse | Indian News Aggregator";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);