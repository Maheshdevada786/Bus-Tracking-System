import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiUser, FiLock } from 'react-icons/fi';
import { API_BASE_URL } from '../apiConfig';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setLoading(false);
      setSuccess('Successfully logged in!');
      
      setTimeout(() => {
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  const googleLogin = useGoogleLogin({
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
        setSuccess('Successfully logged in with Google');
        
        setTimeout(() => {
          if (res.data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);
      } catch (err) {
        setLoading(false);
        setError('Google Login failed');
      }
    },
    onError: () => {
      setError('Google Login was cancelled or failed');
    }
  });

  const handleOAuthLogin = (provider) => {
    if (provider === 'Google') {
      googleLogin();
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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">Welcome Back</h1>
          <p className="text-slate-300">Sign in to track your buses</p>
        </div>
        
        {error && <div className="mb-6 bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
        {success && <div className="mb-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-sm text-center">{success}</div>}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email or Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiUser />
              </div>
              <input 
                type="text" 
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email or username" 
                required 
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiLock />
              </div>
              <input 
                type="password" 
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password" 
                required 
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute border-t border-white/10 w-full"></div>
          <span className="relative bg-transparent px-4 text-sm text-slate-400 backdrop-blur-md">Or continue with</span>
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
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
