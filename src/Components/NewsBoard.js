/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';
import { backupArticles } from '../backupNews'; // IMPORT THE BACKUP

const NewsBoard = ({ activeView, selectedCats, country, supabase, onUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const API_KEY = '94bf29d818474f184199d5e8f8139f10';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (activeView === "bookmarks") {
        const { data } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
        setArticles(data || []);
        setLoading(false);
        return;
      }

      try {
        let allArticles = [];
        const mapCat = (c) => c === 'general' ? 'world' : c;

        // Try to call the API
        const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${mapCat(activeView)}&lang=en&country=${country}&apikey=${API_KEY}`);
        allArticles = res.data.articles || [];

        if (allArticles.length === 0) throw new Error("Empty API response");

        // Process sentiment
        const analyzed = allArticles.map(a => {
            const blob = (a.title + (a.description || "")).toLowerCase();
            if (blob.match(/death|crash|war|killed|fire|arrest/)) a.mood = "Urgent";
            else if (blob.match(/won|launch|gold|success|growth|happy/)) a.mood = "Positive";
            else a.mood = "Neutral";
            return a;
        });

        setArticles(analyzed);
      } catch (err) { 
        console.warn("API Failed, loading backup news for demo...");
        // --- FAILSAFE: Use Backup News if API fails ---
        setArticles(backupArticles); 
      }
      setLoading(false);
    };
    fetchData();
  }, [activeView, selectedCats, country]);

  // ... rest of the code for handleSave and Reader Mode remains exactly the same ...