import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from "framer-motion";

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${import.meta.env.VITE_API_URL}/api/resume/current`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setResume(res.data);
      })
      .catch(() => {
        setResume(null);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100">
              AI Knowledge Base
            </span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Profile Context</h2>
          <p className="text-slate-400 font-bold text-lg mt-4 max-w-xl">Deep analyze your career trajectory to generate high-fidelity interview simulations.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="premium-card group"
        >
          <div className="premium-card-accent" />
          <div className="flex items-center gap-8 mb-10">
            <div className={`p-6 rounded-[32px] shadow-lg shadow-current/10 ${resume ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} transition-all duration-700 group-hover:rotate-6 group-hover:scale-110`}>
              <FileText size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Resume</h3>
              <p className="text-sm font-bold text-slate-400 opacity-80 truncate max-w-[200px] mt-1">
                {resume ? resume.filename : "Awaiting transmission..."}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`flex items-center gap-4 p-5 rounded-2xl border ${resume ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : 'bg-rose-50/50 border-rose-100 text-rose-600'} font-black text-[11px] uppercase tracking-widest`}>
              {resume ? <CheckCircle size={20} className="animate-pulse" /> : <AlertCircle size={20} />}
              {resume ? "Perfectly indexed for deep analysis" : "Context missing for your interview"}
            </div>

            <div className="pt-2">
              <Link to="/uploadresume" className="no-underline">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all duration-500 ${resume
                    ? 'bg-slate-50 border-2 border-slate-100 text-slate-900 hover:bg-white hover:border-indigo-200'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/30'}`}
                >
                  {resume ? <RefreshCw size={20} className="text-indigo-400 group-hover:rotate-180 transition-transform duration-700" /> : <Upload size={20} />}
                  {resume ? "Refresh Career Data" : "Begin Data Ingestion"}
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-900 p-12 rounded-[32px] text-white shadow-2xl relative overflow-hidden group border border-white/5"
        >
          <div className="relative z-10 space-y-8">
            <div className="p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl w-fit text-indigo-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
              <ArrowRight size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter">Strategic Impact</h3>
            <p className="text-slate-400 text-lg font-bold leading-relaxed">
              We don't just ask but <span className="text-white">simulate</span>. Our engine parses your narrative to craft a <span className="text-indigo-400 underline underline-offset-8 decoration-2">Bespoke Challenge</span> that actually pushes your mental boundaries.
            </p>
            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    Ai
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Validated by 2k+ systems</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-16 opacity-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
            <FileText size={200} strokeWidth={1} />
          </div>
          <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>

      {/* Featured Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="premium-card !p-20 text-center space-y-10 border-2 border-dashed border-slate-100 group hover:border-indigo-300 transition-all duration-700 relative overflow-hidden"
      >
        <div className="w-28 h-28 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-all duration-1000 group-hover:rotate-12">
          <Sparkles size={56} strokeWidth={1.5} />
        </div>
        <div className="max-w-xl mx-auto">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">ATS Protocol 4.0</h3>
          <p className="text-slate-500 font-bold text-xl leading-relaxed mt-6">
            Our upcoming engine will benchmark your resume against real-world liquidity data from top tech giants. Stay ahead of the curve.
          </p>
        </div>
        <div className="pt-6">
          <span className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-indigo-100 shadow-sm">
            Alpha Testing
          </span>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
      </motion.div>
    </div>
  );
}
