import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { 
  User, 
  Mail, 
  Key,
  Smartphone,
  Check,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data));
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
           <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                Account Command
             </span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Global Config</h2>
          <p className="text-slate-400 font-bold text-lg mt-4 max-w-xl">Configure your identity and security protocols across the cluster.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card group"
      >
        <div className="premium-card-accent" />
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm group-hover:rotate-6 transition-all duration-500">
               <User size={24} />
             </div>
             Identity Data
           </h3>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Legal Name</label>
              <div className="relative group/input">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within/input:text-indigo-500 group-focus-within/input:scale-110 transition-all" size={20} />
                <input 
                  type="text" 
                  value={user?.name || ""}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all font-bold text-sm tracking-tight"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Identity Vector</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                <input 
                  type="email" 
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-16 pr-8 py-5 bg-slate-100/50 border-2 border-slate-50 rounded-2xl text-slate-400 font-bold text-sm cursor-not-allowed opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em]">Last sync: 2 minutes ago</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center gap-3 px-12 py-5 ${isSaved ? 'bg-emerald-500' : 'bg-slate-950'} text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-700`}
            >
              {isSaved ? <Check size={18} className="animate-bounce" /> : null}
              {isSaved ? "Saved to Cloud" : "Confirm Sync"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: Key, label: 'Access Protocol', desc: 'Secure encryption key', color: 'indigo', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
          { icon: Smartphone, label: 'Dual-Factor', desc: 'Hardware-level MFA', color: 'cyan', textColor: 'text-cyan-600', bgColor: 'bg-cyan-50' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="premium-card !p-8 flex items-center gap-8 cursor-pointer group"
          >
             <div className="premium-card-accent opacity-0 group-hover:opacity-10 scale-x-0 group-hover:scale-x-100 transition-all duration-700 origin-left" />
             <div className={`p-5 ${item.bgColor} ${item.textColor} rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-sm border border-transparent group-hover:border-current/10`}>
                <item.icon size={28} />
             </div>
             <div>
                <p className="text-base font-black text-slate-900 tracking-tighter leading-tight">{item.label}</p>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{item.desc}</p>
             </div>
             <div className="ml-auto p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <ArrowRight size={18} />
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
