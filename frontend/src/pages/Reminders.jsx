import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMessageCircle, FiSmartphone, FiBell, FiAlertTriangle, FiTrash2, FiSave, FiUser } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Reminders = () => {
  const [channels, setChannels] = useState({
    email: 'user@example.com',
    whatsapp: '+91 9876543210',
    sms: '+91 9876543210'
  });

  const [toggles, setToggles] = useState({
    emailUpdates: true,
    whatsappUpdates: false,
    smsAlerts: true,
    pushNotifications: true,
    emergencyAlerts: true
  });

  const [activeAlerts, setActiveAlerts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.preferences) {
          const { notifications, channels: userChannels } = res.data.preferences;
          if (notifications) setToggles(notifications);
          if (userChannels) setChannels(prev => ({ ...prev, ...userChannels }));
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      }
    };

    const fetchAlerts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/alerts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Map database alert object to UI format
        const formattedAlerts = res.data.map(alert => ({
          id: alert._id,
          bus: alert.busNumber || 'N/A',
          route: alert.route || 'General',
          type: 'Smart Alert',
          status: 'Active',
          methods: [
            alert.emailAlerts && 'Email',
            alert.whatsappAlerts && 'WhatsApp',
            alert.smsAlerts && 'SMS'
          ].filter(Boolean)
        }));
        
        setActiveAlerts(formattedAlerts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setLoading(false);
      }
    };

    fetchPreferences();
    fetchAlerts();
  }, []);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const removeAlert = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  const handleSavePreferences = async () => {
    setSaveLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        preferences: {
          notifications: toggles,
          channels: {
            whatsapp: channels.whatsapp,
            sms: channels.sms
          }
        }
      };
      
      await axios.put(`${API_BASE_URL}/api/auth/preferences`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save preferences.');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative p-6 pt-24 pb-20 bg-slate-900 overflow-hidden text-slate-200 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8"
      >
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center gap-3 m-0">
            <FiBell className="text-blue-400" /> Alert & Notification Dashboard
          </h1>
          <p className="text-slate-300 text-lg mt-2">Manage your real-time tracking alerts and notification preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="lg:col-span-7 flex flex-col backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">Notification Channels</h2>
            
            <div className="flex flex-col gap-4 mb-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiUser />
                </div>
                <input 
                  type="email" 
                  value={channels.email} 
                  onChange={(e) => setChannels({...channels, email: e.target.value})} 
                  placeholder="Email Address" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiMessageCircle />
                </div>
                <input 
                  type="tel" 
                  value={channels.whatsapp} 
                  onChange={(e) => setChannels({...channels, whatsapp: e.target.value})} 
                  placeholder="WhatsApp Number" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiSmartphone />
                </div>
                <input 
                  type="tel" 
                  value={channels.sms} 
                  onChange={(e) => setChannels({...channels, sms: e.target.value})} 
                  placeholder="SMS Number" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
            <div className="flex flex-col gap-4 mb-8">
              
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">Email Notifications</h3>
                  <p className="text-sm text-slate-400">Receive ETA updates and route changes.</p>
                </div>
                <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${toggles.emailUpdates ? 'bg-emerald-500' : 'bg-slate-700'}`} onClick={() => handleToggle('emailUpdates')}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${toggles.emailUpdates ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">WhatsApp Updates</h3>
                  <p className="text-sm text-slate-400">Receive live tracking links instantly.</p>
                </div>
                <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${toggles.whatsappUpdates ? 'bg-emerald-500' : 'bg-slate-700'}`} onClick={() => handleToggle('whatsappUpdates')}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${toggles.whatsappUpdates ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">SMS Alerts</h3>
                  <p className="text-sm text-slate-400">Get text messages for delays.</p>
                </div>
                <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${toggles.smsAlerts ? 'bg-emerald-500' : 'bg-slate-700'}`} onClick={() => handleToggle('smsAlerts')}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${toggles.smsAlerts ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">Push Notifications</h3>
                  <p className="text-sm text-slate-400">Realtime bus movement updates.</p>
                </div>
                <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${toggles.pushNotifications ? 'bg-emerald-500' : 'bg-slate-700'}`} onClick={() => handleToggle('pushNotifications')}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${toggles.pushNotifications ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-rose-300">Emergency Alerts</h3>
                  <p className="text-sm text-rose-400/80">Receive urgent transport notifications.</p>
                </div>
                <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${toggles.emergencyAlerts ? 'bg-rose-500' : 'bg-slate-700'}`} onClick={() => handleToggle('emergencyAlerts')}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${toggles.emergencyAlerts ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
              </div>

            </div>

            {message && <div className={`text-center font-bold mb-4 ${message.includes('success') ? 'text-emerald-400' : 'text-rose-400'}`}>{message}</div>}

            <button 
              className="mt-auto w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
              onClick={handleSavePreferences}
              disabled={saveLoading}
            >
              <FiSave size={20} /> 
              {saveLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-5 flex flex-col backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] h-fit">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Active Bus Alerts</h2>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live
              </span>
            </div>

            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {activeAlerts.map(alert => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={alert.id} 
                  className={`flex flex-col p-5 rounded-2xl border shadow-lg ${alert.status === 'Critical' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-black/20 border-white/10 hover:bg-white/5 transition-colors'}`}
                >
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-white/5">
                    <div>
                      <h3 className="text-lg font-bold text-white m-0">{alert.bus}</h3>
                      <p className="text-sm text-slate-400 m-0">{alert.route}</p>
                    </div>
                    <button className="text-slate-500 hover:text-rose-400 transition-colors p-1" onClick={() => removeAlert(alert.id)}>
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                      <FiAlertTriangle className={alert.status === 'Critical' ? 'text-rose-400' : 'text-amber-400'} /> {alert.type}
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${alert.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {alert.status}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 bg-white/5 p-2 rounded-xl">
                    <span className="mr-1">Notified via:</span>
                    <div className="flex gap-2">
                      {alert.methods.map(m => (
                        <span key={m} className="px-2 py-1 bg-white/10 text-slate-300 rounded-md text-xs font-medium border border-white/5">{m}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {activeAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-slate-500 text-center bg-black/20 rounded-2xl border border-white/5">
                  <FiBell size={40} className="mb-4 opacity-50" />
                  <p className="text-lg">No active alerts at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reminders;
