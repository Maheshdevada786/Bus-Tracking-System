import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMapPin, FiSearch, FiClock, FiActivity, FiMap } from 'react-icons/fi';
import { FaBusAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useBusData } from '../context/BusContext';
import { API_BASE_URL } from '../apiConfig';

const BusPage = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [locations, setLocations] = useState([]);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();
  
  const { buses: globalBuses } = useBusData();

  useEffect(() => {
    // Fetch unique locations for auto-suggestions
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/buses/routes/locations`);              
        setLocations(res.data);
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    };
    fetchLocations();
  }, []);

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    setHasSearched(false);
    if (value.length > 0) {
      setSourceSuggestions(locations.filter(loc => loc.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSourceSuggestions([]);
    }
  };

  const handleDestChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setHasSearched(false);
    if (value.length > 0) {
      setDestSuggestions(locations.filter(loc => loc.toLowerCase().includes(value.toLowerCase())));
    } else {
      setDestSuggestions([]);
    }
  };

  const selectSource = (loc) => {
    setSource(loc);
    setSourceSuggestions([]);
    setHasSearched(false);
  };

  const selectDest = (loc) => {
    setDestination(loc);
    setDestSuggestions([]);
    setHasSearched(false);
  };

  const executeSearch = () => {
    setLoading(true);
    setError('');
    
    // Filter from global context buses
    const matches = globalBuses.filter(bus => {
      const stops = bus.route?.stops || [];
      const sMatch = source ? stops.some(st => st.toLowerCase().includes(source.toLowerCase())) : true;
      const dMatch = destination ? stops.some(st => st.toLowerCase().includes(destination.toLowerCase())) : true;
      
      // If both source and dest exist, verify source comes before dest
      if (source && destination && sMatch && dMatch) {
         const sIdx = stops.findIndex(st => st.toLowerCase().includes(source.toLowerCase()));
         const dIdx = stops.findIndex(st => st.toLowerCase().includes(destination.toLowerCase()));
         if (sIdx > dIdx && sIdx !== -1 && dIdx !== -1) {
            // Found them but in wrong order (e.g. searching Amritsar to Jalandhar but route is Jalandhar to Amritsar)
            // Still returning true to match original backend search which was broad, but we could be strict.
         }
      }
      
      return sMatch && dMatch;
    });
    
    setBuses(matches);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    executeSearch();
  };

  // Auto update search results as global buses update
  useEffect(() => {
    if (hasSearched) {
      executeSearch();
    }
  }, [globalBuses]);

  return (
    <div className="min-h-screen relative p-6 pt-24 pb-20 bg-slate-900 overflow-hidden text-slate-200 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-center flex flex-col gap-4"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 m-0">Find Your Bus</h1>
          <p className="text-slate-300 text-lg m-0">Real-time tracking across Punjab</p>
          
          <form className="flex flex-col md:flex-row gap-4 mt-4 w-full max-w-4xl mx-auto items-center justify-center" onSubmit={handleSearch}>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiMapPin />
              </div>
              <input 
                type="text" 
                placeholder="Source City" 
                value={source} 
                onChange={handleSourceChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
              />
              {sourceSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 text-left">
                  {sourceSuggestions.map(s => (
                    <li key={s} onClick={() => selectSource(s)} className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiMapPin />
              </div>
              <input 
                type="text" 
                placeholder="Destination City" 
                value={destination} 
                onChange={handleDestChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
              />
              {destSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 text-left">
                  {destSuggestions.map(s => (
                    <li key={s} onClick={() => selectDest(s)} className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
              <FiSearch /> Search Buses
            </button>
          </form>
        </motion.div>

        {error && <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-center backdrop-blur-md">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-xl text-slate-400 font-semibold animate-pulse">Searching buses...</div>
          ) : hasSearched && buses.length > 0 ? (
            buses.map((location) => (
              <motion.div 
                key={location.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col justify-between backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/15 hover:border-white/30 hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xl font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
                      <FaBusAlt className="text-blue-400" /> {location.bus?.busNumber || location.busNumber || 'Unknown'}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${location.bus?.status === 'Active' || !location.bus?.status ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {location.bus?.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="mb-5">
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-2">{location.fullRoute?.routeName || location.route?.name || 'Unassigned'}</div>
                    <div className="text-sm text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                      <strong className="text-white block mb-1">Stops: </strong> 
                      <span className="leading-relaxed">{location.fullRoute?.stops ? location.fullRoute.stops.map(s => s.stopName).join(' • ') : location.route?.stops?.join(' • ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner"><FiActivity size={16} /></div>
                      <span>Type: {location.bus?.type || 'AC'} • {location.bus?.capacity || 40} seats</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner"><FiMapPin size={16} /></div>
                      <span>Lat: {location.currentLocation?.lat?.toFixed(4) || 'N/A'}, Lng: {location.currentLocation?.lng?.toFixed(4) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner"><FiClock size={16} /></div>
                      <span>Last Updated: {location.updatedAt ? new Date(location.updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                  onClick={() => {
                    const stops = location.fullRoute?.stops || location.route?.stops || [];
                    const orig = source || location.fullRoute?.origin || location.route?.origin || (stops.length > 0 ? (stops[0].stopName || stops[0]) : '');
                    const dest = destination || location.fullRoute?.destination || location.route?.destination || (stops.length > 1 ? (stops[stops.length - 1].stopName || stops[stops.length - 1]) : '');
                    navigate(`/map?origin=${orig}&destination=${dest}&busId=${location.id}`);
                  }}
                >
                  <FiMap size={18} /> Track Bus Route
                </button>
              </motion.div>
            ))
          ) : (
            hasSearched && !loading && (
              <div className="col-span-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <h3 className="text-2xl font-bold text-white mb-2">No buses found</h3>
                <p className="text-slate-300">Try adjusting your source or destination to find available routes.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BusPage;
