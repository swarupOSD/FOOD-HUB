import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiMail, FiFileText, FiShield, FiHeart, FiClock, FiStar, FiMapPin, FiSend } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 shadow-[0_0_40px_rgba(249,115,22,0.15)] rounded-[2rem] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-600/20 to-pink-600/20 p-6 border-b border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full backdrop-blur-md"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                  <Icon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                  {title}
                </h2>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const footerLinks = [
    { id: 'about', label: 'About Us', icon: FiInfo },
    { id: 'contact', label: 'Contact', icon: FiMail },
    { id: 'terms', label: 'Terms of Service', icon: FiFileText },
    { id: 'privacy', label: 'Privacy Policy', icon: FiShield }
  ];

  return (
    <>
      <footer className="relative bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pt-12 pb-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            
            <div className="text-center md:text-left">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 tracking-tight drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                FOOD HUB
              </span>
              <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto md:mx-0 font-medium">
                Delivering happiness to your door with premium speed and quality.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {footerLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => setActiveModal(link.id)}
                  whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(249,115,22,0.8)" }}
                  whileTap={{ scale: 0.95 }}
                  className="text-slate-300 hover:text-orange-400 font-medium transition-colors duration-300 text-sm sm:text-base flex items-center gap-2"
                >
                  <link.icon size={16} className="opacity-70" />
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} FOOD HUB. All rights reserved.
            </p>
            <div className="flex gap-2">
              {['Facebook', 'Twitter', 'Instagram'].map(social => (
                <div key={social} className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 text-xs cursor-pointer hover:bg-orange-500/20 hover:text-orange-400 transition-colors">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title="About FOOD HUB" icon={FiInfo}>
        <div className="space-y-6">
          <p className="text-lg text-slate-200 font-medium">
            We are more than just a food delivery platform. We are your premium culinary companion.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl text-center hover:bg-slate-800/80 transition-colors">
              <FiClock className="mx-auto text-orange-500 mb-3" size={28} />
              <h4 className="text-white font-bold mb-1">Fast Delivery</h4>
              <p className="text-xs text-slate-400">Under 30 mins guarantee</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl text-center hover:bg-slate-800/80 transition-colors">
              <FiStar className="mx-auto text-pink-500 mb-3" size={28} />
              <h4 className="text-white font-bold mb-1">Fresh Food</h4>
              <p className="text-xs text-slate-400">Quality checked daily</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl text-center hover:bg-slate-800/80 transition-colors">
              <FiHeart className="mx-auto text-red-500 mb-3" size={28} />
              <h4 className="text-white font-bold mb-1">Best Experience</h4>
              <p className="text-xs text-slate-400">Premium customer care</p>
            </div>
          </div>
          <p className="text-sm mt-6 border-t border-slate-800 pt-6">
            FOOD HUB was built to bridge the gap between incredible local restaurants and food lovers who demand excellence, speed, and reliability.
          </p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'contact'} onClose={() => setActiveModal(null)} title="Contact Us" icon={FiMail}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-2">Get in touch</h3>
            <p className="text-sm text-slate-400">
              We'd love to hear from you! Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
            </p>
            
            <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl flex items-center gap-4">
              <div className="bg-orange-500/20 p-3 rounded-full text-orange-500">
                <FiMail size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Email Support</p>
                <a href="mailto:snehashisroy106@gmail.com" className="text-white font-bold hover:text-orange-400 transition-colors">
                  snehashisroy106@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="text-white font-bold mb-4 relative z-10">Send a Message</h4>
            <div className="space-y-3 relative z-10">
              <input type="text" placeholder="Your Name" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 text-white transition-colors" />
              <textarea placeholder="How can we help?" rows="3" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 text-white transition-colors resize-none"></textarea>
              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl py-2.5 flex justify-center items-center gap-2 transition-colors">
                <FiSend size={16} /> Send Request
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms of Service" icon={FiFileText}>
        <div className="space-y-6 text-sm">
          <p className="text-slate-300">Last updated: May 2026</p>
          
          <div className="space-y-2">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs">1</span>
              Acceptance of Terms
            </h4>
            <p className="pl-8 text-slate-400">By accessing and using FOOD HUB, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs">2</span>
              User Accounts
            </h4>
            <p className="pl-8 text-slate-400">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs">3</span>
              Orders and Payments
            </h4>
            <ul className="pl-12 list-disc text-slate-400 space-y-1">
              <li>All orders are subject to availability.</li>
              <li>Prices are subject to change without notice.</li>
              <li>We reserve the right to refuse or cancel any order.</li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy" icon={FiShield}>
        <div className="space-y-6 text-sm">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex gap-4 items-start">
            <FiShield className="text-emerald-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-emerald-400 font-bold mb-1">Your Data is Secure</h4>
              <p className="text-emerald-500/70 text-xs">We utilize industry-standard encryption protocols to protect your personal information.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base border-b border-slate-800 pb-2">Information We Collect</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-400">
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                <span className="text-white font-medium block mb-1">Personal Details</span>
                Name, email address, and profile information.
              </div>
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                <span className="text-white font-medium block mb-1">Location Data</span>
                Delivery addresses for precise order routing.
              </div>
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                <span className="text-white font-medium block mb-1">Order History</span>
                Previous orders to provide better recommendations.
              </div>
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                <span className="text-white font-medium block mb-1">Payment Data</span>
                Securely encrypted transaction records.
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <h4 className="text-white font-bold text-base border-b border-slate-800 pb-2">How We Use Your Data</h4>
            <p className="text-slate-400">We use the collected data exclusively to provide and improve the FoodHub Service, process your orders, and communicate with you about important updates.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
