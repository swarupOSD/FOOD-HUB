import { useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-12 rounded-3xl max-w-md w-full text-center border border-slate-800 shadow-2xl"
      >
        <div className="flex justify-center mb-6 text-red-500">
          <FiXCircle size={80} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-slate-50">Payment Cancelled</h1>
        <p className="text-slate-400 mb-8">
          You have cancelled the payment process. Your order has not been placed and no charges were made.
        </p>
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-orange-600/30"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
