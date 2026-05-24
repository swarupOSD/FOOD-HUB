import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiCopy, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [txnId, setTxnId] = useState('');
  
  // Safely extract state from navigation
  const orderId = location.state?.orderId || 'ORD' + Math.floor(100000 + Math.random() * 900000);
  const amount = location.state?.amount || 0;
  const method = location.state?.method || 'UPI';

  useEffect(() => {
    // Generate realistic fake transaction ID based on method
    let prefix = 'TXN';
    if (method === 'PhonePe') prefix = 'PHNPE';
    else if (method === 'Google Pay') prefix = 'GPY';
    else if (method === 'Paytm') prefix = 'PTM';
    else if (method === 'BHIM UPI') prefix = 'BHIM';
    
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000); // 10 random digits
    setTxnId(`${prefix}${randomDigits}`);
    
    // Automatically redirect to home if accessed directly without state after a few seconds
    if (!location.state) {
      const timer = setTimeout(() => navigate('/orders'), 5000);
      return () => clearTimeout(timer);
    }
  }, [method, location, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="glass-card p-0 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl overflow-hidden bg-slate-900"
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4 text-white drop-shadow-md"
          >
            <FiCheckCircle size={70} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-1 text-white">Payment Successful</h1>
          <p className="text-green-100/80 text-sm">Your order has been placed</p>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-6 border-b border-slate-800 pb-6">
            <p className="text-slate-400 text-sm mb-1">Amount Paid</p>
            <h2 className="text-4xl font-bold text-slate-50">₹{amount > 0 ? amount.toFixed(2) : '0.00'}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/50 rounded-full text-xs text-slate-300 mt-3 border border-slate-700/50">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Paid via {method}
            </div>
          </div>

          <div className="space-y-4 text-sm mb-8">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Order ID</span>
              <span className="text-slate-200 font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-medium font-mono">{txnId}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(txnId)}
                  className="text-slate-500 hover:text-orange-500 transition-colors"
                  title="Copy"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Date</span>
              <span className="text-slate-200 font-medium">
                {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <FiDownload /> Receipt
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/30"
            >
              Track Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
