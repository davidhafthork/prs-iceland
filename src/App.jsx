import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import RegistrationDebug from './pages/RegistrationDebug';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/debug" element={<RegistrationDebug />} />
      </Routes>
    </Router>
  );
}

export default App;