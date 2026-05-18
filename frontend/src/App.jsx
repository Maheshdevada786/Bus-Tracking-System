import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { BusProvider } from './context/BusContext';

// Lazy loading all pages for massive performance boost
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Profile = React.lazy(() => import('./pages/Profile'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const BusPage = React.lazy(() => import('./pages/BusPage'));
const About = React.lazy(() => import('./pages/About'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Reminders = React.lazy(() => import('./pages/Reminders'));
const Feedback = React.lazy(() => import('./pages/Feedback'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AccessDenied = React.lazy(() => import('./pages/AccessDenied'));

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  
  if (token && userInfo) {
    try {
      const user = JSON.parse(userInfo);
      if (user.role === 'admin') {
        return children;
      } else {
        return <AccessDenied />;
      }
    } catch (e) {
      console.error('Invalid user info');
    }
  }
  
  return <Navigate to="/admin-login" replace />;
};

const FallbackLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', position: 'fixed', inset: 0, zIndex: 9999 }}>
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)' }}></div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
      <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '4px solid #a855f7', borderBottomColor: 'transparent', animation: 'spin 1.5s linear infinite reverse' }}></div>
    </div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Router>
      <BusProvider>
        <Layout>
          <Suspense fallback={<FallbackLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/buses" element={<BusPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </Suspense>
        </Layout>
      </BusProvider>
    </Router>
  );
}

export default App;
