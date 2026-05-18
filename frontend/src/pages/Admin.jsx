import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiLogOut, FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { useBusData } from '../context/BusContext';
import { API_BASE_URL } from '../apiConfig';

const Admin = () => {
  const { buses: activeBuses } = useBusData();
  
  // Dashboard State
  const [buses, setBuses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminBuses')) || []; } catch { return []; }
  });
  const [routes, setRoutes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminRoutes')) || []; } catch { return []; }
  }); 
  const [loading, setLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    busNumber: '', capacity: 40, type: 'AC', driverName: '', status: 'Active', routeId: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    setLoading(true);
    try {
      const resBuses = await axios.get(`${API_BASE_URL}/api/buses`);
      setBuses(resBuses.data);
      localStorage.setItem('adminBuses', JSON.stringify(resBuses.data));
      
      const resRoutes = await axios.get(`${API_BASE_URL}/api/buses/routes`);
      const uniqueRoutes = resRoutes.data;
      
      setRoutes(uniqueRoutes);
      localStorage.setItem('adminRoutes', JSON.stringify(uniqueRoutes));
      if (uniqueRoutes.length > 0) {
        setFormData(prev => ({ ...prev, routeId: prev.routeId || uniqueRoutes[0]._id }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setDashboardError('Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      busNumber: '', capacity: 40, type: 'AC', driverName: '', status: 'Active', 
      routeId: routes.length > 0 ? routes[0]._id : ''
    });
    setShowModal(true);
  };

  const openEditModal = (bus) => {
    setIsEditing(true);
    setEditingId(bus._id);
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      type: bus.type,
      driverName: bus.driverName || '',
      status: bus.status || 'Active',
      routeId: bus.route ? bus.route._id : (routes.length > 0 ? routes[0]._id : '')
    });
    setShowModal(true);
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = { ...formData };
      if (!payload.routeId) {
        delete payload.routeId;
      }

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/buses/${editingId}`, payload, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/buses`, payload, config);
      }
      
      setShowModal(false);
      fetchDashboardData(token);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save bus. Ensure data is valid.');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to permanently delete this bus?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/buses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBuses(buses.filter(bus => bus._id !== id));
      } catch (err) {
        alert('Failed to delete bus. Admin token may be expired.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4 md:p-8 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 drop-shadow-sm">
            Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiLogOut /> <span className="font-medium">Logout</span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold text-white/90 flex items-center gap-2">
              Fleet Management
              {loading && <FiRefreshCw className="animate-spin text-sm text-blue-300" />}
            </h3>
            <button 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5" 
              onClick={openAddModal}
            >
              <FiPlus className="text-xl" /> Add New Bus
            </button>
          </div>
          
          {dashboardError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-md">
              {dashboardError}
            </div>
          )}
          
          {loading && buses.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-blue-200">
                    <th className="p-4 font-semibold">Bus Number</th>
                    <th className="p-4 font-semibold">Route</th>
                    <th className="p-4 font-semibold">Type / Capacity</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {buses.map((bus) => (
                    <tr key={bus._id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="p-4 font-bold text-white">{bus.busNumber}</td>
                      <td className="p-4">
                        <div className="font-medium text-white/90">{bus.route ? bus.route.routeName : 'Unassigned'}</div>
                        {bus.route && bus.route.stops && bus.route.stops.length > 0 && (
                          <div className="text-xs text-white/50 mt-1 line-clamp-1 max-w-[200px]">
                            Stops: {bus.route.stops.map(s => s.stopName || s).join(' • ')}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-white/80">{bus.type} <span className="opacity-50">•</span> {bus.capacity} seats</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block shadow-sm ${
                          bus.status === 'Active' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {bus.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button 
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition-colors border border-blue-500/30" 
                            onClick={() => openEditModal(bus)} 
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors border border-red-500/30"
                            onClick={() => handleDelete(bus._id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-white/50">
                        No buses found in the database. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* CRUD Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_15px_50px_rgba(0,0,0,0.5)] overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              >
                {/* Decorative glowing orbs inside modal */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[80px] pointer-events-none z-[-1]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[80px] pointer-events-none z-[-1]"></div>

                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30 shadow-inner">
                      <FiEdit2 className="text-blue-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                      {isEditing ? 'Edit Bus Details' : 'Add New Bus'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500/80 hover:border-rose-400 text-slate-300 hover:text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 shadow-lg group z-50"
                    title="Close"
                  >
                    <FiX size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveBus} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Bus Number</label>
                    <input 
                      type="text" 
                      value={formData.busNumber} 
                      onChange={e => setFormData({...formData, busNumber: e.target.value})} 
                      required 
                      placeholder="e.g. PB-10-1234" 
                      className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm md:text-base"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Capacity</label>
                      <input 
                        type="number" 
                        value={formData.capacity} 
                        onChange={e => setFormData({...formData, capacity: e.target.value})} 
                        required 
                        min="10" 
                        max="100" 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm md:text-base"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Type</label>
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value})} 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm md:text-base appearance-none cursor-pointer"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                      >
                        <option value="AC" className="bg-slate-800">AC</option>
                        <option value="Non-AC" className="bg-slate-800">Non-AC</option>
                        <option value="Sleeper" className="bg-slate-800">Sleeper</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Driver Name</label>
                    <input 
                      type="text" 
                      value={formData.driverName} 
                      onChange={e => setFormData({...formData, driverName: e.target.value})} 
                      placeholder="Optional" 
                      className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})} 
                      className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm md:text-base appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                      <option value="Active" className="bg-slate-800">Active</option>
                      <option value="Maintenance" className="bg-slate-800">Maintenance</option>
                      <option value="Out of Service" className="bg-slate-800">Out of Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Assign Route</label>
                    <select 
                      value={formData.routeId} 
                      onChange={e => setFormData({...formData, routeId: e.target.value})} 
                      className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm md:text-base appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                      <option value="" disabled className="bg-slate-800">Select a route</option>
                      {routes.map(r => (
                        <option key={r._id} value={r._id} className="bg-slate-800">{r.routeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/10">
                    <button 
                      type="submit" 
                      className="w-full flex justify-center items-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02] active:scale-95"
                    >
                      <FiCheck size={22} /> {isEditing ? 'Update Bus' : 'Save Bus'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
