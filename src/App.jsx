import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import SupabaseTest from './pages/SupabaseTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/test" element={<SupabaseTest />} />
      </Routes>
    </Router>
  );
}

export default App;