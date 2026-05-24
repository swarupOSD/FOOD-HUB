import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiMapPin, FiPhone, FiEdit3, FiCamera, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local mock state for user details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      const savedProfileStr = localStorage.getItem(`foodhub_profile_${user._id}`);
      if (savedProfileStr) {
        const savedProfile = JSON.parse(savedProfileStr);
        setFormData({
          name: savedProfile.name || user.name || '',
          email: user.email || '', // Email is non-editable in this flow
          phone: savedProfile.phone || user.phone || '',
          address: savedProfile.address || user.address || ''
        });
        if (savedProfile.profileImage) {
          setProfileImage(savedProfile.profileImage);
        }
      } else {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || ''
        });
      }
    }
  }, [user]);

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        toast.success("Profile picture updated! Don't forget to save.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API delay for mock presentation
    setTimeout(() => {
      const profileToSave = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profileImage: profileImage
      };
      localStorage.setItem(`foodhub_profile_${user._id}`, JSON.stringify(profileToSave));

      setIsSaving(false);
      setIsEditing(false);
      toast.success("Profile details saved successfully!", { icon: "✅" });
    }, 1200);
  };

  const handleCancel = () => {
    // Reset to original data (from localStorage if exists, else from context)
    const savedProfileStr = localStorage.getItem(`foodhub_profile_${user._id}`);
    if (savedProfileStr) {
      const savedProfile = JSON.parse(savedProfileStr);
      setFormData({
        name: savedProfile.name || user.name || '',
        email: user.email || '',
        phone: savedProfile.phone || user.phone || '',
        address: savedProfile.address || user.address || ''
      });
      if (savedProfile.profileImage) {
        setProfileImage(savedProfile.profileImage);
      } else {
        setProfileImage(null);
      }
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setProfileImage(null);
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6 md:mb-8 text-center text-slate-50">My Profile</h1>
      
      <div className="glass-card rounded-[2rem] overflow-hidden relative shadow-2xl border border-slate-800/80">
        <div className="h-32 md:h-48 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end relative -mt-16 md:-mt-20 gap-4 sm:gap-6 text-center sm:text-left">
          
          {/* Avatar Section */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-900 border-4 border-slate-900 flex items-center justify-center overflow-hidden shadow-2xl relative z-10">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl md:text-6xl font-bold text-orange-500 bg-gradient-to-br from-slate-800 to-slate-900 w-full h-full flex items-center justify-center">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-2 right-2 z-20"
                >
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 hover:bg-orange-500 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-transform hover:scale-110 active:scale-95"
                    title="Change Profile Picture"
                  >
                    <FiCamera size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Header Info */}
          <div className="flex-grow flex flex-col sm:flex-row justify-between items-center sm:items-end w-full sm:pb-2">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tight">{formData.name}</h2>
              <p className="text-orange-500 font-medium md:text-lg mt-1 tracking-wide">{user.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
            </div>
            
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-orange-400 px-5 md:px-6 py-2.5 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
              >
                <FiEdit3 /> Edit Profile
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Profile Details Grid */}
        <div className="px-6 md:px-10 pb-10 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Email (Read Only usually, but let's make it look consistent) */}
            <div className={`p-6 rounded-2xl flex items-start space-x-4 border transition-all duration-300 ${isEditing ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500 shadow-inner">
                <FiMail size={24} />
              </div>
              <div className="flex-grow w-full">
                <p className="text-sm text-slate-400 font-medium mb-1">Email Address</p>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="w-full bg-transparent text-lg text-slate-400 font-semibold focus:outline-none cursor-not-allowed" 
                />
              </div>
            </div>
            
            {/* Name Field */}
            <div className={`p-6 rounded-2xl flex items-start space-x-4 border transition-all duration-300 ${isEditing ? 'bg-slate-900/80 border-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500 shadow-inner">
                <FiUser size={24} />
              </div>
              <div className="flex-grow w-full">
                <p className="text-sm text-slate-400 font-medium mb-1">Full Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" 
                  />
                ) : (
                  <p className="font-semibold text-lg text-slate-200">{formData.name}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className={`p-6 rounded-2xl flex items-start space-x-4 border transition-all duration-300 ${isEditing ? 'bg-slate-900/80 border-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500 shadow-inner">
                <FiPhone size={24} />
              </div>
              <div className="flex-grow w-full">
                <p className="text-sm text-slate-400 font-medium mb-1">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" 
                  />
                ) : (
                  <p className="font-semibold text-lg text-slate-200">{formData.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className={`p-6 rounded-2xl flex items-start space-x-4 border md:col-span-2 transition-all duration-300 ${isEditing ? 'bg-slate-900/80 border-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500 shadow-inner mt-1">
                <FiMapPin size={24} />
              </div>
              <div className="flex-grow w-full">
                <p className="text-sm text-slate-400 font-medium mb-1">Delivery Address</p>
                {isEditing ? (
                  <textarea 
                    name="address"
                    rows="3"
                    placeholder="Enter your full delivery address"
                    value={formData.address} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none" 
                  ></textarea>
                ) : (
                  <p className="font-semibold text-lg text-slate-200 leading-relaxed">{formData.address || 'No address provided yet. Add an address for faster checkout.'}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 flex justify-end gap-4 border-t border-slate-800 pt-6"
              >
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} /> Save Changes
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default Profile;
