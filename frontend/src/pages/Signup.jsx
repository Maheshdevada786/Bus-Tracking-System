import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { API_BASE_URL } from '../apiConfig';
import { useGoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, phone });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setLoading(false);
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/oauth-callback`, {
          code: tokenResponse.code || tokenResponse.access_token,
          provider: 'google'
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        setLoading(false);
        setSuccess('Successfully signed up with Google');
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (err) {
        setLoading(false);
        setError('Google Signup failed');
      }
    },
    onError: () => {
      setError('Google Signup was cancelled or failed');
    }
  });

  const handleOAuthLogin = (provider) => {
    if (provider === 'Google') {
      googleSignup();
    } else {
      setLoading(true);
      setTimeout(() => {
        window.location.href = `/auth/callback?code=mock_${provider.toLowerCase()}_code&provider=${provider.toLowerCase()}`;
      }, 800);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] my-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">Create Account</h1>
          <p className="text-slate-300">Join Bus Track today</p>
        </div>
        
        {error && <div className="mb-6 bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
        {success && <div className="mb-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-sm text-center">{success}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiUser />
              </div>
              <input 
                type="text" 
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Full Name" 
                required 
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiMail />
              </div>
              <input 
                type="email" 
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address" 
                required 
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiPhone />
              </div>
              <input 
                type="tel" 
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="Phone Number (Optional)" 
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiLock />
              </div>
              <input 
                type="password" 
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create a password" 
                minLength="6"
                required 
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-purple-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute border-t border-white/10 w-full"></div>
          <span className="relative bg-transparent px-4 text-sm text-slate-400 backdrop-blur-md">Or sign up with</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => handleOAuthLogin('Google')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all"
          >
            <FcGoogle size={20} /> <span className="text-sm font-medium">Google</span>
          </button>
          <button 
            type="button" 
            onClick={() => handleOAuthLogin('GitHub')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all"
          >
            <FaGithub size={20} /> <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
