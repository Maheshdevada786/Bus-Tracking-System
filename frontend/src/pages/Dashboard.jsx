import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiShare2, FiMapPin, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { FaBus, FaUsers, FaGasPump } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import LiveNetworkMap from '../components/LiveNetworkMap';
import { API_BASE_URL } from '../apiConfig';

const Dashboard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({ totalBuses: 0, activeBuses: 0, totalRoutes: 0, totalUsers: 0 });

  useEffect(() => {
    setIsMounted(true);
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const passengerTrendsData = [
    { name: '10 April', users: 100 },
    { name: '12 April', users: 200 },
    { name: '14 April', users: 150 },
    { name: '18 April', users: 300 },
    { name: '20 April', users: 220 },
    { name: '22 April', users: 280 },
    { name: '25 April', users: 400 },
    { name: '30 April', users: 500 },
  ];

  const miniChartData1 = [{ v: 20 }, { v: 40 }, { v: 30 }, { v: 50 }, { v: 40 }, { v: 70 }, { v: 80 }];
  const miniChartData2 = [{ v: 80 }, { v: 60 }, { v: 70 }, { v: 50 }, { v: 60 }, { v: 90 }, { v: 85 }];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen relative p-6 pt-24 pb-20 bg-slate-900 overflow-hidden text-slate-200 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto flex flex-col gap-6"
      >
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Analytics Dashboard</h1>
          <p className="text-slate-400">Live operational metrics and insights</p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { title: 'Total Buses', val: stats.totalBuses, sub: <><span className="text-emerald-400 font-bold">+12.6%</span> from yesterday</>, icon: <FaBus />, color: 'blue' },
            { title: 'Active Buses', val: stats.activeBuses, sub: '77.2% on road', icon: <FaBus />, color: 'emerald' },
            { title: 'Passengers Today', val: '357', sub: <><span className="text-emerald-400 font-bold">+18.7%</span> from yesterday</>, icon: <FaUsers />, color: 'purple' },
            { title: 'On Time Performance', val: '88.4%', sub: <><span className="text-emerald-400 font-bold">+5.3%</span> from yesterday</>, icon: <BsClockHistory />, color: 'blue' },
            { title: 'Total Routes', val: stats.totalRoutes, sub: 'Across Punjab', icon: <FiShare2 />, color: 'amber' },
            { title: 'Total Terminals', val: '23', sub: 'Across Punjab', icon: <FiMapPin />, color: 'teal' }
          ].map((item, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 hover:bg-white/15">
              <div className="text-sm text-slate-400 font-semibold mb-2">{item.title}</div>
              <div className="text-3xl font-bold text-white mb-2">{item.val}</div>
              <div className="text-xs text-slate-500">{item.sub}</div>
              <div className={`absolute top-4 right-4 text-3xl opacity-20 text-${item.color}-400`}>{item.icon}</div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Map Box */}
          <div className="lg:col-span-6 flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] h-[500px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Live Map - Punjab</h2>
              <p className="text-sm text-slate-400">Track all active buses</p>
            </div>
            <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 shadow-inner">
              <LiveNetworkMap />
            </div>
          </div>

          {/* Upcoming Arrivals Box */}
          <div className="lg:col-span-3 flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] h-[500px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Upcoming Arrivals</h2>
              <p className="text-sm text-slate-400 mb-3">Next buses at selected stop</p>
              <select className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                <option>ISBT Ludhiana</option>
                <option>ISBT Chandigarh</option>
                <option>Jalandhar Bus Stand</option>
              </select>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent space-y-3">
              {[
                { name: 'PRTC Volvo', route: 'Chandigarh • PB 01 A 1234', time: '2', color: 'amber' },
                { name: 'PRTC Ordinary', route: 'Amritsar • PB 03 B 5678', time: '5', color: 'rose' },
                { name: 'PRTC Volvo', route: 'Patiala • PB 11 C 9101', time: '8', color: 'blue' },
                { name: 'PRTC Ordinary', route: 'Bathinda • PB 05 D 4321', time: '12', color: 'emerald' },
                { name: 'PRTC Volvo', route: 'Jalandhar • PB 01 A 1234', time: '15', color: 'purple' },
                { name: 'PRTC Travelers', route: 'Ludhiana • PB 012 A 1534', time: '11', color: 'purple' },
                { name: 'PRTC Swati', route: 'khana • PB 44 D 9473', time: '8', color: 'purple' },
                { name: 'Punjab Roadways', route: 'Khana • PB 77 F 4785', time: '14', color: 'purple' },
                { name: 'Panipet Roadways', route: 'panipet • PB 32 A 4093', time: '7', color: 'purple' },
                { name: 'Punjab Travlers', route: 'Ambala • PB 22 F 4569', time: '17', color: 'purple' }
              ].map((arr, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${arr.color}-500/20 text-${arr.color}-400 shrink-0`}>
                    <FaBus />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{arr.name}</div>
                    <div className="text-xs text-slate-400 truncate">{arr.route}</div>
                  </div>
                  <div className="text-xl font-bold text-white shrink-0 text-right">
                    {arr.time} <span className="text-xs font-normal text-slate-400 block -mt-1">min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Box */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-1 flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Daily Passenger Trends</h2>
                  <p className="text-xs text-slate-400">Total passengers over time</p>
                </div>
                <select className="bg-slate-800/80 border border-white/20 rounded-md px-2 py-1 text-xs text-white focus:outline-none appearance-none cursor-pointer">
                  <option>April Month</option>
                  <option>March Month</option>
                </select>
              </div>
              <div className="flex-1 min-h-[120px] -ml-5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={passengerTrendsData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v) => `${v}K`} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Area type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex-1 flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Top Routes</h2>
                  <p className="text-xs text-slate-400">This week</p>
                </div>
                <div className="text-blue-400 text-xs cursor-pointer hover:underline">View All</div>
              </div>
              <div className="flex-1 flex flex-col justify-between gap-2">
                {[
                  { route: 'Chandigarh - Amritsar', val: 450, w: '90%', c: 'bg-purple-500' },
                  { route: 'Ludhiana - Delhi', val: 387, w: '75%', c: 'bg-blue-500' },
                  { route: 'Patiala - Chandigarh', val: 321, w: '60%', c: 'bg-emerald-500' },
                  { route: 'Jalandhar - Ludhiana', val: 295, w: '55%', c: 'bg-amber-500' },
                  { route: 'Bathinda - Chandigarh', val: 249, w: '45%', c: 'bg-rose-500' }
                ].map((r, i) => (
                  <div key={i} className="flex items-center text-xs font-semibold text-slate-300">
                    <div className="w-28 truncate pr-2">{r.route}</div>
                    <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full ${r.c} rounded-full`} style={{ width: r.w }}></div>
                    </div>
                    <div className="w-8 text-right text-white">{r.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { title: 'Occupancy', sub: 'Average bus occupancy', val: '72%', trend: '+6.4%', color: 'purple', data: miniChartData1 },
            { title: 'On Time', sub: 'This week', val: '88.4%', trend: '+5.3%', color: 'emerald', data: miniChartData2 },
            { title: 'Total Passengers', sub: 'Today', val: '3678', trend: '+18.7%', color: 'blue', data: miniChartData1 },
            { title: 'Total Revenue', sub: 'This Month', val: '₹799', trend: '+14.2%', color: 'purple', data: miniChartData2 },
            { title: 'Fuel Efficiency', sub: 'Average (Km/Litre)', val: '4.2 km/l', trend: '+3.1%', color: 'emerald', data: miniChartData1 },
            { title: 'Delay Summary', sub: 'Total delays today', val: '243', trend: '-11.2%', color: 'rose', data: miniChartData2, down: true }
          ].map((item, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex flex-col relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 hover:bg-white/15">
              <div className="text-sm text-slate-200 font-bold">{item.title}</div>
              <div className="text-[10px] text-slate-400 mb-2">{item.sub}</div>
              <div className="text-xl font-bold text-white mb-2 flex items-baseline gap-2">
                {item.val} 
                <span className={`text-[10px] font-bold ${item.down ? 'text-rose-400' : 'text-emerald-400'}`}>{item.trend}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-10 opacity-60 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.data}>
                    <Area type="monotone" dataKey="v" stroke={`var(--tw-colors-${item.color}-500)`} strokeWidth={2} fillOpacity={0.2} fill={`var(--tw-colors-${item.color}-500)`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;
