import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, Loader2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import FloatingHearts from '../components/FloatingHearts';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const QuestionsPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('proposal_username') || 'Anonymous';
  const password = localStorage.getItem('proposal_password') || '';
  
  const [formData, setFormData] = useState({
    crushName: '',
    message: '',
    slogan: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('proposal_username') || !localStorage.getItem('proposal_password')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app we'd upload to Firebase Storage, but for this demo we'll use Data URL
      // if it's small enough, or just skip it if we strictly need base64. 
      // For simplicity in this frontend only setup with Firebase DB, we'll store base64 string.
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const proposalId = generateId();
      const payload = {
        username,
        password,
        crushName: formData.crushName,
        message: formData.message,
        slogan: formData.slogan,
        image: formData.image, // Base64 string
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "proposals", proposalId), payload);
      navigate(`/proposal/${username}/${proposalId}`);
    } catch (error) {
      console.error("Error saving proposal: ", error);
      alert("Failed to save proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <FloatingHearts />
      
      <div className="z-10 w-full max-w-lg">
        <GlassCard>
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="text-romantic-500 fill-romantic-500" size={24} />
              Step {step} of 4
            </h2>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                    step >= i ? 'bg-romantic-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium text-white mb-2">
                    What is your crush's name?
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.crushName}
                    onChange={(e) => setFormData({ ...formData, crushName: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-romantic-500 text-lg"
                    placeholder="Enter their name"
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium text-white mb-2">
                    What do you want to say to them?
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-romantic-500 text-lg resize-none"
                    placeholder="Write a sweet message..."
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium text-white mb-2">
                    Your Slogan
                  </label>
                  <p className="text-sm text-gray-300 mb-4">E.g., "Forever Starts Today" or "You Are My Happiness"</p>
                  <input
                    type="text"
                    required
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-romantic-500 text-lg"
                    placeholder="Enter your slogan"
                  />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium text-white mb-2">
                    Upload a picture (Optional)
                  </label>
                  
                  <div className="mt-2 flex justify-center rounded-xl border border-dashed border-white/30 px-6 py-10 hover:border-romantic-500 transition-colors bg-black/20">
                    <div className="text-center">
                      {imagePreview ? (
                        <div className="mb-4 relative rounded-lg overflow-hidden w-40 h-40 mx-auto">
                          <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <Heart className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                      )}
                      <div className="mt-4 flex text-sm leading-6 justify-center">
                        <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-romantic-400 focus-within:outline-none hover:text-romantic-300">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-romantic-500 to-romantic-600 text-white font-semibold hover:from-romantic-400 hover:to-romantic-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {step === 4 ? 'Generate Proposal' : 'Next'}
                    {step < 4 && <ChevronRight size={20} />}
                  </>
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default QuestionsPage;
