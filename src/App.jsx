import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import RegistrationDebug from './pages/RegistrationDebug';

// Components
import AdminProtection from './components/AdminProtection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={
          <AdminProtection>
            <AdminDashboard />
          </AdminProtection>
        } />
        <Route path="/debug" element={
          <AdminProtection>
            <RegistrationDebug />
          </AdminProtection>
        } />
      </Routes>
    </Router>
  );
}

export default App;