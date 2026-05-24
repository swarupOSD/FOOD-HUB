import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setIsSubmitting(true);
    
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.address,
      formData.phone
    );
    
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full glass-card p-8 shadow-2xl shadow-orange-500/10"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-50">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Join FoodHub today
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 placeholder-slate-500 text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 placeholder-slate-500 text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 placeholder-slate-500 text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 placeholder-slate-500 text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <input
            name="phone"
            type="text"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 placeholder-slate-500 text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <textarea
            name="address"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 placeholder-slate-500 text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Delivery Address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-500/50 hover:scale-[1.02] mt-6"
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
