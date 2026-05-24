import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';

import { AuthContext } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('foodhub_loaded');
    if (hasLoaded) {
      setIsAppLoading(false);
    } else {
      sessionStorage.setItem('foodhub_loaded', 'true');
      const timer = setTimeout(() => {
        setIsAppLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Router>
      {/* ToastContainer with Premium Styling */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-slate-900/90 !backdrop-blur-md !border !border-slate-800 !shadow-2xl !shadow-black/50 !rounded-xl !text-slate-50"
      />
      
      <AnimatePresence>
        {isAppLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className={isAppLoading ? "h-screen overflow-hidden" : ""}>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="menu" element={<Menu />} />
            <Route path="food/:id" element={<FoodDetails />} />
            <Route path="cart" element={<Cart />} />
            
            {/* Protected User Routes */}
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="payment-cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="foods" element={<ManageFoods />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
