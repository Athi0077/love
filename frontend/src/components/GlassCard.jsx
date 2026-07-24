import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`glass-card p-8 md:p-10 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
