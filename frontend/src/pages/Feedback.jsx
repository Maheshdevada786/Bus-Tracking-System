import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('General Feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        category,
        message: feedback
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center p-4 sm:p-6 bg-slate-900 overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] md:w-[40%] h-[50%] rounded-full bg-emerald-600/20 blur-[100px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] md:w-[40%] h-[50%] rounded-full bg-teal-600/20 blur-[100px] md:blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mt-10 md:mt-0"
      >
        <button 
          onClick={handleClose}
          className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 hover:text-white text-slate-300 flex items-center justify-center transition-all backdrop-blur-md border border-white/20 z-50 shadow-lg"
        >
          <FiX size={20} />
        </button>

        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border border-emerald-500/30 mb-4 md:mb-6 shadow-lg shadow-emerald-500/20">
            <FiMessageSquare className="text-3xl md:text-4xl text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2 md:mb-3">We Value Your Feedback</h1>
          <p className="text-slate-300 text-base md:text-lg px-4">Help us improve the PunjabBus Track experience.</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-2xl bg-white/10 border border-emerald-500/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
              <FiCheck className="text-3xl text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-emerald-200">Your feedback has been submitted successfully.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col gap-5 md:gap-6 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Feedback Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3.5 md:py-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer shadow-inner text-sm md:text-base"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                <option className="bg-slate-800 text-white">General Feedback</option>
                <option className="bg-slate-800 text-white">Report a Bug</option>
                <option className="bg-slate-800 text-white">Suggest a Feature</option>
                <option className="bg-slate-800 text-white">Bus Data Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Your Message</label>
              <textarea 
                placeholder="Tell us what's on your mind..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows="5"
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3.5 md:py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y shadow-inner text-sm md:text-base"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 md:py-4 px-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Feedback;
