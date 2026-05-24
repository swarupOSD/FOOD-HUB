import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px] animate-[pulse_5s_ease-in-out_infinite_alternate-reverse]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          {/* Rotating Spinner Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border-t-2 border-r-2 border-orange-500/50"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-30px] rounded-full border-b-2 border-l-2 border-pink-500/30"
          />
          
          {/* Logo Text */}
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
            <span className="text-4xl font-black text-white relative z-10 tracking-tighter">
              FH
            </span>
          </div>
        </motion.div>

        {/* Text Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-2"
        >
          FOOD HUB
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-slate-400 font-medium tracking-widest text-sm uppercase flex items-center gap-2"
        >
          Loading delicious food
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
