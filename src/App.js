import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimeSearchForm from './Search.jsx';
import ResultsPage from './Results.jsx';
import GenresList from './GenresList.jsx'; // Import the GenresList component
import ProducersList from './ProducersList.jsx'; // Import the ProducersList component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimeSearchForm />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path='/genres' element={<GenresList />} />
        <Route path='/producers' element={<ProducersList />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}
export default App;
