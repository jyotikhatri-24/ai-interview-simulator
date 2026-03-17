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
        backgroundColor: "rgba(99, 102, 241, 0.05)",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
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
        titleFont: { family: "Inter", size: 14, weight: "800" },
        bodyFont: { family: "Inter", size: 13, weight: "600" },
        padding: 16,
        borderRadius: 16,
        displayColors: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(226, 232, 240, 0.3)", drawBorder: false },
        ticks: { color: "#94a3b8", font: { family: "Inter", size: 11, weight: "700" }, padding: 12 }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { family: "Inter", size: 11, weight: "700" }, padding: 12 }
      }
    }
  };

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h2>
          <p className="text-slate-500 font-semibold mt-1">Deep dive into your interview trends and behavioral patterns.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              Score Progression
            </h3>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {['7D', '1M', '3M', 'All'].map(t => (
                <button key={t} className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all ${t === '7D' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
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
            className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-10 rounded-[32px] text-white shadow-2xl shadow-indigo-900/10 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl w-fit mb-8 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">AI Insights</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                Your <span className="text-white">Technical Architecture</span> scores are peaking. Focus on <span className="text-indigo-400 font-bold underline underline-offset-4 decoration-2">Behavioral Communication</span> next.
              </p>
              <div className="pt-8 border-t border-white/5 flex items-center gap-10">
                <div>
                  <p className="text-3xl font-black text-white">14k</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Words Spoken</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-3xl font-black text-indigo-400">82%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Confidence</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors duration-700" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <h4 className="font-extrabold text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest text-xs">
              <div className="p-2 bg-pink-50 rounded-xl">
                <BarChart size={20} className="text-pink-600" />
              </div>
              Skill Matrix
            </h4>
            <div className="space-y-8">
              {[
                { label: 'React.js', val: 92, color: 'bg-indigo-500' },
                { label: 'System Design', val: 78, color: 'bg-violet-500' },
                { label: 'Communication', val: 65, color: 'bg-emerald-500' }
              ].map(skill => (
                <div key={skill.label} className="space-y-3">
                  <div className="flex justify-between text-xs font-black text-slate-900 uppercase tracking-tighter">
                    <span>{skill.label}</span>
                    <span className="text-slate-400">{skill.val}%</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.val}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${skill.color} rounded-full shadow-lg shadow-current/10`}
                    />
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
