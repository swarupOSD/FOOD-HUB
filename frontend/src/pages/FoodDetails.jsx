import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiStar, FiUser, FiThumbsUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  // Review System State
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchFood = async () => {
    try {
      const { data } = await axios.get(`/api/foods/${id}`);
      setFood(data);
    } catch (error) {
      toast.error('Food not found');
      navigate('/menu');
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/foods/${id}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchFood(), fetchReviews()]);
      setLoading(false);
    };
    loadData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    const result = await addToCart(food, quantity);
    if (result.success) {
      toast.success(`${quantity} ${food.title} added to cart`);
    } else {
      toast.error(result.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating!");
      return;
    }
    setIsSubmitting(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(`/api/foods/${id}/reviews`, { rating, comment: reviewText }, config);
      toast.success("Review submitted successfully!", { icon: "🌟" });
      setShowReviewForm(false);
      setRating(0);
      setReviewText('');
      // Re-fetch data to update rating and reviews
      await Promise.all([fetchFood(), fetchReviews()]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(`/api/foods/${id}/reviews/${reviewId}/helpful`, {}, config);
      // Update the review in state optimistically
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: data.helpful } : r));
    } catch (error) {
      toast.error('Failed to register vote');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2 h-96 bg-slate-800/50 rounded-2xl glass"></div>
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="h-10 bg-slate-800/50 rounded w-3/4"></div>
            <div className="h-6 bg-slate-800/50 rounded w-1/4"></div>
            <div className="h-24 bg-slate-800/50 rounded w-full"></div>
            <div className="h-12 bg-slate-800/50 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/menu" className="inline-flex items-center text-slate-400 hover:text-orange-500 mb-8 transition-colors">
        <FiArrowLeft className="mr-2" /> Back to Menu
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2"
        >
          <div className="relative rounded-3xl overflow-hidden glass aspect-square lg:aspect-auto lg:h-[500px] border border-slate-700/50 shadow-2xl">
            <img 
              src={food.image} 
              alt={food.title} 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-lg font-bold text-orange-500 border border-slate-700/50 shadow-lg">
              ₹{food.price.toFixed(2)}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 flex flex-col justify-center"
        >
          <div className="mb-2 flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider border border-slate-700 bg-slate-800/50 px-3 py-1 rounded-full">
              {food.category}
            </span>
            <div className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/20">
              <FiStar className="fill-current" />
              <span>{food.rating || '0'}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-50">{food.title}</h1>
          <p className="text-slate-400 text-sm mb-6">Prepared by <span className="font-semibold text-slate-200">{food.restaurantName}</span></p>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
            {food.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto">
            <div className="flex items-center border border-slate-700 rounded-full bg-slate-900/80 glass p-1 w-full sm:w-auto justify-between sm:justify-start">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <FiMinus />
              </button>
              <span className="w-12 text-center font-bold text-xl text-slate-50">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <FiPlus />
              </button>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 w-full flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white h-14 rounded-full font-bold text-lg shadow-lg shadow-orange-600/30 transition-colors"
            >
              <FiShoppingBag className="mr-2" />
              Add to Cart - ₹{(food.price * quantity).toFixed(2)}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-24 border-t border-slate-800 pt-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-slate-800/50 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-50 mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-500 text-xl">
                {[1, 2, 3, 4, 5].map(i => <FiStar key={i} className={i <= Math.round(food.rating || 0) ? "fill-current" : "text-slate-600"} />)}
              </div>
              <span className="text-slate-300 font-bold text-lg">{food.rating || '0'}</span>
              <span className="text-slate-500 text-sm">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
          
          {user ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-6 md:mt-0 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 px-6 py-3 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </motion.button>
          ) : (
            <Link 
              to="/login"
              className="mt-6 md:mt-0 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 px-6 py-3 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2"
            >
              Login to Write a Review
            </Link>
          )}
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <form onSubmit={handleReviewSubmit} className="bg-slate-900/50 border border-slate-700/50 p-6 sm:p-8 rounded-3xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-3xl pointer-events-none"></div>
                <h3 className="text-xl font-bold text-slate-200 mb-6 relative z-10">Rate your experience</h3>
                
                <div className="flex items-center gap-2 mb-6 relative z-10">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className={`text-3xl focus:outline-none transition-colors ${
                        star <= (hoveredStar || rating) 
                          ? 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' 
                          : 'text-slate-700'
                      }`}
                    >
                      <FiStar className={star <= (hoveredStar || rating) ? 'fill-current' : ''} />
                    </motion.button>
                  ))}
                  <span className="ml-4 text-sm text-slate-400">
                    {rating === 0 ? "Select a rating" : rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
                  </span>
                </div>

                <div className="relative z-10">
                  <textarea 
                    rows="4" 
                    placeholder="Tell others what you thought about this food..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end relative z-10">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/30 transition-all flex items-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {reviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No reviews yet</h3>
            <p className="text-slate-500">Be the first to review this food!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div 
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-slate-700/80 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                      <FiUser />
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-bold text-sm">{review.name}</h4>
                      <span className="text-slate-500 text-xs">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
                    <FiStar className="text-yellow-500 fill-current mr-1 text-xs" />
                    <span className="text-slate-200 font-bold text-xs">{review.rating}.0</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  "{review.comment}"
                </p>
                <div className="flex items-center text-xs text-slate-500 border-t border-slate-800/50 pt-4 mt-auto">
                  <button 
                    onClick={() => handleHelpful(review._id)}
                    className="flex items-center gap-1 hover:text-orange-400 transition-colors"
                  >
                    <FiThumbsUp /> Helpful ({review.helpful})
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
