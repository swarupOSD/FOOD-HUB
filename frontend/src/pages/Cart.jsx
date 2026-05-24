import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiArrowRight, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    subtotal, 
    deliveryFee, 
    taxAmount, 
    discountAmount, 
    finalTotal, 
    couponCode, 
    applyCoupon 
  } = useContext(CartContext);
  
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-slate-50">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Looks like you haven't added any food yet.</p>
        <Link 
          to="/menu" 
          className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-orange-600/30"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-slate-50">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="glass-card overflow-hidden">
            <div className="p-6">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    transition={{ duration: 0.2 }}
                    key={item.foodId} 
                    className="flex flex-col sm:flex-row items-center py-6 border-b border-slate-800 last:border-0 gap-6 group hover:bg-slate-800/30 transition-colors rounded-xl px-2 -mx-2"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-24 h-24 rounded-xl object-cover shadow-md"
                    />
                    
                    <div className="flex-grow text-center sm:text-left">
                      <Link to={`/food/${item.foodId}`} className="text-xl font-bold text-slate-100 hover:text-orange-500 transition-colors">
                        {item.title}
                      </Link>
                      <p className="text-slate-400 mt-1">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700 font-medium text-slate-200">
                        Qty: {item.quantity}
                      </div>
                      
                      <div className="text-xl font-bold text-orange-500 w-24 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <button 
                        onClick={() => {
                          removeFromCart(item.foodId);
                          toast.success('Item removed from cart');
                        }}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/20 p-2 bg-red-500/10 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-slate-50">Order Summary</h2>
            
            <form onSubmit={handleApplyCoupon} className="mb-6 flex gap-2">
              <input 
                type="text" 
                placeholder="Coupon code (try FOODHUB20)" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-grow px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-slate-50 uppercase"
              />
              <button 
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2"
              >
                <FiTag /> Apply
              </button>
            </form>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount ({couponCode})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Fee</span>
                <span className="text-slate-200">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Tax (5%)</span>
                <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-700 pt-4 flex justify-between items-center text-lg font-bold">
                <span className="text-slate-50">Total</span>
                <span className="text-orange-500 text-2xl">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg shadow-orange-600/30"
            >
              Proceed to Checkout
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
