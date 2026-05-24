import { useState, useEffect } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { motion } from 'framer-motion';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

  const categories = ['All', ...new Set(foods.map(food => food.category))];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-slate-50">Our Menu</h1>
          <p className="text-slate-400">Discover our delicious offerings.</p>
        </div>
        
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search food..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-6 py-2 rounded-full border transition-all ${
              activeCategory === category 
                ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/30' 
                : 'border-slate-700 hover:border-orange-500 text-slate-400 bg-slate-900/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="glass-card h-80 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : filteredFoods.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredFoods.map(food => (
            <FoodCard key={food._id} food={food} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-slate-400">No food items found.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
