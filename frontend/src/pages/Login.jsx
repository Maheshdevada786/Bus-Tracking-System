import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { API_BASE_URL } from '../apiConfig';
import { useGoogleLogin } from '@react-oauth/google';
import './Auth.css';

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
      setSuccess('Successfully login');
      
      // Delay navigation to show success message
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
    <div className="auth-container">
      {/* Floating particles background */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue to Bus Track</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-error" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #34d399' }}>{success}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>User Name / Email Address</label>
            <input 
              type="text" 
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your username or email" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password" 
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="oauth-separator">
          <span>Or Log in with</span>
        </div>
        <div className="oauth-buttons">
          <button type="button" className="oauth-btn google-btn" onClick={() => handleOAuthLogin('Google')}>
            <FcGoogle size={20} /> Google
          </button>
          <button type="button" className="oauth-btn github-btn" onClick={() => handleOAuthLogin('GitHub')}>
            <FaGithub size={20} /> GitHub
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
