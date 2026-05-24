import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [ordersRes, foodsRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/foods')
        ]);
        
        // Sort orders newest first
        const sortedOrders = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setOrders(sortedOrders);
        setFoods(foodsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalFoods = foods.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <FiDollarSign size={24} className="text-green-500" />, trend: '+12.5%' },
    { title: 'Total Orders', value: totalOrders, icon: <FiShoppingBag size={24} className="text-blue-500" />, trend: '+5.2%' },
    { title: 'Active Orders', value: pendingOrders, icon: <FiTrendingUp size={24} className="text-orange-500" />, trend: 'Needs attention' },
    { title: 'Menu Items', value: totalFoods, icon: <FiBox size={24} className="text-purple-500" />, trend: 'Live' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Out for Delivery': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700';
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8 text-slate-50">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-32 bg-slate-800/50 animate-pulse glass-card rounded-2xl" />)}
        </div>
        <div className="h-96 bg-slate-800/50 animate-pulse glass-card rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-50">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card p-6 flex items-center justify-between border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-100 mb-1">{stat.value}</h3>
              <p className={`text-xs ${stat.trend.includes('+') ? 'text-green-500' : 'text-slate-500'}`}>{stat.trend}</p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/50 shadow-inner">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-0 border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-50">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400">
                <th className="py-4 px-6 font-medium text-sm">Order ID</th>
                <th className="py-4 px-6 font-medium text-sm">Customer</th>
                <th className="py-4 px-6 font-medium text-sm">Date</th>
                <th className="py-4 px-6 font-medium text-sm">Amount</th>
                <th className="py-4 px-6 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map(order => (
                <tr key={order._id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 text-sm text-slate-400 font-mono">#{order._id.substring(order._id.length - 8)}</td>
                  <td className="py-4 px-6 text-slate-200 font-medium">{order.userId?.name || 'Unknown User'}</td>
                  <td className="py-4 px-6 text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 font-bold text-slate-100">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">No orders have been placed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
