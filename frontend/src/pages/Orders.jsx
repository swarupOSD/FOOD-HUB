import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiDownload, FiStar } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Mock Order for demonstration purposes if the user has no real orders
  const mockOrder = {
    _id: "demo9876543210",
    createdAt: new Date().toISOString(),
    orderStatus: "Out for Delivery",
    isPaid: true,
    paymentMethod: "UPI",
    totalPrice: 45.50,
    deliveryFee: 5.00,
    tax: 4.55,
    discount: 5.00,
    orderedItems: [
      {
        foodId: "mock1",
        title: "Signature Truffle Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
        price: 15.99,
        quantity: 2
      },
      {
        foodId: "mock2",
        title: "Loaded Truffle Fries",
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80",
        price: 8.97,
        quantity: 1
      }
    ]
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        // Sort by newest first
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Always show the mock order for demonstration if real orders are empty
        if (sortedOrders.length === 0) {
          setOrders([mockOrder]);
        } else {
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders', error);
        // On error or no backend, still show mock order for UI demonstration
        setOrders([mockOrder]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Confirmed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Preparing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Out for Delivery': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700'; // Mapped Pending to Order Placed
    }
  };

  const getStatusProgress = (status) => {
    // Map old statuses to new for compatibility with existing DB records
    let mappedStatus = status;
    if (status === 'Pending') mappedStatus = 'Order Placed';
    if (status === 'Processing') mappedStatus = 'Preparing';

    const stages = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    if (mappedStatus === 'Cancelled') return -1;
    return Math.max(0, stages.indexOf(mappedStatus));
  };

  const statusIcons = [
    <FiClock key="1" />,
    <FiCheckCircle key="2" />,
    <FiStar key="3" />,
    <FiTruck key="4" />,
    <FiCheckCircle key="5" />
  ];

  const downloadInvoice = (order) => {
    toast.info('Generating PDF Invoice...', { icon: "📄" });
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(249, 115, 22); // Orange
    doc.text("FOOD HUB", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Food Delivery Platform", 14, 28);
    
    // Order Info
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Invoice ID: #INV-${order._id.substring(order._id.length - 8).toUpperCase()}`, 14, 42);
    doc.text(`Order ID: #${order._id.substring(order._id.length - 8)}`, 14, 48);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 54);
    doc.text(`Customer Name: ${user?.name || 'Demo User'}`, 14, 60);
    doc.text(`UPI ID: 8906372069@ybl`, 14, 66);
    
    // Table
    const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
    const tableRows = [];
    
    order.orderedItems.forEach(item => {
      const itemData = [
        item.title,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ];
      tableRows.push(itemData);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 72,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 10 }
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY || 72;
    doc.setFontSize(12);
    doc.text(`Items Total: $${(order.totalPrice - (order.deliveryFee || 5) - (order.tax || 0)).toFixed(2)}`, 130, finalY + 10);
    doc.text(`Delivery: $${(order.deliveryFee || 5).toFixed(2)}`, 130, finalY + 16);
    doc.text(`Tax: $${(order.tax || (order.totalPrice * 0.1)).toFixed(2)}`, 130, finalY + 22);
    
    doc.setFontSize(14);
    doc.setTextColor(249, 115, 22);
    doc.text(`Total Amount: $${order.totalPrice.toFixed(2)}`, 130, finalY + 32);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for ordering from FOOD HUB 🍽️", 14, finalY + 50);
    
    doc.save(`FoodHub_Invoice_${order._id.substring(order._id.length - 8)}.pdf`);
    toast.success('Invoice downloaded successfully!', { icon: "✅" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">My Orders & Tracking</h1>
          <p className="text-slate-400 mt-2">Track your recent orders and download invoices.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(n => <div key={n} className="h-64 bg-slate-800/50 animate-pulse glass-card rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 glass-card rounded-3xl border-slate-800"
        >
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-50">No orders yet</h2>
          <p className="text-slate-400 mb-8">You haven't placed any orders. Start exploring our menu!</p>
          <Link to="/menu" className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-600/30 transition-all hover:scale-105 inline-block">
            Browse Menu
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => {
            const currentStage = getStatusProgress(order.orderStatus);
            let displayStatus = order.orderStatus;
            if (displayStatus === 'Pending') displayStatus = 'Order Placed';
            if (displayStatus === 'Processing') displayStatus = 'Preparing';
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order._id} 
                className="glass-card p-0 overflow-hidden border border-slate-800/80 rounded-3xl shadow-xl shadow-black/20 relative"
              >
                {order._id === "demo9876543210" && (
                  <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-yellow-500/30 z-20">
                    DEMONSTRATION ORDER
                  </div>
                )}
                <div className="bg-slate-900/80 p-6 border-b border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order #{order._id.substring(order._id.length - 8)}</p>
                      <p className="text-sm text-slate-300">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="flex gap-3 items-center flex-wrap">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${getStatusColor(displayStatus)}`}>
                        {displayStatus === 'Cancelled' ? <FiXCircle /> : currentStage === 4 ? <FiCheckCircle /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>}
                        {displayStatus}
                      </div>
                      
                      {/* INVOICE BUTTON */}
                      {(order.isPaid || order._id === "demo9876543210") && displayStatus !== 'Cancelled' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadInvoice(order)}
                          className="bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-lg"
                        >
                          <FiDownload /> Download PDF Invoice
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ADVANCED Progress Tracker */}
                {displayStatus !== 'Cancelled' && (
                  <div className="px-6 py-8 border-b border-slate-800/50 bg-slate-900/30 overflow-x-auto custom-scrollbar">
                    <div className="relative min-w-[500px]">
                      {/* Background Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
                      
                      {/* Active Line */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStage / 4) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-400 -translate-y-1/2 rounded-full z-0 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                      ></motion.div>
                      
                      {/* Stages */}
                      <div className="relative z-10 flex justify-between">
                        {['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((stage, i) => {
                          const isCompleted = i <= currentStage;
                          const isCurrent = i === currentStage;
                          
                          return (
                            <div key={stage} className="flex flex-col items-center w-24">
                              <motion.div 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: isCurrent ? 1.2 : 1 }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#0f172a] transition-all duration-500 relative ${
                                  isCompleted ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                {isCurrent && (
                                  <motion.div 
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full bg-orange-500"
                                  />
                                )}
                                <span className="relative z-10">{statusIcons[i]}</span>
                              </motion.div>
                              <span className={`text-xs font-bold mt-3 text-center ${isCurrent ? 'text-orange-400' : isCompleted ? 'text-slate-200' : 'text-slate-600'}`}>
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="font-bold mb-4 text-slate-200 flex items-center text-lg">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center mr-3">🛍️</span> 
                      Items Ordered
                    </h3>
                    <div className="space-y-4">
                      {order.orderedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm p-3 rounded-xl hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-700/50">
                          <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover mr-4 shadow-md" />
                          <div className="flex-grow">
                            <h4 className="font-bold text-slate-200 text-base">{item.title}</h4>
                            <p className="text-slate-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-slate-200 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 h-fit shadow-inner">
                    <h3 className="font-bold mb-4 text-slate-200 text-lg border-b border-slate-700/50 pb-2">Order Summary</h3>
                    
                    <div className="space-y-3 text-sm mb-4">
                      <div className="flex justify-between text-slate-400">
                        <span>Items Total</span>
                        <span className="text-slate-300">${(order.totalPrice - (order.deliveryFee || 5) - (order.tax || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery</span>
                        <span className="text-slate-300">${(order.deliveryFee || 5).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Tax</span>
                        <span className="text-slate-300">${(order.tax || (order.totalPrice * 0.1)).toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded">
                          <span>Discount Applied</span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-slate-700 pt-3 flex justify-between items-center mb-4">
                      <span className="text-slate-200 font-bold">Total Paid</span>
                      <span className="text-orange-500 font-black text-xl drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">${order.totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl flex items-center justify-between border border-slate-800">
                      <span className="text-xs text-slate-400">Payment</span>
                      <span className="text-xs font-bold text-slate-200 flex items-center">
                        {order.isPaid ? (
                          <><FiCheckCircle className="text-green-500 mr-1" /> Paid via {order.paymentMethod}</>
                        ) : (
                          <><FiClock className="text-yellow-500 mr-1" /> Pending ({order.paymentMethod})</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
