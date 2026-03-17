import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  BarChart3, 
  FileSearch, 
  Settings, 
  LogOut,
  Bell,
  User,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-400 hover:bg-indigo-500/10 hover:text-white'}
    `}
  >
    {({ isActive }) => (
      <>
        <Icon 
          size={20} 
          className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-indigo-400'}`} 
        />
        <span className="font-bold tracking-tight text-sm">{label}</span>
        {isActive && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute -right-2 w-1 h-6 bg-cyan-400 rounded-l-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-3 px-2 mb-12 mt-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 animate-glow">
          <MessageSquare size={24} strokeWidth={2.5} />
        </div>
        <span className="text-white font-black text-xl tracking-tight">AI Interview</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/mock-interview" icon={MessageSquare} label="Mock Interview" />
        <SidebarItem to="/history" icon={History} label="History" />
        <SidebarItem to="/analytics" icon={BarChart3} label="Analytics" />
        <SidebarItem to="/resume-analyzer" icon={FileSearch} label="Resume Analyzer" />
        
        <div className="mt-auto pt-8 border-t border-slate-800 flex flex-col gap-2">
          <SidebarItem to="/settings" icon={Settings} label="Settings" />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 group"
          >
            <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
            <span className="font-bold tracking-tight text-sm">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

const TopNav = ({ title }) => {
  return (
    <header className="topnav">
      <h1 className="text-xl font-extrabold text-slate-900 tracking-tight capitalize">{title}</h1>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm group-hover:bg-indigo-100 transition-colors">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">User</span>
          </div>
          <ChevronDown size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'Dashboard';
  const displayTitle = path.replace('-', ' ');

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="main-content">
        <TopNav title={displayTitle === 'dashboard' ? 'Overview' : displayTitle} />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-10 max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
