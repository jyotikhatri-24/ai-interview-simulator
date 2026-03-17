import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  Zap,
  MessageSquare,
  Code,
  Settings2,
  ArrowRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function MockInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [testRequired, setTestRequired] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interview/generate`,
        { role, testRequired },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/interviewroom", { state: { interview: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview. Did you upload a resume?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-[0.25em] border border-indigo-100 shadow-sm">
            Session Initialization
          </span>
        </div>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
          Construct your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">Expert Persona.</span>
        </h2>
        <p className="text-xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
          Configure your simulation parameters. Our neural engine will synthesize a unique interview trail based on your identity vector.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="premium-card group space-y-12">
            <div className="premium-card-accent" />
            <div className="space-y-6">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ml-1">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Briefcase size={16} />
                </div>
                Strategic Role
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Principal Systems Architect"
                  className="w-full px-8 py-6 bg-slate-50/50 border-2 border-slate-100 rounded-[24px] outline-none focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all duration-500 font-black text-slate-900 text-xl tracking-tight placeholder:text-slate-200"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within/input:text-indigo-400 group-focus-within/input:scale-110 transition-all">
                  <Settings2 size={28} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ml-1">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Zap size={16} />
                </div>
                Simulation Depth
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setTestRequired(false)}
                  className={`group relative flex items-center gap-5 p-8 rounded-[24px] border-2 transition-all duration-700 overflow-hidden ${!testRequired ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900 shadow-2xl shadow-indigo-500/10' : 'border-slate-100 bg-white text-slate-400 hover:border-indigo-200 hover:bg-slate-50'}`}
                >
                  <div className={`p-4 rounded-2xl ${!testRequired ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'} transition-all duration-500`}>
                    <MessageSquare size={28} />
                  </div>
                  <div className="text-left">
                    <p className={`font-black text-lg tracking-tight ${!testRequired ? 'text-indigo-950' : 'text-slate-400'}`}>Conceptual</p>
                    <p className={`text-[10px] uppercase font-black tracking-widest mt-1 ${!testRequired ? 'text-indigo-500' : 'text-slate-300'}`}>Logic & Culture</p>
                  </div>
                  {!testRequired && <div className="absolute right-6 top-6 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />}
                </button>
                <button
                  type="button"
                  onClick={() => setTestRequired(true)}
                  className={`group relative flex items-center gap-5 p-8 rounded-[24px] border-2 transition-all duration-700 overflow-hidden ${testRequired ? 'border-purple-600 bg-purple-50/30 text-purple-900 shadow-2xl shadow-purple-500/10' : 'border-slate-100 bg-white text-slate-400 hover:border-purple-200 hover:bg-slate-50'}`}
                >
                  <div className={`p-4 rounded-2xl ${testRequired ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-400'} transition-all duration-500`}>
                    <Code size={28} />
                  </div>
                  <div className="text-left">
                    <p className={`font-black text-lg tracking-tight ${testRequired ? 'text-purple-950' : 'text-slate-400'}`}>Full Stack</p>
                    <p className={`text-[10px] uppercase font-black tracking-widest mt-1 ${testRequired ? 'text-purple-500' : 'text-slate-300'}`}>Code + Logic</p>
                  </div>
                  {testRequired && <div className="absolute right-6 top-6 w-2 h-2 rounded-full bg-purple-600 animate-ping" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100 text-[11px] font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full py-8 bg-slate-950 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 relative overflow-hidden group/btn"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full"
                  />
                  Synthesizing Trial...
                </>
              ) : (
                <>
                  <Zap size={28} className="transition-all duration-700 group-hover/btn:scale-125 group-hover/btn:rotate-12 group-hover/btn:text-indigo-400" fill="currentColor" />
                  Initiate Session
                  <ArrowRight size={28} className="transition-all duration-700 group-hover/btn:translate-x-3 text-indigo-400" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover/btn:opacity-10 transition-opacity duration-700" />
            </motion.button>
          </div>
        </motion.div>

        {/* Tips / Info */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="premium-card group"
          >
            <div className="premium-card-accent bg-emerald-500" />
            <h4 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Sparkles size={16} />
              </div>
              Neural Tip
            </h4>
            <p className="text-base text-slate-400 font-bold leading-relaxed">
              Ensure your profile context is high-fidelity. Our engine benchmarks your work history against <span className="text-slate-900 underline underline-offset-4 decoration-current/10">industry protocols</span> for precision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-indigo-600 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group border border-indigo-400/20"
          >
            <div className="relative z-10 space-y-8">
              <h4 className="font-black text-white flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] opacity-80">
                <div className="p-2 bg-white/10 rounded-lg">
                  <ArrowRight size={16} />
                </div>
                Core Capabilities
              </h4>
              <ul className="space-y-5">
                {[
                  { label: 'Neural Sentiment Analysis', icon: Sparkles },
                  { label: 'Technical Velocity Tracking', icon: Zap },
                  { label: 'Adaptive Scenario Logic', icon: Settings2 },
                  { label: 'Identity Vector Ingestion', icon: Briefcase }
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-4 text-sm font-black tracking-tight"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                      <item.icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-1000" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
