import React from 'react';
import { motion } from 'framer-motion';
import { FiMap, FiActivity, FiClock, FiBell, FiUsers, FiTrendingUp, FiCloudRain, FiBarChart2, FiSend, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import { API_BASE_URL } from '../apiConfig';

const TEAM_MEMBERS = [
  { name: 'Mahesh', role: 'Frontend Developer', desc: 'React & UI/UX Expert' },
  { name: 'Syamanth', role: 'Backend Developer', desc: 'Node.js & Express Architecture' },
  { name: 'Jayanth Reddy', role: 'Database Manager', desc: 'MongoDB Atlas Specialist' },
  { name: 'Harshavardhan', role: 'UI/UX Designer', desc: 'Glassmorphism & Advanced CSS' },
  { name: 'Nishith', role: 'API Developer', desc: 'REST & WebSocket Integration' },
  { name: 'Balaji', role: 'Project Coordinator', desc: 'Agile Management & QA' },
];

const FEATURES = [
  { title: 'Realtime Bus Tracking', icon: <FiMap /> },
  { title: 'Route Optimization', icon: <FiActivity /> },
  { title: 'Live ETA Calculation', icon: <FiClock /> },
  { title: 'Traffic Monitoring', icon: <FiTrendingUp /> },
  { title: 'Passenger Insights', icon: <FiUsers /> },
  { title: 'Smart Alerts', icon: <FiBell /> },
  { title: 'Weather Notifications', icon: <FiCloudRain /> },
  { title: 'Revenue Analytics', icon: <FiBarChart2 /> },
];

const About = () => {
  return (
    <div className="min-h-screen relative p-6 pt-24 pb-20 bg-slate-900 overflow-hidden text-slate-200 font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* 1. HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-10 md:p-16 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/30 rounded-full blur-[50px]"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-[50px]"></div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 z-10 relative">Real-Time Bus Tracking System</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 z-10 relative">Smart Public Transportation Monitoring & Analytics Platform</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-10 z-10 relative leading-relaxed">
              A modern intelligent transport system that provides realtime bus tracking, route analytics, ETA prediction, passenger monitoring, and smart alerts using modern web technologies.
            </p>
            <div className="flex justify-center z-10 relative">
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center backdrop-blur-md">
                <FiMap size={48} className="text-cyan-400" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. PROJECT OVERVIEW SECTION */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-white mb-8 text-center"><span className="text-blue-400">Project</span> Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FiMap />, title: 'Live Bus Tracking', desc: 'GPS integration for millisecond accuracy.' },
              { icon: <FiActivity />, title: 'Smart Route Analytics', desc: 'AI-driven path optimization.' },
              { icon: <FiClock />, title: 'ETA Prediction', desc: 'Dynamic traffic-based timing.' },
              { icon: <FiBell />, title: 'Notification Alerts', desc: 'Instant push and SMS updates.' },
              { icon: <FiUsers />, title: 'Passenger Monitoring', desc: 'Live capacity tracking.' },
              { icon: <FiBarChart2 />, title: 'Fleet Management', desc: 'Comprehensive admin control.' }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center transition-colors hover:bg-white/15 hover:border-white/30">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-3xl mb-4 border border-blue-500/30 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. TECHNOLOGY STACK SECTION */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-white mb-8 text-center"><span className="text-purple-400">Technology</span> Stack</h2>
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 pb-2 border-b border-white/10">Frontend</h3>
              <ul className="space-y-3 text-slate-300 font-medium">
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">React.js</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">Vite</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">React Router</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">Axios</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">Framer Motion</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">Tailwind CSS</li>
              </ul>
            </div>
            <div className="flex flex-col bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4 pb-2 border-b border-white/10">Backend</h3>
              <ul className="space-y-3 text-slate-300 font-medium">
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full">Node.js</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full">Express.js</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full">JWT Authentication</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full">Socket.io</li>
              </ul>
            </div>
            <div className="flex flex-col bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-4 pb-2 border-b border-white/10">Database & Misc</h3>
              <ul className="space-y-3 text-slate-300 font-medium">
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-400 before:rounded-full">MongoDB Atlas</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-400 before:rounded-full">Google Maps API</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-400 before:rounded-full">Mongoose</li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-400 before:rounded-full">Glassmorphism UI</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. TEAM MEMBERS SECTION */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-white mb-8 text-center"><span className="text-emerald-400">Project</span> Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg flex flex-col items-center text-center group transition-all hover:bg-white/15 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-700 overflow-hidden mb-4 shadow-xl group-hover:border-emerald-500/50 transition-colors">
                  <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random&color=fff&size=100`} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">{member.role}</h4>
                <p className="text-slate-400 text-sm mb-5 flex-1">{member.desc}</p>
                <div className="flex gap-4 text-slate-400">
                  <FiGithub className="cursor-pointer hover:text-white transition-colors" size={20} />
                  <FiLinkedin className="cursor-pointer hover:text-blue-400 transition-colors" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. PROJECT FEATURES SECTION */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-white mb-8 text-center"><span className="text-indigo-400">Advanced</span> Features</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-3 shadow-md hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors cursor-default"
              >
                <span className="text-indigo-400 text-xl">{feature.icon}</span>
                <span className="font-semibold text-slate-200">{feature.title}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CONTACT US SECTION */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-white mb-8 text-center"><span className="text-rose-400">Contact</span> Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Project Details</h3>
              <div className="space-y-4 text-slate-300">
                <div className="flex bg-black/20 p-4 rounded-xl border border-white/5">
                  <strong className="w-24 text-white">Email:</strong> realtimebus@gmail.com
                </div>
                <div className="flex bg-black/20 p-4 rounded-xl border border-white/5">
                  <strong className="w-24 text-white">Phone:</strong> +91 XXXXXXXXX
                </div>
                <div className="flex bg-black/20 p-4 rounded-xl border border-white/5">
                  <strong className="w-24 text-white">College:</strong> Lovely Professional University
                </div>
                <div className="flex bg-black/20 p-4 rounded-xl border border-white/5">
                  <strong className="w-24 text-white">Guide:</strong> Priyanka Mahajan
                </div>
                <div className="flex bg-black/20 p-4 rounded-xl border border-white/5">
                  <strong className="w-24 text-white">Location:</strong> Punjab, India
                </div>
              </div>
              <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><FiGithub /> GitHub</a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><FiLinkedin /> LinkedIn</a>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Send a Message</h3>
              <form className="flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target.name.value;
                const email = e.target.email.value;
                const message = e.target.message.value;
                
                try {
                  const res = await fetch(`${API_BASE_URL}/api/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      category: `Contact Us - ${name} (${email})`,
                      message: message
                    })
                  });
                  if (res.ok) {
                    alert('Message sent successfully!');
                    e.target.reset();
                  } else {
                    alert('Failed to send message.');
                  }
                } catch (error) {
                  alert('Error sending message.');
                }
              }}>
                <input type="text" name="name" placeholder="Your Name" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all" required />
                <input type="email" name="email" placeholder="Your Email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all" required />
                <textarea name="message" placeholder="Your Message" rows="5" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all resize-y" required></textarea>
                <button type="submit" className="w-full mt-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                  <FiSend /> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* 7. FOOTER SECTION */}
      <footer className="relative z-10 max-w-6xl mx-auto mt-20 backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">BusNavigator</h3>
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Real-Time Bus Tracking System.</p>
            <p className="text-slate-500 text-xs mt-1">Final Year Project. All Rights Reserved.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4 text-slate-400 text-xl">
              <FiGithub className="hover:text-white cursor-pointer transition-colors" /> 
              <FiLinkedin className="hover:text-white cursor-pointer transition-colors" /> 
              <FiTwitter className="hover:text-white cursor-pointer transition-colors" /> 
              <FiInstagram className="hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="flex gap-4 text-xs font-semibold text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
