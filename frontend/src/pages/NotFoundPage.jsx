import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartCrack } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center text-romantic-500">
          <HeartCrack size={80} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Proposal Not Found 💔
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We couldn't find this love story. The link might be broken or the proposal no longer exists.
        </p>
        <Link
          to="/"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-romantic-500 to-romantic-600 text-white font-semibold hover:from-romantic-400 hover:to-romantic-500 transition-all inline-block"
        >
          Create Your Own
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
