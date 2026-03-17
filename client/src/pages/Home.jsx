import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Target,
  Activity,
  Trophy,
  Plus,
  MessageSquare,
  AlertCircle,
  ArrowUpRight,
  History // Changed from History as HistoryIcon
} from 'lucide-react';
import { motion } from "framer-motion";

const AnimatedNumber = ({ value }) => {
  const displayValue = typeof value === 'string' ? parseInt(value) : value;
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {displayValue}{suffix}
    </motion.span>
  );
};

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="premium-card group"
  >
    <div className="premium-card-accent" />
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg shadow-current/20 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Performance</span>
        <div className="flex items-center gap-1 text-emerald-500 mt-1 font-black text-xs">
          <ArrowUpRight size={14} />
          <span>+12.5%</span>
        </div>
      </div>
    </div>
    <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">
      <AnimatedNumber value={value} />
    </h3>
    <p className="text-sm font-bold text-slate-500 tracking-tight">{label}</p>

    <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700 pointer-events-none">
      <Icon size={120} strokeWidth={1} />
    </div>
  </motion.div>
);

export default function Home() {
  const [stats, setStats] = useState({ totalInterviews: 0, avgScore: 0, bestScore: 0 });
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data));

    axios.get("http://localhost:8000/api/analytics/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setStats({
        totalInterviews: res.data.totalInterviews,
        avgScore: res.data.avgScore,
        bestScore: res.data.bestScore
      });
      setHistory(res.data.recentInterviews || []);
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              Performance Dashboard
            </span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Welcome back, <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">{user?.name || 'Candidate'}</span>!
          </h2>
          <p className="text-slate-400 mt-4 font-bold text-lg max-w-lg">
            Ready to master your next interview? Your performance is trending <span className="text-emerald-500 underline underline-offset-4 decoration-2">upwards</span>.
          </p>
        </motion.div>

        <Link to="/mock-interview" className="no-underline">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-vibrant text-lg px-10 py-5"
          >
            <Plus size={24} strokeWidth={3} />
            Start Session
          </motion.button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          label="Interviews Done"
          value={stats.totalInterviews}
          icon={Target}
          colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          label="Average Score"
          value={`${stats.avgScore}%`}
          icon={Activity}
          colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          label="Best Score"
          value={`${stats.bestScore}%`}
          icon={Trophy}
          colorClass="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Start Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-slate-900 rounded-[32px] p-12 text-white relative overflow-hidden shadow-2xl group transition-all duration-500 border border-white/5"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-8">
              <span className="px-4 py-1.5 bg-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md">
                Role-Specific Prep
              </span>
            </div>
            <h3 className="text-4xl font-black mb-6 leading-[1.1] tracking-tighter">
              Level up your career with <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI-driven role play.</span>
            </h3>
            <p className="text-slate-400 mb-12 max-w-md font-bold text-lg leading-relaxed">
              We process your resume history to craft a personalized interview experience that actually challenges you.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/mock-interview" className="no-underline">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-sm shadow-xl shadow-white/5 uppercase tracking-widest"
                >
                  Launch Now
                </motion.button>
              </Link>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                    JS
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                  +1k
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          <div className="absolute right-0 top-0 p-12 opacity-5 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
            <MessageSquare size={300} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Recent List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card flex flex-col"
        >
          <div className="premium-card-accent" />
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History size={20} className="text-indigo-500" />
              Recent Labs
            </h3>
            <Link to="/history" className="text-indigo-600 text-xs font-black no-underline uppercase tracking-widest hover:text-indigo-700 transition-colors">View All</Link>
          </div>

          <div className="space-y-4 flex-1">
            {history.slice(0, 3).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex justify-between items-center p-5 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 tracking-tight">{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1">{item.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-sm font-black ${item.score >= 70 ? 'text-emerald-500' : 'text-slate-600'}`}>
                    {item.score}%
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </motion.div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-200 mb-4 border border-slate-100">
                  <Target size={32} />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No History Yet</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50">
            <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 transition-colors">
              Export Session Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
