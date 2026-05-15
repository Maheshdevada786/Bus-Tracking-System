import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiLogOut, FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { useBusData } from '../context/BusContext';
import { API_BASE_URL } from '../apiConfig';

const Admin = () => {
  const { buses: activeBuses } = useBusData();
  
  // Dashboard State
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]); 
  const [loading, setLoading] = useState(true);
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
      
      const resRoutes = await axios.get(`${API_BASE_URL}/api/buses/routes`);
      const uniqueRoutes = resRoutes.data;
      
      setRoutes(uniqueRoutes);
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
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5" 
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
          
          {loading ? (
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
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? 'Edit Bus Details' : 'Add New Bus'}
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveBus} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Bus Number</label>
                    <input 
                      type="text" 
                      value={formData.busNumber} 
                      onChange={e => setFormData({...formData, busNumber: e.target.value})} 
                      required 
                      placeholder="e.g. PB-10-1234" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-blue-200 mb-1">Capacity</label>
                      <input 
                        type="number" 
                        value={formData.capacity} 
                        onChange={e => setFormData({...formData, capacity: e.target.value})} 
                        required 
                        min="10" 
                        max="100" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-blue-200 mb-1">Type</label>
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value})} 
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Sleeper">Sleeper</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Driver Name</label>
                    <input 
                      type="text" 
                      value={formData.driverName} 
                      onChange={e => setFormData({...formData, driverName: e.target.value})} 
                      placeholder="Optional" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})} 
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Assign Route</label>
                    <select 
                      value={formData.routeId} 
                      onChange={e => setFormData({...formData, routeId: e.target.value})} 
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="" disabled>Select a route</option>
                      {routes.map(r => (
                        <option key={r._id} value={r._id}>{r.routeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/10">
                    <button 
                      type="submit" 
                      className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/50"
                    >
                      <FiCheck /> {isEditing ? 'Update Bus' : 'Save Bus'}
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
