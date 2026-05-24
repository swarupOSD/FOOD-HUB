import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('/api/orders/status', { orderId, status }, config);
      toast.success('Order status updated');
      fetchOrders(); // refresh
    } catch (error) {
      toast.error('Failed to update status');
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-50">Manage Orders</h1>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-300">
                  <th className="py-4 px-6 font-medium">Order ID / Date</th>
                  <th className="py-4 px-6 font-medium">Customer Details</th>
                  <th className="py-4 px-6 font-medium">Items & Total</th>
                  <th className="py-4 px-6 font-medium">Status Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <div className="text-sm font-medium text-slate-200">{order._id.substring(0, 8)}...</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="font-medium text-slate-200">{order.userId?.name || 'Unknown'}</div>
                      <div className="text-sm text-slate-400">{order.deliveryAddress?.address}, {order.deliveryAddress?.city}</div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="text-sm mb-2 max-h-20 overflow-y-auto pr-2 custom-scrollbar">
                        {order.orderedItems.map(item => (
                          <div key={item.foodId} className="flex justify-between items-center mb-1 text-xs">
                            <span className="text-slate-400 truncate w-32"><span className="text-orange-500 font-medium">{item.quantity}x</span> {item.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className="font-bold text-orange-500 mt-2 pt-2 border-t border-slate-800/50 w-full inline-block text-lg">
                        ₹{order.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <select 
                        value={order.orderStatus === 'Pending' ? 'Order Placed' : order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none text-sm font-semibold cursor-pointer ${getStatusColor(order.orderStatus)}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status} className="bg-slate-900 text-slate-50">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">No orders found.</td>
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
