import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiStar, FiMapPin } from 'react-icons/fi';

const FoodCard = ({ food }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const result = await addToCart(food, 1);
    if (result.success) {
      toast.success(`${food.title} added to cart`);
    } else {
      toast.error(result.message);
    }
  };

  // Mock offer/discount logic
  const hasOffer = food.price > 15;
  const originalPrice = hasOffer ? (food.price * 1.2).toFixed(2) : null;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-card overflow-hidden flex flex-col group relative transition-all duration-300 hover:shadow-orange-500/20 hover:border-slate-600 rounded-2xl"
    >
      <Link to={`/food/${food._id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img 
          src={food.image} 
          alt={food.title} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/800x600/1e293b/f97316?text=Image+Not+Found';
          }}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        {hasOffer && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            20% OFF
          </div>
        )}

        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-orange-400 border border-white/10 shadow-lg">
          ₹{food.price.toFixed(2)}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <Link to={`/food/${food._id}`}>
            <h3 className="text-xl font-bold text-slate-50 hover:text-orange-500 transition-colors line-clamp-1">{food.title}</h3>
          </Link>
          <div className="flex items-center space-x-1 text-sm bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-1 rounded-md whitespace-nowrap">
            <FiStar className="fill-current" />
            <span className="font-bold">{food.rating || '4.5'}</span>
          </div>
        </div>
        
        <div className="flex items-center text-slate-400 text-sm mb-3">
          <FiMapPin className="mr-1 text-orange-500/70" size={14} />
          <span className="truncate">{food.restaurantName || 'Local Restaurant'}</span>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {food.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
          <div className="flex flex-col">
            {hasOffer ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 line-through">₹{originalPrice}</span>
                <span className="text-lg font-bold text-slate-200">₹{food.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-slate-200">₹{food.price.toFixed(2)}</span>
            )}
            <span className="text-xs text-slate-500 capitalize">{food.category}</span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8, rotate: -15 }}
            onClick={handleAddToCart}
            className="bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white p-3 rounded-xl border border-orange-600/30 shadow-lg transition-colors duration-300 hover:shadow-orange-600/30 group-hover:bg-orange-600 group-hover:text-white"
            aria-label="Add to cart"
          >
            <FiShoppingBag size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
