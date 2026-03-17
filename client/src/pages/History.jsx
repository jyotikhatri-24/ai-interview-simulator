import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  ArrowUpRight,
  History as HistoryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setHistory(res.data.recentInterviews || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredHistory = history.filter(item =>
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              Timeline Archive
            </span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Session Logs</h2>
          <p className="text-slate-400 font-bold text-lg mt-4 max-w-xl">Review every milestone, feedback loop, and performance metric.</p>
        </div>

        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-6 py-3 bg-slate-50 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">
            Clear Logs
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card !p-0 overflow-hidden"
      >
        <div className="premium-card-accent" />

        {/* Table Header / Filters */}
        <div className="p-10 border-b border-slate-100 flex flex-wrap gap-8 items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 group-focus-within:scale-110 transition-all" size={20} />
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm tracking-tight placeholder:text-slate-200"
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-3 px-8 py-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.15em] hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm">
              <Filter size={18} />
              Sort: Latest
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Session Detail</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Objective</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Efficiency</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Status</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredHistory.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * idx }}
                    className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                  >
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 tracking-tighter">{new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <Clock size={12} className="text-slate-300" />
                            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-black text-slate-900 tracking-tight">{item.role}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Full-stack Focus</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 1.5, delay: 0.2 + idx * 0.1 }}
                            className={`h-full rounded-full ${item.score >= 70 ? 'bg-emerald-500' : item.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          />
                        </div>
                        <span className="text-sm font-black text-slate-900 min-w-[3ch]">{item.score}%</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <span className={`status-badge ${item.score >= 70 ? 'status-passed' : item.score >= 40 ? 'status-average' : 'status-needs-work'}`}>
                        {item.score >= 70 ? 'Passed' : item.score >= 40 ? 'Average' : 'Needs Work'}
                      </span>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <Link to={`/results?id=${item.id}`} className="inline-flex items-center gap-3 text-[10px] font-black text-indigo-600 no-underline hover:text-indigo-700 uppercase tracking-[0.2em] transition-all bg-indigo-50/50 px-6 py-3 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/20 group-hover:-translate-x-2">
                        View Report
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-40 text-center space-y-10"
          >
            <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-200 border-2 border-dashed border-slate-100 relative group">
              <HistoryIcon size={56} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-700" />
              <div className="absolute inset-0 bg-indigo-500/5 rounded-[40px] blur-2xl animate-pulse" />
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">The timeline awaits.</h3>
              <p className="text-slate-500 font-bold text-lg leading-relaxed px-8">
                {searchTerm ? `We analyzed over infinite records but couldn't find "${searchTerm}"` : "You haven't initiated a session yet. Your AI companion is ready when you are."}
              </p>
            </div>
            {!searchTerm && (
              <div className="pt-8">
                <Link to="/mock-interview" className="no-underline">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-vibrant px-12 py-5 text-sm uppercase tracking-[0.2em]"
                  >
                    Launch First Session
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {loading && (
          <div className="p-40 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full mx-auto"
            />
            <p className="mt-10 text-slate-400 font-black text-[11px] uppercase tracking-[0.25em]">Syncing Timeline Data...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
