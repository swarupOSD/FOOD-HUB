import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
      
      // Initialize local state for dropdowns
      const initialStatuses = {};
      sortedOrders.forEach(order => {
        initialStatuses[order._id] = order.orderStatus === 'Pending' ? 'Order Placed' : order.orderStatus;
      });
      setSelectedStatuses(initialStatuses);
      
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatuses(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const updateStatus = async (orderId) => {
    const status = selectedStatuses[orderId];
    setUpdatingId(orderId);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('/api/orders/status', { orderId, status }, config);
      toast.success('Order status updated successfully!');
      // Update local state directly instead of full refetch for better UX
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
      case 'Order Placed': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Confirmed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Preparing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Out for Delivery': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700';
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const mappedStatus = order.orderStatus === 'Pending' ? 'Order Placed' : order.orderStatus;
    const matchesFilter = statusFilter === 'All' || mappedStatus === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Manage Orders</h1>
          <p className="text-slate-400 mt-2">Monitor and update customer order statuses.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50 w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50 appearance-none cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Loading orders data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Order Info</th>
                  <th className="py-4 px-6 font-semibold">Customer & Delivery</th>
                  <th className="py-4 px-6 font-semibold">Payment & Total</th>
                  <th className="py-4 px-6 font-semibold">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <AnimatePresence>
                  {filteredOrders.map(order => {
                    const isUpdating = updatingId === order._id;
                    const mappedStatus = order.orderStatus === 'Pending' ? 'Order Placed' : order.orderStatus;
                    const hasChanged = selectedStatuses[order._id] !== mappedStatus;

                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order._id} 
                        className="hover:bg-slate-800/20 transition-colors group"
                      >
                        <td className="py-5 px-6 align-top w-48">
                          <div className="text-sm font-bold text-slate-200 font-mono">#{order._id.substring(0, 8)}</div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center">
                            <FiClock className="mr-1" />
                            {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="font-bold text-slate-200 mb-1">{order.userId?.name || 'Unknown Customer'}</div>
                          <div className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            {order.deliveryAddress?.address}<br/>
                            {order.deliveryAddress?.city}, {order.deliveryAddress?.postalCode}
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top w-48">
                          <div className="font-black text-orange-500 text-lg mb-2">
                            ₹{order.totalPrice.toFixed(2)}
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${order.isPaid ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                            {order.isPaid ? (
                              <><FiCheckCircle size={12}/> Paid ({order.paymentMethod})</>
                            ) : (
                              <><FiClock size={12}/> Pending Payment</>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="flex flex-col gap-2">
                            <select 
                              value={selectedStatuses[order._id] || mappedStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none appearance-none text-sm font-bold cursor-pointer transition-colors ${getStatusColor(selectedStatuses[order._id] || mappedStatus)}`}
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status} className="bg-slate-900 text-slate-50">
                                  {status}
                                </option>
                              ))}
                            </select>
                            
                            {hasChanged && (
                              <motion.button 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                onClick={() => updateStatus(order._id)}
                                disabled={isUpdating}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2 rounded-lg transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {isUpdating ? (
                                  <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Updating...</>
                                ) : (
                                  'Save Update'
                                )}
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-slate-200 mb-1">No Orders Found</h3>
                      <p className="text-slate-400">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
