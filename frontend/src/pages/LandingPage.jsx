import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import FloatingHearts from '../components/FloatingHearts';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <FloatingHearts />
      
      <div className="z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
          <div className="p-4 bg-romantic-500/20 rounded-full bg-glow">
            <Heart size={48} className="text-romantic-400 fill-romantic-400" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-glow text-white"
        >
          Create Your Personalized <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-romantic-300 to-romantic-500">
            Proposal Story ❤️
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light"
        >
          Turn your feelings into a beautiful animated experience. Build a cinematic journey to say what's truly in your heart.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/login"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-romantic-500 to-romantic-600 text-white font-semibold text-lg hover:from-romantic-400 hover:to-romantic-500 transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] w-full sm:w-auto"
          >
            Create Proposal
          </Link>
          
          <Link
            to="/proposal/demo/demo-id"
            className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-all backdrop-blur-md w-full sm:w-auto"
          >
            View Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
