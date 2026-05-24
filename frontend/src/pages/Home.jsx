import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get('/api/foods');
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Get top rated foods for trending
  const trendingFoods = [...foods].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 font-medium text-sm mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.2)]"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            🚀 Free Delivery on Your First Order!
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-200 to-slate-400 leading-tight"
          >
            Craving something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
              extraordinary?
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light"
          >
            Explore the city's top-rated restaurants, hidden gems, and local favorites, delivered hot and fresh directly to your door in under 30 minutes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
          >
            <Link 
              to="/menu" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-full shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              Order Now <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/menu" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 backdrop-blur-sm rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <FiSearch className="mr-2" /> Browse Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-50">Popular Categories</h2>
            <p className="text-slate-400">Discover what people are loving right now.</p>
          </div>
          <Link to="/menu" className="text-orange-500 hover:text-orange-400 font-medium flex items-center group mt-4 md:mt-0">
            View All <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { name: 'Pizza', image: 'https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg?auto=compress&cs=tinysrgb&w=400', count: '120+ places' },
            { name: 'Burger', image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400', count: '85+ places' },
            { name: 'Sushi', image: 'https://images.pexels.com/photos/1148086/pexels-photo-1148086.jpeg?auto=compress&cs=tinysrgb&w=400', count: '45+ places' },
            { name: 'Indian', image: 'https://images.pexels.com/photos/2418264/pexels-photo-2418264.jpeg?auto=compress&cs=tinysrgb&w=400', count: '60+ places' },
            { name: 'Healthy', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', count: '30+ places' }
          ].map((category, index) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -10, scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl aspect-[3/4] border border-slate-700/50"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                <h3 className="font-bold text-2xl text-white mb-1 group-hover:text-orange-400 transition-colors">{category.name}</h3>
                <p className="text-slate-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">{category.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 px-4 bg-slate-900/50 border-y border-slate-800/50 relative overflow-hidden">
        <div className="absolute -left-32 top-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-50 flex items-center">
                Trending Near You <span className="ml-3 text-2xl animate-pulse">🔥</span>
              </h2>
              <p className="text-slate-400">The most ordered dishes in your area.</p>
            </div>
            <Link to="/menu" className="text-orange-500 hover:text-orange-400 font-medium flex items-center group mt-4 md:mt-0">
              See More <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="glass-card h-80 animate-pulse bg-slate-800/50 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingFoods.map(food => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-slate-900/40 blur-[100px] -z-10 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold text-xs uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
            >
              Why Choose Us
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-50 mb-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Experience</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We bring you the absolute best food with top-tier service, because you deserve nothing less.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { 
                title: 'Fast Delivery', 
                desc: 'Deliver food within 30 minutes or less. Hot, fresh meals delivered quickly to your doorstep.', 
                icon: '⚡', 
                color: 'text-yellow-400', 
                bg: 'bg-yellow-500/10',
                glow: 'group-hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]',
                gradient: 'from-yellow-400 to-orange-500'
              },
              { 
                title: 'Fresh Food', 
                desc: 'We use daily fresh ingredients to ensure healthy, tasty, and high-quality meals.', 
                icon: '🥗', 
                color: 'text-green-400', 
                bg: 'bg-green-500/10',
                glow: 'group-hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]',
                gradient: 'from-green-400 to-emerald-500'
              },
              { 
                title: 'Premium Quality', 
                desc: 'We work only with top-rated restaurants and trusted kitchens for the best food experience.', 
                icon: '⭐', 
                color: 'text-orange-400', 
                bg: 'bg-orange-500/10',
                glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
                gradient: 'from-orange-400 to-red-500'
              },
              { 
                title: 'Trusted Service', 
                desc: 'Our support team is available 24/7 to help you with orders, payments, and any issues anytime.', 
                icon: '🛡️', 
                color: 'text-blue-400', 
                bg: 'bg-blue-500/10',
                glow: 'group-hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]',
                gradient: 'from-blue-400 to-indigo-500'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`group relative flex flex-col items-center p-6 md:p-8 rounded-[2.5rem] border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/90 transition-all duration-500 hover:-translate-y-2 ${feature.glow}`}
              >
                {/* Background animated blob */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-700 ease-in-out`}></div>
                
                <div className={`text-5xl mb-6 w-24 h-24 rounded-[1.5rem] ${feature.bg} ${feature.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                  {feature.icon}
                </div>
                
                <h3 className={`text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}>
                  {feature.title}
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
                
                {/* Subtle bottom highlight */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-t-full transition-opacity duration-500`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
