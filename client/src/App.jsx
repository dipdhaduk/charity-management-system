import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import About from './pages/About';
import OurWork from './pages/OurWork';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

// Dashboards
import DonorDashboard from './dashboard/DonorDashboard';
import CharityDashboard from './dashboard/CharityDashboard';
import VolunteerDashboard from './dashboard/VolunteerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

// Charity subpages
import CreateCampaign from './pages/charity/CreateCampaign';
import ManageCampaigns from './pages/charity/ManageCampaigns';
import ManageVolunteers from './pages/charity/ManageVolunteers';
import CampaignUpdates from './pages/charity/CampaignUpdates';

// Admin subpages
import AdminUsers from './pages/admin/Users';
import AdminCharities from './pages/admin/Charities';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminDonations from './pages/admin/Donations';

// Protected Route helper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink font-sans">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated General Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Role Dashboards */}
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/charity"
            element={
              <ProtectedRoute allowedRoles={['charity']}>
                <CharityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'donor', 'admin', 'charity']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Charity Management Routes */}
          <Route
            path="/charity/create-campaign"
            element={
              <ProtectedRoute allowedRoles={['charity']}>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charity/manage-campaigns"
            element={
              <ProtectedRoute allowedRoles={['charity']}>
                <ManageCampaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charity/volunteers"
            element={
              <ProtectedRoute allowedRoles={['charity']}>
                <ManageVolunteers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charity/updates"
            element={
              <ProtectedRoute allowedRoles={['charity']}>
                <CampaignUpdates />
              </ProtectedRoute>
            }
          />

          {/* Admin Management Routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/charities"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCharities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/campaigns"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCampaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDonations />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
