import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCreditCard, FiPackage, FiMapPin, FiTag, FiX, FiCheck, FiSmartphone, FiShield } from 'react-icons/fi';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';

const mapContainerStyle = { width: '100%', height: '300px', borderRadius: '0.75rem' };
const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // Default: New York

const Checkout = () => {
  const { cart, clearCart, subtotal, taxAmount, deliveryFee, discountAmount, finalTotal, applyCoupon, removeCoupon, couponCode: activeCoupon } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: user?.address || '',
    city: '',
    postalCode: '',
    country: '',
    lat: defaultCenter.lat,
    lng: defaultCenter.lng
  });

  const [paymentMethod, setPaymentMethod] = useState('PhonePe');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'placeholder'
  });

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setShippingAddress(prev => ({ ...prev, lat, lng }));
    toast.info('Location pinned! (Geocoding requires valid API key)');
  }, []);

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

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Open UPI Modal instead of directly placing order
  const handleProceedToPay = (e) => {
    e.preventDefault();
    setShowUPIModal(true);
  };

  // User clicks "I Have Paid"
  const handleConfirmPayment = async () => {
    setIsPlacingOrder(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const orderData = {
        orderedItems: cart.items,
        deliveryAddress: shippingAddress,
        paymentMethod: `UPI - ${paymentMethod}`,
        totalPrice: finalTotal,
        tax: taxAmount,
        deliveryFee,
        discount: discountAmount,
      };

      const { data: createdOrder } = await axios.post('/api/orders/create', orderData, config);
      
      // Since it's UPI, mark as paid immediately for demo
      await axios.put(`/api/orders/${createdOrder._id}/pay`, {}, config);

      clearCart();
      setShowUPIModal(false);
      navigate('/payment-success', { state: { orderId: createdOrder._id, amount: finalTotal, method: paymentMethod } });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setIsPlacingOrder(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) return null;

  // Generate dynamic QR code URL
  const upiId = '8906372069@ybl';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=FoodHub&am=${finalTotal.toFixed(2)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-slate-50">Secure Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleProceedToPay} className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-4 text-slate-50 flex items-center gap-2">
              <FiMapPin className="text-orange-500" /> Delivery Location
            </h2>
            
            <div className="w-full bg-slate-900/50 p-2 rounded-xl border border-slate-800">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={12}
                  onClick={onMapClick}
                  options={{ styles: [{ elementType: 'geometry', stylers: [{ color: '#242f3e' }] }, { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] }] }}
                >
                  <Marker position={markerPosition} animation={2} />
                </GoogleMap>
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center bg-slate-900 text-slate-400 rounded-xl animate-pulse">
                  Loading Map...
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2 text-center">Click on the map to pin your exact delivery location.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingAddress.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-50"
                  placeholder="123 Food Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-50"
                  placeholder="New York"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-50"
                  placeholder="10001"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={shippingAddress.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-50"
                  placeholder="United States"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold border-b border-slate-800 pb-4 mt-8 text-slate-50 flex items-center gap-2">
              <FiSmartphone className="text-orange-500" /> UPI Payment
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'PhonePe', icon: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png' },
                { name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
                { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
                { name: 'BHIM UPI', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg' },
                { name: 'Navi', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEU8AFAi0IEg14M2W189AE44LVgh04IopncvhWwlvXwyamUh1YI9AEw5L1gg2YQ7E1I1X186J1Qe34Yxbmcjxn8nsXkiyoAyZmQrlXI5OlguiW0xf2g1Sl47AFMxcmc4NFg1T180WmE0VGArnHMoqXc7DVI6GVQkv305H1Yqn3Q3SVs3QlqJUpk5AAACeklEQVR4nO3dbXOaQBSGYXYl2ygividNbJOmxqTt//9/pTP90FFYlgAe9vS+vuM89xBn1AgmCQAAAAAAAAAAAAAAAAAA/6W0L9IhdYrlpB/LlXRKjXxt+7FejvQs3ljTDzuhUAiFFFIoj0IKKZRHIYUUyqOQQgrlUUghhfIopJBCefk6ayHGwmIzC3Z370kcbWGb/67N76IsbCGdURg7CqX3dUeh9L7uKJTe1x2F0vu6o1B6X3eChVf6tp1c4eeH2w95PHxpFSlWmE5avU//x8LuZkX4MMHCj3/W4uz2a/CyKAv/TNslgdtiLTTZNg8bF22hcfunoHXxFpaJQWcx4sLAxJgLjXPPzQOjLiwbvzUujLzQuJemibEXGtd0PUH0hcZt/CPjLzT20btSQWGZOFdeaOytZ6eKQmMf6ofqKDT2vnapkkJjv2svNPaT9sIysXqsnkJjj9oLTTZ9rdirqbBMPF0OVlVosrfLjxl1FZZnsVBeaLKd9kKzOH+nMdZC57+O3nNkdvZ3mm48F+8PeT2+v9Ad32/qrQ6eY7Pzl6invP6R8oun7dUKa16g/D125T3/w41upUuh/xu02UjuBDFgoe/98BUNV+h26gun+guv1eBHIYUUyqOQQgrlUUghhfIopJBCeRRSSKE8CimkUB6FFFIoj0IKKZRHIYUUyqOQQgrlUUih8sLVQnvhSf05TKZOeWHqu6+sjsKD9sIk/VGfqKMwKba1z0QlhWm+rzuLSgqT9HRcVJ/G0RQufb8lujg2f99+/nzcm6pjt1eYH2Ll/T3YnwGPkKavv6qOfRl8e6Be7hzY/a6DAAAAAAAAAAAAAAAAAADE6jd6+ExvptEO9wAAAABJRU5ErkJggg==' },
                
              ].map((method) => (
                <div 
                  key={method.name}
                  className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center ${paymentMethod === method.name ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}`}
                  onClick={() => setPaymentMethod(method.name)}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={method.name} 
                    checked={paymentMethod === method.name} 
                    onChange={() => {}}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 mr-3 shrink-0"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2 overflow-hidden">
                    <div className="h-6 w-16 bg-white rounded flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      <img 
                        src={method.icon} 
                        alt={method.name} 
                        className="h-full w-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <label className="font-medium text-slate-200 text-sm whitespace-nowrap cursor-pointer truncate">
                      {method.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg shadow-orange-600/30 mt-6 text-lg"
            >
              Proceed to Pay ${finalTotal.toFixed(2)}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="glass-card p-6 sticky top-24 border border-slate-800">
            <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-2 text-slate-50">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map(item => (
                <div key={item.foodId} className="flex justify-between items-center text-sm text-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-orange-500">{item.quantity}x</span>
                    <span className="truncate max-w-[150px]">{item.title}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-slate-800 pt-4 mt-6">
              
              <div className="mb-6">
                <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><FiTag className="text-orange-500" /> Have a Coupon?</h3>
                {activeCoupon ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-between bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                    <div className="flex items-center text-green-500">
                      <FiCheck className="mr-2" />
                      <span className="font-bold">{activeCoupon}</span> applied
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-slate-400 hover:text-red-500 transition-colors">
                      <FiX />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g., SAVE50, FOODIE20" 
                      className="flex-grow px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 text-slate-50 text-sm uppercase"
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between border-t border-slate-800 pt-4">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery</span>
                <span className="text-slate-200">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax</span>
                <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 mt-2 pt-4 flex justify-between items-center text-lg font-bold">
                <span className="text-slate-50">Total</span>
                <span className="text-orange-500 text-2xl">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI QR Code Modal */}
      <AnimatePresence>
        {showUPIModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl"
            >
              <button 
                onClick={() => setShowUPIModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-50 transition-colors"
                disabled={isPlacingOrder}
              >
                <FiX size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-50 mb-2">Pay via {paymentMethod}</h2>
              <p className="text-slate-400 mb-6 text-sm">Scan QR code using any UPI app</p>
              
              <div className="bg-white p-4 rounded-2xl mx-auto mb-6 w-fit shadow-xl shadow-orange-500/10">
                <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Amount to Pay</div>
                <div className="text-3xl font-bold text-orange-500 mb-3">${finalTotal.toFixed(2)}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">UPI ID</div>
                <div className="text-sm font-medium text-slate-200 select-all bg-slate-900/50 py-1.5 px-3 rounded-lg inline-block mt-1 border border-slate-700 flex items-center justify-center gap-2 mx-auto">
                  <FiShield className="text-green-500" /> {upiId}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400 mb-6">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                <span>Awaiting payment confirmation...</span>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={isPlacingOrder}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'I Have Paid'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
