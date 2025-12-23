import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateOpportunity from './pages/CreateOpportunity';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetails from './pages/OpportunityDetails';
import OpportunityApplications from './pages/OpportunityApplications';
import './App.css';

import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/opportunities/:id" element={<OpportunityDetails />} />
              <Route path="/opportunities/:id/applications" element={<OpportunityApplications />} />
              <Route path="/dashboard" element={<VolunteerDashboard />} />
              <Route path="/dashboard-org" element={<OrganizationDashboard />} />
              <Route path="/create-opportunity" element={<CreateOpportunity />} />
              <Route path="/profile" element={<Profile />} />
              {/* More routes to be added */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
