import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  
  // discount stores percentage (0 to 1) or flat amount depending on type
  const [discount, setDiscount] = useState(0); 
  const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'flat'
  const [couponCode, setCouponCode] = useState('');
  
  const { user } = useContext(AuthContext);

  const DELIVERY_FEE = 5.00; // Fixed delivery fee
  const TAX_RATE = 0.05; // 5% tax

  const fetchCart = async () => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('/api/cart', config);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
      setDiscount(0);
      setDiscountType('percent');
      setCouponCode('');
    }
  }, [user]);

  const addToCart = async (foodItem, quantity = 1) => {
    if (!user) return { success: false, message: 'Please login to add to cart' };
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post('/api/cart/add', {
        foodId: foodItem._id,
        title: foodItem.title,
        price: foodItem.price,
        image: foodItem.image,
        quantity,
      }, config);
      setCart(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const removeFromCart = async (foodId) => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        data: { foodId } // axios delete requires data like this if passed in body
      };
      const { data } = await axios.delete('/api/cart/remove', config);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  const applyCoupon = (code) => {
    const normalizedCode = code.trim().toUpperCase();
    
    if (normalizedCode === 'SAVE50') {
      setDiscount(5.00); // $5.00 flat discount
      setDiscountType('flat');
      setCouponCode(normalizedCode);
      return { success: true, message: '$5.00 discount applied!' };
    } 
    else if (normalizedCode === 'FIRSTORDER') {
      setDiscount(0.10); // 10% discount
      setDiscountType('percent');
      setCouponCode(normalizedCode);
      return { success: true, message: '10% discount applied!' };
    }
    else if (normalizedCode === 'FOODIE20') {
      setDiscount(0.20); // 20% discount
      setDiscountType('percent');
      setCouponCode(normalizedCode);
      return { success: true, message: '20% discount applied!' };
    }
    
    return { success: false, message: 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setDiscount(0);
    setDiscountType('percent');
    setCouponCode('');
  };

  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
    setDiscount(0);
    setDiscountType('percent');
    setCouponCode('');
  };

  // Calculations
  const subtotal = cart.totalPrice;
  
  // Calculate discount amount
  let calculatedDiscount = 0;
  if (discountType === 'percent') {
    calculatedDiscount = subtotal * discount;
  } else if (discountType === 'flat') {
    // Ensure discount doesn't exceed subtotal
    calculatedDiscount = discount > subtotal ? subtotal : discount;
  }
  
  const discountAmount = calculatedDiscount;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;
  const finalDeliveryFee = cart.items.length > 0 ? DELIVERY_FEE : 0;
  const finalTotal = taxableAmount + taxAmount + finalDeliveryFee;

  return (
    <CartContext.Provider value={{ 
      cart, 
      subtotal,
      taxAmount,
      deliveryFee: finalDeliveryFee,
      discountAmount,
      finalTotal,
      couponCode,
      applyCoupon,
      removeCoupon,
      fetchCart, 
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
