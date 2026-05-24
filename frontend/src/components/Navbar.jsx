import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.7)] transition-all group-hover:scale-105 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                🍽️
              </div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] hidden sm:block">
                FOOD HUB
              </span>
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] sm:hidden">
                FOOD HUB
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:bg-orange-500/10 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/orders"
                  className="hover:bg-orange-500/10 text-orange-400 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-1"
                >
                  Track Orders
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">

            <Link to="/cart" className="relative p-2 text-slate-50 hover:text-orange-500 transition-colors">
              <FiShoppingCart className="h-6 w-6" />
              {cart?.items?.length > 0 && (
                <motion.span 
                  key={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                  initial={{ scale: 0.5, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"
                >
                  {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-xl glass-card ring-1 ring-white/10 focus:outline-none overflow-hidden"
                    >
                      <div className="py-1">
                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-slate-800 transition-colors" onClick={() => setDropdownOpen(false)}>Profile</Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-slate-800 transition-colors" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2 text-sm text-orange-500 hover:bg-slate-800 transition-colors" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                        )}
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-800 transition-colors">Logout</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-500 shadow-md shadow-orange-600/20 transition-all hover:shadow-orange-500/40">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <Link to="/cart" className="relative p-2 mr-2 text-slate-50">
              <FiShoppingCart className="h-6 w-6" />
              {cart?.items?.length > 0 && (
                <motion.span 
                  key={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                  initial={{ scale: 0.5, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"
                >
                  {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-50 hover:text-orange-500 focus:outline-none transition-colors"
            >
              {isOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-orange-500/10 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:bg-orange-500/10 block px-3 py-2 rounded-md text-base font-medium transition-colors">Profile</Link>
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="hover:bg-orange-500/10 block px-3 py-2 rounded-md text-base font-medium transition-colors">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-orange-500 hover:bg-orange-500/10 block px-3 py-2 rounded-md text-base font-medium transition-colors">Admin Dashboard</Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left text-red-500 hover:bg-red-500/10 block px-3 py-2 rounded-md text-base font-medium transition-colors">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="hover:bg-orange-500/10 block px-3 py-2 rounded-md text-base font-medium transition-colors">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
