import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setMessage("");
    }
    else if (f) {
      setMessageType("error");
      setMessage("Only PDF documents are accepted for neural parsing.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessageType("error");
      setMessage("Please select a valid PDF file first.");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/resume/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMessageType("success");
      setMessage("Profile synchronized successfully! Calibrating engine...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("upload error", error);
      let msg = error.response?.data?.message || "Transmission failed. Check cluster health.";
      setMessageType("error");
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Link to="/resume-analyzer" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors mb-4 no-underline group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.2em] font-black">Back to Analyzer</span>
        </Link>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Data Ingestion</h2>
        <p className="text-slate-400 font-bold text-lg max-w-sm mx-auto">Upload your resume to calibrate the AI interview engine.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="premium-card group"
      >
        <div className="premium-card-accent" />

        <div className="space-y-10">
          <label
            htmlFor="resume-file"
            className={`relative block rounded-[32px] border-4 border-dashed transition-all duration-700 cursor-pointer overflow-hidden p-12 text-center group/zone
              ${dragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-slate-50/50 hover:border-indigo-300 hover:bg-white'} 
              ${file ? 'border-emerald-500 bg-emerald-50/30' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input id="resume-file" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e.target.files[0])} />

            <div className="space-y-6">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto transition-all duration-700 shadow-xl
                ${file ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-white text-slate-300 group-hover/zone:scale-110 group-hover/zone:rotate-12 group-hover/zone:text-indigo-400'}`}>
                {file ? <CheckCircle size={48} /> : <Upload size={48} />}
              </div>

              {file ? (
                <div className="space-y-2">
                  <p className="text-xl font-black text-slate-900 tracking-tight">{file.name}</p>
                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                    {(file.size / 1024).toFixed(1)} KB · Ready to ingest
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl font-black text-slate-900 tracking-tight">Transmission Target</p>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed">
                    Drag your PDF here or <span className="text-indigo-600">click to browse local cluster</span>
                  </p>
                </div>
              )}

              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-4">
                PDF only · Maximum 5.0 MB
              </p>
            </div>
          </label>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-4 p-6 rounded-2xl border font-black text-[11px] uppercase tracking-widest shadow-sm
                  ${messageType === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}
              >
                {messageType === 'success' ? <CheckCircle size={20} className="animate-pulse" /> : <AlertCircle size={20} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-700 flex items-center justify-center gap-3
              ${loading || !file ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-950 text-white shadow-indigo-500/20'}`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full"
              />
            ) : <FileText size={20} className="text-indigo-400" />}
            {loading ? "Synchronizing..." : "Initiate Ingestion"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}