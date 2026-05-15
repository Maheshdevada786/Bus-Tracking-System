import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiEdit, FiPhone, FiMail, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEditData({ name: res.data.name || '', email: res.data.email || '', phone: res.data.phone || '' });
        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload(); 
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, name: res.data.name, email: res.data.email, phone: res.data.phone });
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-center -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-700 overflow-hidden flex items-center justify-center shadow-lg">
              {user.profilePicture && user.profilePicture !== 'https://cdn-icons-png.flaticon.com/512/149/149071.png' ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-5xl text-slate-300" />
              )}
            </div>
          </div>
          
          <div className="text-center mb-8">
            {message && <div className="mb-4 text-emerald-400 bg-emerald-400/10 py-2 px-4 rounded-lg text-sm inline-flex items-center"><FiCheck className="mr-2" />{message}</div>}
            {error && <div className="mb-4 text-rose-400 bg-rose-400/10 py-2 px-4 rounded-lg text-sm inline-block">{error}</div>}

            {!isEditing ? (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-slate-300 text-sm">
                  <span className="flex items-center gap-1.5"><FiMail /> {user.email}</span>
                  {user.phone && <span className="flex items-center gap-1.5"><FiPhone /> {user.phone}</span>}
                </div>
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Account Type</p>
                    <p className="text-white capitalize font-medium text-lg">{user.role} Account</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Account Created</p>
                    <p className="text-white font-medium text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Recent Login</p>
                    <p className="text-white font-medium text-lg">{user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : 'Just now'}</p>
                  </div>
                  {user.provider !== 'local' && (
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Login Provider</p>
                      <p className="text-white capitalize font-medium text-lg">{user.provider}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 transition-all font-medium"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                  <Link 
                    to="/reminders" 
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/50 hover:bg-slate-500/30 transition-all font-medium"
                  >
                    <FiSettings /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 transition-all font-medium"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className="text-left bg-black/20 p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white p-2 transition-colors">
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editData.name} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      required 
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editData.email} 
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      required 
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={editData.phone} 
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  {user.provider === 'local' && (
                    <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Change Password</h3>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Current Password (Optional)</label>
                        <input 
                          type="password" 
                          value={editData.oldPassword || ''} 
                          onChange={(e) => setEditData({...editData, oldPassword: e.target.value})}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">New Password (Optional)</label>
                        <input 
                          type="password" 
                          value={editData.newPassword || ''} 
                          onChange={(e) => setEditData({...editData, newPassword: e.target.value})}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
