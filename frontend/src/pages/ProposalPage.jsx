import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import FloatingHearts from '../components/FloatingHearts';
import CanvasBackground from '../components/CanvasBackground';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TypewriterText = ({ text }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
        hidden: {}
      }}
      className="text-2xl md:text-4xl leading-relaxed text-center font-light px-6 max-w-4xl"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Section = ({ children, className = "" }) => (
  <section className={`min-h-screen w-full flex flex-col items-center justify-center snap-center snap-always relative z-10 overflow-hidden ${className}`}>
    {children}
  </section>
);

const ProposalPage = () => {
  const { username, proposalId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Interactive NO button states
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isNoVisible, setIsNoVisible] = useState(true);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const funnyMessages = ["Nice Try 😂", "Think Again ❤️", "You almost clicked me 😆", "No escaping love 😜", "Try YES instead ❤️"];
  
  const [accepted, setAccepted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "proposals", proposalId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const proposalData = docSnap.data();
          // Verify username matches for a little extra security
          if (proposalData.username !== username && proposalData.username !== 'demo') {
            navigate('/404');
            return;
          }
          setData(proposalData);
          if (!proposalData.password) {
            setIsUnlocked(true); // Unlock automatically if no password exists (e.g. legacy data)
          }
        } else {
          // If it's the demo link, provide dummy data
          if (proposalId === 'demo-id') {
            setData({
              crushName: "Beautiful",
              username: "Your Secret Admirer",
              message: "I've been thinking about this moment for a long time. Every time I see you, my heart skips a beat. You are the most amazing person I've ever met.",
              slogan: "Forever Starts Today ❤️",
              image: null
            });
            setIsUnlocked(true);
          } else {
            navigate('/404');
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [username, proposalId, navigate]);

  const handleNoHover = () => {
    if (accepted || !isNoVisible) return;
    
    // Make it disappear instantly
    setIsNoVisible(false);
    
    setTimeout(() => {
      // Reappear in a random place on the screen (fixed position)
      setNoPosition({ 
        position: 'fixed',
        top: Math.random() * 80 + 10 + '%',
        left: Math.random() * 80 + 10 + '%',
        x: '-50%',
        y: '-50%'
      });
      
      setIsNoVisible(true);
      setNoHoverCount(prev => prev + 1);
      
      if (noHoverCount % 2 === 0) {
        toast(funnyMessages[Math.floor(Math.random() * funnyMessages.length)], {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark",
          style: {
            background: "rgba(236, 72, 153, 0.2)",
            border: "1px solid rgba(236, 72, 153, 0.5)",
            backdropFilter: "blur(10px)",
            color: "#fbcfe8",
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "1rem"
          }
        });
      }
    }, 150);
  };

  const handleYesClick = () => {
    setAccepted(true);
    
    // Confetti effect
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f472b6', '#db2777', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f472b6', '#db2777', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Start countdown for WhatsApp
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        // Phone number can be configurable or asked in the form. Using a dummy/blank for now.
        const phone = ""; 
        const msg = encodeURIComponent(`Hi ${data.username}, I accept your proposal! ❤️`);
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-romantic-500 bg-dark-bg">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Heart size={60} className="fill-romantic-500" />
        </motion.div>
      </div>
    );
  }

  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputPassword === data?.password) {
      setIsUnlocked(true);
    } else {
      setPasswordError("Incorrect password 💔");
      setTimeout(() => setPasswordError(""), 2000);
    }
  };

  if (data && !isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
        <FloatingHearts />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 w-full max-w-sm">
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center shadow-[0_0_30px_rgba(236,72,153,0.15)]">
            <Heart className="mx-auto text-romantic-500 fill-romantic-500 mb-6" size={48} />
            <h2 className="text-2xl font-bold text-white mb-2">Protected Proposal</h2>
            <p className="text-gray-300 mb-6 text-sm">Enter the secret password to unlock this message</p>
            
            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:outline-none focus:border-romantic-500 transition-colors"
              />
              {passwordError && <p className="text-romantic-500 text-sm font-medium">{passwordError}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-romantic-500 to-romantic-600 text-white font-bold hover:from-romantic-400 hover:to-romantic-500 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                Unlock ❤️
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-bg text-center">
        <FloatingHearts />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="z-10"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-glow">
            Yay ❤️
          </h1>
          <p className="text-2xl text-romantic-200 mb-8">
            May your love story last forever.
          </p>
          
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl inline-block border border-white/20">
            <p className="text-lg text-white mb-2">Redirecting to WhatsApp in...</p>
            <p className="text-4xl font-bold text-romantic-400">{countdown}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-dark-bg scroll-smooth hide-scrollbar relative"
    >
      <ToastContainer limit={1} />
      <CanvasBackground scrollerRef={containerRef} />
      <FloatingHearts />
      
      {/* Section 1: Hello */}
      <Section>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-5xl md:text-8xl font-light text-white tracking-widest"
        >
          Hello...
        </motion.h1>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 text-white/50 flex flex-col items-center"
        >
          <span className="text-sm uppercase tracking-widest mb-2">Scroll Down</span>
          <ChevronDown size={24} />
        </motion.div>
      </Section>

      {/* Section 2 */}
      <Section>
        <motion.p
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-3xl md:text-5xl text-center text-gray-300 font-light px-4 max-w-3xl leading-relaxed"
        >
          There is something someone wants to tell you...
        </motion.p>
      </Section>

      {/* Section 3: Dear Crush */}
      <Section>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-romantic-200 to-romantic-400 text-center px-4"
        >
          Dear {data.crushName}
        </motion.h2>
      </Section>

      {/* Section 4 */}
      <Section>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, type: "spring" }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-3xl md:text-5xl text-center text-white px-4"
        >
          <span className="font-bold text-romantic-500">{data.username}</span> wants to tell you something...
        </motion.p>
      </Section>

      {/* Section 5: Message */}
      <Section>
        <div className="bg-black/20 p-8 md:p-16 rounded-3xl backdrop-blur-sm border border-white/5 mx-4 max-w-4xl">
          <TypewriterText text={data.message} />
        </div>
      </Section>

      {/* Section 6: Image */}
      <Section>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring" }}
          viewport={{ once: false, margin: "-100px" }}
          className="relative p-4 md:p-8 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(236,72,153,0.15)]"
        >
          {data.image ? (
            <img 
              src={data.image} 
              alt="Crush" 
              className="w-[280px] h-[350px] md:w-[400px] md:h-[500px] object-cover rounded-[2rem] shadow-xl"
            />
          ) : (
            <div className="w-[280px] h-[350px] md:w-[400px] md:h-[500px] flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-romantic-900/50 to-dark-bg">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Heart size={120} className="text-romantic-500 fill-romantic-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
              </motion.div>
            </div>
          )}
        </motion.div>
      </Section>

      {/* Section 7: Slogan */}
      <Section>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="text-6xl md:text-9xl font-bold text-center px-4 leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-romantic-300 text-glow">
            {data.slogan}
          </span>
        </motion.h2>
      </Section>

      {/* Section 8: Final Question */}
      <Section className="bg-gradient-to-t from-romantic-950/40 to-transparent">
        <div className="z-10 text-center px-4 relative w-full h-full flex flex-col items-center justify-center">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-6xl md:text-8xl font-bold text-white mb-16 text-glow"
          >
            Will You Be Mine?
          </motion.h1>

          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center relative w-full max-w-md h-[200px]">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleYesClick}
              className="px-12 py-5 rounded-full bg-gradient-to-r from-romantic-500 to-romantic-600 text-white font-bold text-2xl shadow-[0_0_30px_rgba(236,72,153,0.6)] absolute sm:relative sm:left-0 z-20 left-[50%] top-[20px] sm:top-0 -translate-x-[50%] sm:translate-x-0"
            >
              YES ❤️
            </motion.button>

            <motion.button
              animate={{ 
                x: noPosition.x, 
                y: noPosition.y,
                opacity: isNoVisible ? 1 : 0,
                scale: isNoVisible ? 1 : 0
              }}
              style={noPosition.position ? { position: noPosition.position, top: noPosition.top, left: noPosition.left } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onHoverStart={handleNoHover}
              onClick={handleNoHover}
              className="px-12 py-5 rounded-full bg-gray-800 text-white font-bold text-2xl absolute sm:relative z-50 top-[100px] sm:top-0 left-[50%] sm:left-0 -translate-x-[50%] sm:translate-x-0 border border-gray-600"
            >
              NO 💔
            </motion.button>


          </div>
        </div>
      </Section>
    </div>
  );
};

export default ProposalPage;
