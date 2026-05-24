import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    restaurantName: '',
    image: null,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get('/api/foods');
      setFoods(data);
    } catch (error) {
      toast.error('Failed to fetch foods');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('restaurantName', formData.restaurantName);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingId) {
        await axios.put(`/api/foods/${editingId}`, data, config);
        toast.success('Food updated successfully');
      } else {
        await axios.post('/api/foods', data, config);
        toast.success('Food added successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving food');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/foods/${id}`, config);
        toast.success('Food deleted');
        fetchFoods();
      } catch (error) {
        toast.error('Error deleting food');
      }
    }
  };

  const openEditModal = (food) => {
    setEditingId(food._id);
    setFormData({
      title: food.title,
      description: food.description,
      category: food.category,
      price: food.price,
      restaurantName: food.restaurantName,
      image: null, // Don't set image for edit unless they change it
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      restaurantName: '',
      image: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-50">Manage Menu</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl flex items-center transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-500/40"
        >
          <FiPlus className="mr-2" /> Add Food Item
        </button>
      </div>

      <div className="glass-card overflow-hidden border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-300">
              <th className="py-4 px-6 font-medium">Item</th>
              <th className="py-4 px-6 font-medium">Category</th>
              <th className="py-4 px-6 font-medium">Price</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-4">
                    <img src={food.image} alt={food.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                    <span className="font-medium text-slate-200">{food.title}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-300">{food.category}</td>
                <td className="py-4 px-6 font-medium text-slate-200">${food.price.toFixed(2)}</td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button 
                    onClick={() => openEditModal(food)}
                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => handleDelete(food._id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card bg-slate-950 p-8 rounded-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-50">{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-300">Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-300">Description</label>
                  <textarea name="description" required rows="3" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Category</label>
                  <input type="text" name="category" required value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Price ($)</label>
                  <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-300">Restaurant Name</label>
                  <input type="text" name="restaurantName" required value={formData.restaurantName} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-slate-300">Image {editingId && '(Leave blank to keep current)'}</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} required={!editingId} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-500 hover:file:bg-orange-500/30 transition-all cursor-pointer" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-lg shadow-orange-600/20">
                  {loading ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFoods;
