import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate some initial hearts
    const initialHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            opacity: 0,
            x: `${heart.x}vw`,
            y: '110vh',
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            y: '-10vh',
            x: `${heart.x + (Math.random() * 10 - 5)}vw`,
            scale: [0.5, 1, 0.8],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          className="absolute"
          style={{ width: heart.size, height: heart.size }}
        >
          <Heart 
            className="text-romantic-500/30 fill-romantic-500/20 drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]" 
            size={heart.size} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
