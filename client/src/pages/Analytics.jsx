import { useState, useEffect } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  Sparkles, 
  BarChart 
} from 'lucide-react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [stats, setStats] = useState({ interviewTrend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8000/api/analytics/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setStats({
        interviewTrend: res.data.interviewTrend || []
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const lineData = {
    labels: stats.interviewTrend.length > 0 ? stats.interviewTrend.map(item => item.date) : ["N/A"],
    datasets: [
      {
        label: "Performance Score",
        data: stats.interviewTrend.length > 0 ? stats.interviewTrend.map(item => item.score) : [0],
        borderColor: "#6366f1",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          return gradient;
        },
        pointBackgroundColor: "#fff",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBorderWidth: 5,
        tension: 0.45,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "Inter", size: 14, weight: "900" },
        bodyFont: { family: "Inter", size: 13, weight: "700" },
        padding: 20,
        borderRadius: 20,
        displayColors: false,
        caretSize: 10,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(226, 232, 240, 0.2)", drawBorder: false },
        ticks: { color: "#94a3b8", font: { family: "Inter", size: 11, weight: "800" }, padding: 15 }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { family: "Inter", size: 11, weight: "800" }, padding: 15 }
      }
    }
  };

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
           <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                Advanced Metrics
             </span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Intelligence Hub</h2>
          <p className="text-slate-400 font-bold text-lg mt-4 max-w-xl">Uncover deep behavioral insights and technical progression trends.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border border-indigo-100">
              Download Report
           </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 premium-card space-y-10"
        >
          <div className="premium-card-accent" />
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-2xl shadow-sm">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              Velocity Tracking
            </h3>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {['7D', '1M', '3M', 'All'].map(t => (
                <button key={t} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${t === '1M' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-indigo-500'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[400px] relative bg-slate-50/30 rounded-[28px] p-6 border border-slate-50">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full" 
                />
              </div>
            ) : (
              <Line data={lineData} options={options} />
            )}
          </div>
        </motion.div>

        {/* Insights Panel */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 p-12 rounded-[32px] text-white shadow-2xl relative overflow-hidden group border border-white/5"
          >
            <div className="relative z-10">
              <div className="p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl w-fit mb-10 text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-black mb-6 tracking-tighter">Behavioral Analysis</h3>
              <p className="text-slate-400 text-lg font-bold leading-relaxed mb-12">
                Your <span className="text-white">Technical Architecture</span> scores are peaking. Focus on <span className="text-indigo-400 underline underline-offset-8 decoration-2">Behavioral Logic</span> to bridge the gap.
              </p>
              <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-4xl font-black text-white tracking-tighter">14k+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">Corpus Size</p>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <p className="text-4xl font-black text-indigo-400 tracking-tighter">82%</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">Sentiment</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="premium-card"
          >
            <div className="premium-card-accent bg-gradient-to-r from-pink-500 to-rose-500" />
            <h4 className="font-black text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-[0.15em] text-[11px]">
              <div className="p-2.5 bg-pink-50 rounded-2xl shadow-sm">
                <BarChart size={20} className="text-pink-600" />
              </div>
              Capability Matrix
            </h4>
            <div className="space-y-8">
              {[
                { label: 'React.js Architecture', val: 92, color: 'bg-indigo-500' },
                { label: 'Cloud Systems', val: 78, color: 'bg-purple-500' },
                { label: 'Dynamic Programming', val: 65, color: 'bg-cyan-500' }
              ].map(skill => (
                <div key={skill.label} className="space-y-4">
                  <div className="flex justify-between text-xs font-black text-slate-900 uppercase tracking-tight">
                    <span>{skill.label}</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{skill.val}%</span>
                  </div>
                  <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.val}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className={`h-full ${skill.color} rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] relative`}
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
