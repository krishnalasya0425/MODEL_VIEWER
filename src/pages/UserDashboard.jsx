import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "@google/model-viewer";
import FBXViewer from "../components/FBXViewer";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import {
  Bell,
  User,
  LogOut,
  FolderPlus,
  X,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Eye,
  Maximize,
  View,
  Paperclip,
  Send,
  CheckCircle,
  Mail,
  Search,
  Grid3X3,
  Loader,
  ChevronLeft,
  ChevronRight,
  Play,
  Video,
  Wifi,
  Monitor,
  Smartphone,
  Info,        // Add this
  Check,       // Add this
  ExternalLink,
  RotateCcw,
  Minus,
  Square
} from "lucide-react";



const getUrlParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

const setUrlParam = (name, value) => {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(name, value);
  } else {
    url.searchParams.delete(name);
  }
  window.history.replaceState({}, "", url);
};

const RedirectOverlay = ({ darkMode, onClose }) => {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-close after countdown reaches 0 (fallback)
  useEffect(() => {
    if (countdown === 0) {
      const timeout = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [countdown, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl z-[99999]">
      <div className={`backdrop-blur-2xl rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center ${darkMode
        ? 'bg-gray-900/90 border border-purple-500/30'
        : 'bg-white/90 border border-purple-400/30'
        }`}>
        <div className="flex flex-col items-center gap-4">
          {/* Animated spinner */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-full border-4 ${darkMode ? 'border-purple-500/30' : 'border-purple-400/30'}`}></div>
            <div className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-transparent ${darkMode ? 'border-purple-400' : 'border-purple-600'} animate-spin`}></div>
            <RotateCcw className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
          </div>

          <div>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {countdown > 0 ? 'Redirecting for Optimized Experience' : 'VR Experience Ready'}
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {countdown > 0
                ? 'Preparing your VR simulation environment...'
                : 'VR experience is running in new tab. Return here when finished.'}
            </p>

            {/* Countdown */}
            {countdown > 0 && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-purple-600/80' : 'bg-purple-500/80'} text-white font-bold`}>
                  {countdown}
                </div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {countdown === 1 ? 'second' : 'seconds'}
                </span>
              </div>
            )}

            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>• VR environment will open in a new tab</p>
              <p>• Return to this tab when finished</p>
              <p>• Your progress will be saved automatically</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-all backdrop-blur-xl ${darkMode
              ? 'bg-gray-700/80 hover:bg-gray-600/80 border border-gray-600/30 text-gray-300'
              : 'bg-gray-300/80 hover:bg-gray-400/80 border border-gray-400/30 text-gray-700'
              }`}
          >
            {countdown > 0 ? 'Cancel Redirect' : 'Close This Message'}
          </button>
        </div>
      </div>
    </div>
  );
};
// Optimized RightDescriptionPanel with glassmorphism
const RightDescriptionPanel = React.memo(({ selectedProject }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!selectedProject) return null;

  const { darkMode } = selectedProject;
  const desc = selectedProject.description || 'No description available.';
  const shortDesc = useMemo(() =>
    desc.length > 300 ? desc.slice(0, 300) + '...' : desc,
    [desc]
  );

  return (
    <div
      className={`transition-all duration-300 ${collapsed ? 'w-6' : 'w-96'
        } ${darkMode ? 'backdrop-blur-xl bg-gray-900/30 border-l border-white/10 text-gray-200' : 'backdrop-blur-xl bg-white/30 border-l border-black/10 text-gray-900'} h-full relative flex flex-col shadow-2xl`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute top-1/2 -left-3 transform -translate-y-1/2 rounded-full p-2 shadow-lg transition-all backdrop-blur-md ${darkMode ? 'bg-purple-600/80 hover:bg-purple-700/80 text-white' : 'bg-purple-500/80 hover:bg-purple-600/80 text-white'}`}
      >
        {collapsed ? '>' : '<'}
      </button>

      {!collapsed && (
        <div className="p-6 overflow-y-auto">
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
            {selectedProject.name}
          </h3>
          <p className="text-sm leading-relaxed">{expanded ? desc : shortDesc}</p>

          {desc.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`mt-4 text-sm font-medium px-4 py-2 rounded-lg transition-colors backdrop-blur-md ${darkMode ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-300' : 'bg-purple-100/50 hover:bg-purple-200/50 text-purple-700'
                }`}
            >
              {expanded ? 'View Less' : 'View More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

// Optimized Project Card with glassmorphism
const ProjectCard = React.memo(({ project, isSelected, onClick, darkMode }) => {
  return (
    <div
      onClick={onClick}
      className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${isSelected
        ? darkMode
          ? 'border-purple-500/40 bg-white/10 shadow-2xl shadow-purple-500/30'
          : 'border-purple-400/60 bg-white/40 shadow-2xl shadow-purple-200'
        : darkMode
          ? 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20'
          : 'border-black/5 bg-white/20 hover:border-purple-300/70 hover:bg-white/30 hover:shadow-2xl hover:shadow-purple-200'
        } hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-2 truncate">{project.name}</h4>
          <p className={`text-sm line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {project.description || 'No description available'}
          </p>
        </div>
        <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100/50 text-purple-700'}`}>
          {project.subModels?.length || 0} models
        </div>
      </div>
      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
        <FolderPlus size={16} />
        <span>Click to view models</span>
      </div>
    </div>
  );
});

// Optimized Model Card with glassmorphism
const ModelCard = React.memo(({ model, onClick, darkMode, isMain = false }) => {
  return (
    <div
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-xl ${darkMode
        ? isMain
          ? 'bg-white/10 border border-purple-500/30 hover:border-purple-400'
          : 'bg-white/5 border border-white/10 hover:border-purple-400'
        : isMain
          ? 'bg-white/40 border border-purple-200/60 hover:border-purple-300/80'
          : 'bg-white/30 border border-black/10 hover:border-purple-300/70'
        }`}
      onClick={onClick}
    >
      <div
        className={`p-6 border-b ${darkMode
          ? isMain
            ? 'border-purple-500/30'
            : 'border-white/10'
          : isMain
            ? 'border-purple-200'
            : 'border-black/10'
          }`}
      >
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <div
            className={`p-2 rounded-lg backdrop-blur-md ${isMain
              ? darkMode
                ? 'bg-purple-600/80'
                : 'bg-purple-500/80'
              : darkMode
                ? 'bg-blue-600/80'
                : 'bg-blue-500/80'
              }`}
          >
            <View className="text-white" size={18} />
          </div>
          {isMain ? 'Main Model' : (model?.name || 'Model')}
        </h3>
        <p
          className={`text-sm line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-700'
            }`}
        >
          {isMain
            ? 'Primary 3D model for this project'
            : (model?.description || '3D model component')}
        </p>
      </div>

      <div className="p-4 bg-black/20 text-center backdrop-blur-sm">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors backdrop-blur-md ${isMain
            ? darkMode
              ? 'bg-purple-600/80 hover:bg-purple-700/80 text-white'
              : 'bg-purple-500/80 hover:bg-purple-600/80 text-white'
            : darkMode
              ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white'
              : 'bg-blue-500/80 hover:bg-blue-600/80 text-white'
            }`}
        >
          <Eye size={16} />
          View {isMain ? 'in 3D' : 'Model'}
        </div>
      </div>
    </div>
  );
});

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-purple-500/80 backdrop-blur-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/80 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-purple-500/80 backdrop-blur-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/80 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// const VRConnectionGuide = ({ darkMode, onClose, onConfirm, loading = false }) => {
//   return (
//    <div className="vr-guide-overlay fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//       {/* Change z-[9999] to z-[99999] */}

//       <div className={`backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-y-auto ${darkMode
//         ? 'bg-gray-900/90 border border-purple-500/30'
//         : 'bg-white/90 border border-purple-400/30'
//         }`}>

//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
//           <div className="flex items-center gap-3">
//             <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-600/80' : 'bg-purple-500/80'}`}>
//               <Info className="text-white" size={24} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-purple-400">VR Setup Guide</h2>
//               <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 Connect your Oculus Quest to PC for Unity VR experience
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className={`p-2 rounded-full transition-colors ${darkMode
//               ? 'hover:bg-red-600/80 text-gray-300 hover:text-white'
//               : 'hover:bg-red-500/80 text-gray-600 hover:text-white'
//               } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Method 1: Oculus Link (USB) */}
//           <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-purple-50/50'}`}>
//             <h3 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
//               <Check size={20} />
//               Method 1: Oculus Link (USB Cable)
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-start gap-3">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
//                   }`}>1</div>
//                 <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//                   Connect your Oculus Quest to PC using a high-quality USB 3.0 cable
//                 </p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
//                   }`}>2</div>
//                 <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//                   Put on your headset and enable Oculus Link when prompted
//                 </p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
//                   }`}>3</div>
//                 <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//                   Open Oculus PC app and ensure your headset is connected
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Method 2: Air Link (Wireless) */}
//           <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-blue-50/50'}`}>
//             <h3 className="text-lg font-semibold mb-3 text-blue-400 flex items-center gap-2">
//               <Wifi size={20} />
//               Method 2: Air Link (Wireless)
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-start gap-3">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
//                   }`}>1</div>
//                 <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//                   Ensure your PC and Quest are on the same 5GHz Wi-Fi network
//                 </p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
//                   }`}>2</div>
//                 <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//                   In your Quest headset, go to Settings → Experimental Features → Air Link
//                 </p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
//                   }`}>3</div>
//                 <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
//                   Enable Air Link and connect to your PC
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Requirements */}
//           <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-orange-50/50'}`}>
//             <h3 className="text-lg font-semibold mb-3 text-orange-400 flex items-center gap-2">
//               <Monitor size={20} />
//               System Requirements
//             </h3>
//             <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               <li>• Oculus Quest 2/3/Pro headset</li>
//               <li>• Oculus PC app installed</li>
//               <li>• VR-ready GPU (NVIDIA GTX 1060 / AMD RX 480 or better)</li>
//               <li>• Windows 10/11</li>
//               <li>• USB 3.0 port (for wired connection)</li>
//               <li>• 5GHz Wi-Fi (for wireless connection)</li>
//             </ul>
//           </div>

//           {/* Troubleshooting */}
//           <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-yellow-50/50'}`}>
//             <h3 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center gap-2">
//               <Info size={20} />
//               Quick Tips
//             </h3>
//             <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               <li>• Restart Oculus services if connection fails</li>
//               <li>• Update GPU drivers for best performance</li>
//               <li>• Close background applications for better performance</li>
//               <li>• Use cable testing tool in Oculus app for USB issues</li>
//             </ul>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between p-6 border-t border-purple-500/30">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className={`px-6 py-3 rounded-lg font-semibold transition-all backdrop-blur-xl ${darkMode
//               ? 'bg-gray-700/80 hover:bg-gray-600/80 border border-gray-600/30 text-gray-300'
//               : 'bg-gray-300/80 hover:bg-gray-400/80 border border-gray-400/30 text-gray-700'
//               } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 backdrop-blur-xl ${loading
//                 ? 'bg-gray-500/80 cursor-not-allowed'
//                 : darkMode
//                   ? 'bg-green-600/80 hover:bg-green-700/80 border border-green-500/30 text-white'
//                   : 'bg-green-500/80 hover:bg-green-600/80 border border-green-400/30 text-white'
//               }`}
//           >
//             {loading ? (
//               <>
//                 <Loader className="animate-spin" size={18} />
//                 Launching...
//               </>
//             ) : (
//               <>
//                 <Play size={18} />
//                 Launch Unity VR
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
const VRConnectionGuide = ({ darkMode, onClose, onConfirm, loading = false, onRedirect }) => {
  return (
    <div className="vr-guide-overlay fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 z-[99999]">
      <div className={`backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-y-auto ${darkMode
        ? 'bg-gray-900/90 border border-purple-500/30'
        : 'bg-white/90 border border-purple-400/30'
        }`}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-600/80' : 'bg-purple-500/80'}`}>
              <Info className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-400">VR Setup Guide</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Connect your Oculus Quest to PC for Unity VR experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-2 rounded-full transition-colors ${darkMode
              ? 'hover:bg-red-600/80 text-gray-300 hover:text-white'
              : 'hover:bg-red-500/80 text-gray-600 hover:text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Method 1: Oculus Link (USB) */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-purple-50/50'}`}>
            <h3 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
              <Check size={20} />
              Method 1: Oculus Link (USB Cable)
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                  }`}>1</div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Connect your Oculus Quest to PC using a high-quality USB 3.0 cable
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                  }`}>2</div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Put on your headset and enable Oculus Link when prompted
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                  }`}>3</div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Open Oculus PC app and ensure your headset is connected
                </p>
              </div>
            </div>
          </div>

          {/* Method 2: Air Link (Wireless) */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-blue-50/50'}`}>
            <h3 className="text-lg font-semibold mb-3 text-blue-400 flex items-center gap-2">
              <Wifi size={20} />
              Method 2: Air Link (Wireless)
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  }`}>1</div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Ensure your PC and Quest are on the same 5GHz Wi-Fi network
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  }`}>2</div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  In your Quest headset, go to Settings → Experimental Features → Air Link
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  }`}>3</div>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Enable Air Link and connect to your PC
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-orange-50/50'}`}>
            <h3 className="text-lg font-semibold mb-3 text-orange-400 flex items-center gap-2">
              <Monitor size={20} />
              System Requirements
            </h3>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Oculus Quest 2/3/Pro headset</li>
              <li>• Oculus PC app installed</li>
              <li>• VR-ready GPU (NVIDIA GTX 1060 / AMD RX 480 or better)</li>
              <li>• Windows 10/11</li>
              <li>• USB 3.0 port (for wired connection)</li>
              <li>• 5GHz Wi-Fi (for wireless connection)</li>
            </ul>
          </div>

          {/* Experience Info */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100/50'}`}>
            <h3 className="text-lg font-semibold mb-3 text-purple-400 flex items-center gap-2">
              <ExternalLink size={20} />
              What to Expect
            </h3>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• You'll be redirected to an optimized VR experience</li>
              <li>• The simulation will open in a new browser tab</li>
              <li>• Return to this tab when you're finished</li>
              <li>• Your session will be automatically saved</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-purple-500/30">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all backdrop-blur-xl ${darkMode
              ? 'bg-gray-700/80 hover:bg-gray-600/80 border border-gray-600/30 text-gray-300'
              : 'bg-gray-300/80 hover:bg-gray-400/80 border border-gray-400/30 text-gray-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={onRedirect}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 backdrop-blur-xl ${loading
              ? 'bg-gray-500/80 cursor-not-allowed'
              : darkMode
                ? 'bg-green-600/80 hover:bg-green-700/80 border border-green-500/30 text-white'
                : 'bg-green-500/80 hover:bg-green-600/80 border border-green-400/30 text-white'
              }`}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Preparing...
              </>
            ) : (
              <>
                <Play size={18} />
                Launch Unity VR
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [vrPopup, setVrPopup] = useState({ open: false, fileId: null });
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [restoringFromVR, setRestoringFromVR] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modelMeta, setModelMeta] = useState({ size: 0, type: "", large: false });
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [helpForm, setHelpForm] = useState({
    to: localStorage.getItem("adminEmail") || "defaultadmin@example.com",
    from: localStorage.getItem("email"),
    subject: "",
    message: "",
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [launchingBuild, setLaunchingBuild] = useState(false);
  const [launchingVR, setLaunchingVR] = useState(false);
  const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showVRGuide, setShowVRGuide] = useState(false);
  const [pendingVRModel, setPendingVRModel] = useState(null);

  const handleSimulatorVR = async () => {
    if (!selectedProject?.unityBuildPath) {
      alert("❌ This simulator doesn't have a Unity build configured for VR.");
      return;
    }

    console.log("🚀 Preparing VR Unity build for simulator:", selectedProject.name);


    setShowVRGuide(true);
  };


const proceedToVR = async () => {
  if (!selectedProject?.unityBuildPath) {
    console.error("❌ No Unity build path found");
    return;
  }

  console.log("🎮 Launching Unity VR build for:", selectedProject.name);

  try {
    setLaunchingVR(true);
    setShowRedirectOverlay(true);
    
    const response = await API.post("/projects/launch-build", {
      projectId: selectedProject._id,
      unityBuildPath: selectedProject.unityBuildPath
    });

    console.log("✅ Backend response:", response.data);

    if (response.data.success) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowRedirectOverlay(false);
      
      
    } else {
      setShowRedirectOverlay(false);
      alert("❌ Failed to launch VR build: " + response.data.error);
    }
  } catch (error) {
    console.error("❌ Error launching Unity VR build:", error);
    setShowRedirectOverlay(false);
    alert("❌ Error: " + error.message);
  } finally {
    setLaunchingVR(false);
    setShowVRGuide(false);
  }
};

  const handleVRGuideConfirm = () => {
    // Close the guide and start the VR process
    setShowVRGuide(false);
    proceedToVR();
  };
  const handleRedirectCancel = () => {
    setShowRedirectOverlay(false);
    setLaunchingVR(false);
  };


  // Handle VR guide close
  const handleVRGuideClose = () => {
    setShowVRGuide(false);
    setPendingVRModel(null);
  };


  const launchVrBuild = async (project) => {
    try {
      setLoading(true);

      console.log("🔍 Project data for launch:", {
        id: project._id,
        name: project.name,
        category: project.category,
        unityBuildPath: project.unityBuildPath,
        hasUnityBuild: !!project.unityBuildPath
      });

      // Check if we have the necessary data
      if (!project.unityBuildPath) {
        alert("❌ This project doesn't have a Unity build configured");
        return;
      }

      const response = await API.post("/projects/launch-build", {
        projectId: project._id,
        unityBuildPath: project.unityBuildPath
      });

      console.log("✅ Backend response:", response.data);

      if (response.data.success) {
        alert(`🚀 ${project.name} is launching...`);
      } else {
        alert("❌ Failed to launch build: " + response.data.error);
      }
    } catch (error) {
      console.error("❌ Error launching Unity build:", error);

      if (error.response) {
        console.error("Backend error details:", error.response.data);
        console.error("Backend error status:", error.response.status);
        alert("❌ Server error: " + (error.response.data.error || error.response.data.message));
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("❌ Network error: Could not connect to server.");
      } else {
        alert("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const launchBuildExecutable = async (project) => {
    try {
      setLaunchingBuild(true);

      console.log("🚀 Launching build for project:", {
        id: project._id,
        name: project.name,
        category: project.category,
        unityBuildPath: project.unityBuildPath,
        hasUnityBuild: !!project.unityBuildPath
      });

      // Check if we have the necessary data
      if (!project.unityBuildPath) {
        alert("❌ This project doesn't have a Unity build configured");
        return;
      }

      const response = await API.post("/projects/launch-build", {
        projectId: project._id,
        unityBuildPath: project.unityBuildPath
      });

      console.log("✅ Backend response:", response.data);

      if (response.data.success) {

      } else {
        alert("❌ Failed to launch build: " + response.data.error);
      }
    } catch (error) {
      console.error("❌ Error launching build:", error);

      if (error.response) {
        console.error("Backend error details:", error.response.data);
        console.error("Backend error status:", error.response.status);
        alert("❌ Server error: " + (error.response.data.error || error.response.data.message));
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("❌ Network error: Could not connect to server.");
      } else {
        alert("❌ Error: " + error.message);
      }
    } finally {
      setLaunchingBuild(false);
    }
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) => {
        const matchesName = p.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || p.category === categoryFilter;
        return matchesName && matchesCategory;
      }),
    [projects, searchTerm, categoryFilter]
  );
  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  useEffect(() => {
    setModelSearchTerm("");
  }, [selectedProject]);
  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await API.get(`/projects/my-projects?userId=${userId}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const urlProjectId = getUrlParam("project");
    const urlModelId = getUrlParam("model");

    if (!urlProjectId) return;

    setRestoring(true);

    const restore = () => {
      const project = projects.find((p) => p._id === urlProjectId);
      if (!project) return;

      setSelectedProject(project);
      setUrlParam("project", project._id);

      if (urlModelId) {
        if (project.modelFileId === urlModelId) {
          openModelPopup(project.modelFileId, project.modelFileName);
        } else {
          const sub = project.subModels?.find((s) => s.fileId === urlModelId);
          if (sub) openModelPopup(sub.fileId, sub.fileName);
        }
      }
    };

    if (projects.length) {
      restore();
      setTimeout(() => setRestoring(false), 120);
    } else {
      const timer = setInterval(() => {
        if (projects.length) {
          clearInterval(timer);
          restore();
          setTimeout(() => setRestoring(false), 120);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [projects]);


 useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && showRedirectOverlay) {
      // User returned to this tab - close the redirect overlay
      console.log("🔙 User returned to main tab - closing redirect overlay");
      setShowRedirectOverlay(false);
      setLaunchingVR(false);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [showRedirectOverlay]);


  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/notifications/user/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [userId]);


  useEffect(() => {
    const viewer = document.getElementById("bg-model-viewer");
    if (viewer && selectedProject?.modelFileId) {
      viewer.src = `http://localhost:5000/api/projects/file/${selectedProject.modelFileId}`;
      viewer.style.opacity = "0";
      viewer.onload = () => viewer.style.opacity = "1";
    }
  }, [selectedProject?.modelFileId]);

  const deleteNotification = async (notificationId) => {
    try {
      await API.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (err) {
      console.error("Failed to delete notification:", err);
      alert("Failed to delete notification.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openModelPopup = async (fileId, fileName) => {
    try {
      setModelLoading(true);
      const url = `http://localhost:5000/api/projects/file/${fileId}`;
      setSelectedModel({ url, name: fileName });

      // ---- SAVE BOTH project AND model in URL ----
      if (selectedProject) {
        setUrlParam("project", selectedProject._id);
      }
      setUrlParam("model", fileId);

      await new Promise((r) => setTimeout(r, 100));
    } catch (e) {
      console.error(e);
    } finally {
      setModelLoading(false);
    }
  };

  const handleZoom = useMemo(() => (delta) => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(3, Math.max(0.5, prevZoom + delta));
      const viewer = document.getElementById("model-viewer-3d");
      if (viewer) {
        requestAnimationFrame(() => {
          try {
            if (viewer.getCameraOrbit) {
              const orbit = viewer.getCameraOrbit();
              const radiusStr = orbit.radius?.toString() || "2.5m";
              const match = radiusStr.match(/([\d.]+)/);
              const radius = match ? parseFloat(match[1]) : 2.5;
              const azimuth = orbit.theta?.deg ?? 0;
              const elevation = orbit.phi?.deg ?? 75;
              const newRadius = Math.max(0.2, Math.min(10, radius * (prevZoom / newZoom)));
              viewer.setAttribute("camera-orbit", `${azimuth}deg ${elevation}deg ${newRadius}m`);
            }
          } catch (error) {
            console.warn("Zoom adjustment failed:", error);
          }
        });
      }
      return newZoom;
    });
  }, []);

  // Pass the full model object when opening VR
  const handleVR = async (model) => {
    if (!model?.url) return;

    const fileId = model.url.split("/").pop();

    console.log("🚀 Launching VR with model:", model);

    // Preload GLTF
    try {
      const { useGLTF } = await import("@react-three/drei");
      useGLTF?.preload?.(model.url);
    } catch (e) {
      console.warn("useGLTF preload not available:", e);
    }

    // Store full model info with proper structure
    const modelToStore = {
      url: model.url,
      name: model.name || "3D Model"
    };

    sessionStorage.setItem("lastModel", JSON.stringify(modelToStore));
    sessionStorage.setItem("shouldReopenPopup", "true");

    console.log("💾 Stored model for restoration:", modelToStore);

    navigate(`/vr-viewer?file=${fileId}`);
  };
  // Fix for restoring modal after VR exit
  // Enhanced VR modal restoration with better timing
  useEffect(() => {
    const restoreModalFromVR = () => {
      const shouldReopen = sessionStorage.getItem("shouldReopenPopup");
      const lastModelStr = sessionStorage.getItem("lastModel");

      console.log("🔍 Checking for VR return:", {
        shouldReopen,
        lastModelStr: lastModelStr ? "exists" : "missing"
      });

      if (shouldReopen === "true" && lastModelStr) {
        try {
          const model = JSON.parse(lastModelStr);
          console.log("🔄 Restoring modal with model:", model);

          // Clear the flags IMMEDIATELY to prevent multiple restorations
          sessionStorage.removeItem("shouldReopenPopup");
          sessionStorage.removeItem("lastModel");

          // Use microtask to ensure React state update happens in the next tick
          Promise.resolve().then(() => {
            setSelectedModel({
              url: model.url,
              name: model.name || "3D Model"
            });
            console.log("✅ Modal restored successfully");
          });

        } catch (error) {
          console.error("❌ Error restoring modal:", error);
          sessionStorage.removeItem("shouldReopenPopup");
          sessionStorage.removeItem("lastModel");
        }
      }
    };

    // Check immediately on mount with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      restoreModalFromVR();
    }, 10);

    // Also check when page becomes visible (back button navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(restoreModalFromVR, 10);
      }
    };

    // Listen for page show event (when page is restored from back/forward cache)
    const handlePageShow = (event) => {
      if (event.persisted) {
        setTimeout(restoreModalFromVR, 10);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener("popstate", restoreModalFromVR);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener("popstate", restoreModalFromVR);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);


  const handleFullScreen = () => {
    const viewer = document.getElementById("model-viewer-3d");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewer?.requestFullscreen?.();
    }
  };

  useEffect(() => {
    if (!vrPopup.open) return;
    let mounted = true;
    const checkVR = async () => {
      if (!mounted) return;
      let xrStatus = null;
      for (let i = 0; i < 10; i++) {
        xrStatus = document.getElementById("xr-status");
        if (xrStatus) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!xrStatus || !mounted) return;
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported("immersive-vr");
          if (supported && mounted) {
            xrStatus.textContent = "✅ Meta Quest 3 detected. Launching Unity VR...";
            fetch("http://localhost:5000/api/system/launch-unity-vr", { method: "POST" })
              .then((r) => r.json())
              .then((data) => {
                if (!mounted) return;
                if (data.success) {
                  xrStatus.textContent = "🚀 Unity VR launched successfully!";
                  if (!vrPopup.fileId) {
                    console.error("❌ No fileId found for VR view.");
                    alert("File ID missing – cannot load model in VR.");
                    return;
                  }
                  window.open(`/vr-viewer?file=${vrPopup.fileId}&type=glb`, "_blank");
                } else {
                  xrStatus.textContent = "⚠️ Unity VR launch failed.";
                  window.open(`/vr-viewer?file=${vrPopup.fileId}&type=glb`, "_blank");
                }
                setTimeout(() => setVrPopup({ open: false, fileId: null }), 1500);
              })
              .catch(() => {
                if (!mounted) return;
                xrStatus.textContent = "⚠️ VR bridge connection failed.";
                window.open(`/vr-viewer?file=${vrPopup.fileId}`, "_blank");
              });
          } else if (mounted) {
            xrStatus.textContent = "❌ No VR headset detected. Connect Meta Quest 3.";
          }
        } catch {
          if (mounted) xrStatus.textContent = "⚠️ VR not supported on this browser.";
        }
      } else if (mounted) {
        xrStatus.textContent = "⚠️ WebXR not available. Use Chrome or Meta Quest Browser.";
      }
    };
    checkVR();
    return () => {
      mounted = false;
    };
  }, [vrPopup.open]);

  return (
    <div className="flex flex-col h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Video Background */}
      {/* <div className="fixed inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn.pixabay.com/video/2023/07/31/173616-851994623_large.mp4" type="video/mp4" />
          <source src="https://www.pexels.com/download/video/3129595/" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-white/40'}`} />
      </div> */}



      <div className="relative z-10 flex flex-col h-full">
        {/* Top Navigation Bar with glassmorphism */}
        <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? 'bg-gray-900/30 border-white/10' : 'bg-white/30 border-black/10'} shadow-lg`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl backdrop-blur-md ${darkMode ? 'bg-purple-600/80' : 'bg-purple-500/80'}`}>
                  <Grid3X3 className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  EdgeVR
                </h1>
              </div>

              {/* Search Bar with glassmorphism */}
              <div className={`relative rounded-xl overflow-hidden max-w-md flex-1 backdrop-blur-xl ${darkMode ? 'bg-white/10 border border-white/20' : 'bg-white/40 border border-black/10'} shadow-lg`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={selectedProject ? "Search models..." : "Search projects..."}
                  value={selectedProject ? modelSearchTerm : searchTerm}
                  onChange={(e) => selectedProject ? setModelSearchTerm(e.target.value) : setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-600'}`}
                />
              </div>
              {!selectedProject && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`rounded-xl px-3 py-3 text-sm backdrop-blur-xl border shadow-lg ${darkMode
                    ? 'bg-[#020617] border-white/20 text-white'
                    : 'bg-white/70 border-black/10 text-gray-900'
                    }`}
                >
                  <option value="all" className={darkMode ? 'bg-[#020617] text-white' : ''}>All Categories</option>
                  <option value="simulators" className={darkMode ? 'bg-[#020617] text-white' : ''}>Simulators</option>
                  <option value="vehicles" className={darkMode ? 'bg-[#020617] text-white' : ''}>Vehicles</option>
                  <option value="weapons" className={darkMode ? 'bg-[#020617] text-white' : ''}>Weapons</option>
                </select>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all backdrop-blur-xl ${darkMode ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-white/40 hover:bg-white/60 border border-black/10'} shadow-lg`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setShowNotifications(true)}
                className={`relative p-3 rounded-xl transition-all backdrop-blur-xl ${darkMode ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-white/40 hover:bg-white/60 border border-black/10'} shadow-lg`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowHelpPopup(true)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 backdrop-blur-xl shadow-lg ${darkMode
                  ? 'bg-green-600/80 hover:bg-green-700/80 border border-green-500/30'
                  : 'bg-green-500/80 hover:bg-green-600/80 border border-green-400/30'
                  } text-white`}
              >
                <Mail size={18} />
                Get Help
              </button>

              {/* Profile Icon */}
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className={`p-3 rounded-xl transition-all backdrop-blur-xl ${darkMode ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-white/40 hover:bg-white/60 border border-black/10'} shadow-lg`}
              >
                <User size={20} />
              </button>

              {/* Profile Dropdown with glassmorphism */}
              {showProfileMenu && (
                <div
                  className={`absolute right-6 top-20 w-56 rounded-lg shadow-2xl p-3 z-50 backdrop-blur-xl ${darkMode ? 'bg-gray-900/80 border border-white/10' : 'bg-white/80 border border-black/10'
                    }`}
                >
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Logged in as:</strong> <br />
                    <span className="text-xs">{localStorage.getItem("email") || "user@edgevr.com"}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover:bg-red-600/80 hover:text-white transition backdrop-blur-md"
                  >
                    <span>Logout</span>
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 flex-1 overflow-y-auto">
          {restoring && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="animate-spin text-purple-500 mb-4" size={40} />
              <p className="text-lg font-medium text-purple-400">Restoring view…</p>
            </div>
          )}
          {selectedProject ? (
            /* Project Details View */
            <div className="flex flex-col min-h-full">
              {/* Background with blurred model preview */}
              {selectedProject.modelFileId && (
                <div className="fixed inset-0 z-0 opacity-30">
                  <div className={`absolute inset-0 ${darkMode ? 'bg-black/20' : 'bg-white/15'}`} />
                </div>
              )}

              <div className="relative z-10">
                {/* Project Header with glassmorphism */}
                <div
                  className={`mb-8 p-6 rounded-2xl backdrop-blur-xl ${darkMode
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/40 border border-black/10"
                    } shadow-2xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {selectedProject.name}
                      </h2>
                      <p className={`text-sm mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {selectedProject.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md ${darkMode
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-purple-100/50 text-purple-700"
                          }`}
                      >
                        {selectedProject.category}
                      </div>

                      {/* Launch Build Button for Simulators */}

                      {selectedProject.category === "simulators" && selectedProject.unityBuildPath && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => launchBuildExecutable(selectedProject)}
                            disabled={launchingBuild}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 backdrop-blur-xl shadow-lg ${launchingBuild
                              ? "bg-gray-500/80 cursor-not-allowed"
                              : darkMode
                                ? "bg-blue-600/80 hover:bg-blue-700/80 border border-blue-500/30"
                                : "bg-blue-500/80 hover:bg-blue-600/80 border border-blue-400/30"
                              } text-white`}
                          >
                            {launchingBuild ? (
                              <>
                                <Loader className="animate-spin" size={18} />
                                Launching...
                              </>
                            ) : (
                              <>
                                <Monitor size={18} />
                                Launch Build
                              </>
                            )}
                          </button>

                          {/* Add this View in VR button */}
                          <button
                            onClick={handleSimulatorVR}
                            disabled={launchingVR}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 backdrop-blur-xl shadow-lg ${launchingVR
                              ? "bg-gray-500/80 cursor-not-allowed"
                              : darkMode
                                ? "bg-green-600/80 hover:bg-green-700/80 border border-green-500/30"
                                : "bg-green-500/80 hover:bg-green-600/80 border border-green-400/30"
                              } text-white`}
                          >
                            {launchingVR ? (
                              <>
                                <Loader className="animate-spin" size={18} />
                                Launching...
                              </>
                            ) : (
                              <>
                                <Play size={18} />
                                View in VR
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3D Models Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    if (!selectedProject.modelFileId) return null;
                    const q = modelSearchTerm.trim().toLowerCase();
                    const candidates = [
                      'main model',
                      selectedProject.modelName || '',
                      selectedProject.modelFileName || ''
                    ].map((s) => s.toLowerCase());
                    const matches = !q || candidates.some((s) => s && s.includes(q));
                    if (!matches) return null;
                    return (
                      <ModelCard
                        model={selectedProject}
                        onClick={() => openModelPopup(selectedProject.modelFileId, selectedProject.modelFileName)}
                        darkMode={darkMode}
                        isMain={true}
                      />
                    );
                  })()}

                  {selectedProject.modelFileId && (
                    <ModelCard
                      model={selectedProject}
                      onClick={() =>
                        openModelPopup(
                          selectedProject.modelFileId,
                          selectedProject.modelFileName
                        )
                      }
                      darkMode={darkMode}
                      isMain={true}
                    />
                  )}

                  {selectedProject.subModels?.map((subModel, index) => (
                    <ModelCard
                      key={index}
                      model={subModel}
                      onClick={() =>
                        openModelPopup(subModel.fileId, subModel.fileName)
                      }
                      darkMode={darkMode}
                      isMain={false}
                    />
                  ))}
                </div>
                {showRedirectOverlay && (
                  <RedirectOverlay
                    darkMode={darkMode}
                    onClose={handleRedirectCancel}
                  />
                )}
                {showVRGuide && (
                  <VRConnectionGuide
                    darkMode={darkMode}
                    onClose={handleVRGuideClose}
                    onConfirm={handleVRGuideConfirm}
                    onRedirect={handleVRGuideConfirm} // Use the same handler for both buttons
                    loading={launchingVR}
                  />
                )}
                {/* Empty State */}
                {!selectedProject.modelFileId &&
                  (!selectedProject.subModels ||
                    selectedProject.subModels.length === 0) && (
                    <div
                      className={`text-center py-12 rounded-2xl backdrop-blur-xl ${darkMode ? "bg-white/5" : "bg-white/20"
                        }`}
                    >
                      <Grid3X3
                        className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"
                          }`}
                        size={64}
                      />
                      <h3 className="text-xl font-bold mb-2">No 3D Models</h3>
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        This project doesn't contain any 3D models yet.
                      </p>
                    </div>
                  )}

                {/* Back Button */}
                <div className="fixed bottom-8 right-8 z-20">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setUrlParam("project", null);
                      setUrlParam("model", null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 backdrop-blur-xl shadow-lg ${darkMode
                      ? "bg-white/10 hover:bg-white/20 border border-white/20"
                      : "bg-white/40 hover:bg-white/60 border border-black/10"
                      }`}
                  >
                    <ChevronLeft size={14} />
                    Back to Projects
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader className="animate-spin text-purple-500" size={32} />
                </div>
              ) : currentProjects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProjects.map((project) => (
                      <div
                        key={project._id}
                        className={`relative rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl p-4 transition-all hover:scale-[1.02] ${darkMode
                          ? "bg-white/10 border border-white/20 hover:border-purple-500/40"
                          : "bg-white/60 border border-black/10 hover:border-purple-400/60"
                          }`}
                      >
                        {/* 3D Preview of Main Model */}
                        {project.modelFileId ? (
                          <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-900 flex items-center justify-center">
                            <model-viewer
                              src={`http://localhost:5000/api/projects/file/${project.modelFileId}`}
                              alt={project.name}
                              camera-controls
                              camera-orbit="0deg 75deg 2.5m"
                              interaction-prompt="none"
                              style={{
                                width: '120%',
                                height: '100%',
                                backgroundColor: darkMode ? '#1a1a1a' : '#f8fafc',
                              }}
                              loading="eager"
                              reveal="auto"
                            ></model-viewer>
                          </div>
                        ) : (
                          <div className={`w-full h-48 flex flex-col items-center justify-center rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'
                            } text-gray-500 mb-4`}>
                            <Grid3X3 size={48} className="mb-2 opacity-50" />
                            <span className="text-sm">No 3D Model</span>
                          </div>
                        )}

                        {/* Project Name */}
                        <h3 className="text-lg font-semibold mb-2 truncate text-gray-900 dark:text-white">
                          {project.name}
                        </h3>

                        {/* Project Description (2 lines only) */}
                        <p
                          className={`text-sm mb-4 line-clamp-2 min-h-[2.5rem] ${darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          {project.description || "No description available."}
                        </p>

                        {/* Project Stats */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${darkMode
                            ? project.category === "simulators"
                              ? "bg-green-900/50 text-green-300"
                              : "bg-purple-900/50 text-purple-300"
                            : project.category === "simulators"
                              ? "bg-green-100/50 text-green-700"
                              : "bg-purple-100/50 text-purple-700"
                            }`}
                          >
                            {project.category}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100/50 text-blue-700'}`}>
                            {project.subModels?.length || 0} models
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setUrlParam("project", project._id);
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${darkMode
                              ? "bg-purple-600/80 hover:bg-purple-700/80 text-white border border-purple-500/30"
                              : "bg-purple-500/80 hover:bg-purple-600/80 text-white border border-purple-400/30"
                              }`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div
                  className={`text-center py-16 rounded-2xl backdrop-blur-xl ${darkMode
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/40 border border-black/10"
                    } shadow-2xl`}
                >
                  <FolderPlus
                    className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    size={64}
                  />
                  <h2 className="text-2xl font-bold mb-2">No Projects Found</h2>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No projects available in your account"}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>




      {restoringFromVR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <Loader className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              Restoring 3D Model...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Returning from VR experience
            </p>
          </div>
        </div>
      )}
      {/* 3D Model Viewer Modal with glassmorphism */}
      {selectedModel && (

        <div key={`modal-${selectedModel.url}`} className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 backdrop-blur-sm ${darkMode ? 'bg-black/70' : 'bg-white/70'}`}>
          <div
            className={`relative rounded-3xl shadow-2xl w-[95vw] h-[90vh] overflow-hidden flex transition-colors duration-300 backdrop-blur-2xl border ${darkMode
              ? 'bg-gray-900/50 border-purple-500/30'
              : 'bg-white/50 border-gray-300'
              }`}
          >
            <button
              onClick={() => {
                setSelectedModel(null);
                setZoom(1);
                setUrlParam("model", null);
              }}
              className={`absolute top-4 right-4 z-50 p-3 rounded-full transition-colors backdrop-blur-xl shadow-lg ${darkMode
                ? 'bg-gray-800/80 hover:bg-red-600/80 text-white border border-white/20'
                : 'bg-white/80 hover:bg-red-500/80 text-gray-800 hover:text-white border border-black/10'
                }`}
            >
              <X size={20} />
            </button>

            {/* 3D Viewer */}
            <div className="flex-1 relative overflow-hidden rounded-l-3xl">
              {modelLoading && (
                <div
                  className={`absolute inset-0 flex items-center justify-center text-lg font-semibold transition-colors duration-300 z-10 backdrop-blur-xl ${darkMode ? 'bg-black/80 text-purple-400' : 'bg-white/80 text-purple-600'
                    }`}
                >
                  <div className="text-center">
                    <Loader className="w-16 h-16 animate-spin mx-auto mb-4 text-purple-500" />
                    Loading 3D Model...
                  </div>
                </div>
              )}

              {selectedModel.url.endsWith('.fbx') ? (
                <FBXViewer fileUrl={selectedModel.url} zoom={zoom} darkMode={darkMode} />
              ) : (
                <model-viewer
                  id="model-viewer-3d"
                  src={selectedModel.url}
                  alt="3D Model"
                  camera-controls
                  auto-rotate
                  xr-environment
                  ar
                  camera-target="0m 0m 0m"
                  interaction-prompt="none"
                  onLoad={() => setModelLoading(false)}
                  onError={() => setModelLoading(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: darkMode ? 'transparent' : '#fff',
                  }}
                ></model-viewer>
              )}

              {/* Control Buttons with glassmorphism */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-50">
                <button
                  onClick={() => handleZoom(0.2)}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-xl ${darkMode ? 'bg-purple-600/80 hover:bg-purple-700/80 border border-purple-500/30' : 'bg-purple-500/80 hover:bg-purple-600/80 border border-purple-400/30'
                    } text-white`}
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-xl ${darkMode ? 'bg-purple-600/80 hover:bg-purple-700/80 border border-purple-500/30' : 'bg-purple-500/80 hover:bg-purple-600/80 border border-purple-400/30'
                    } text-white`}
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={() => {
                    const viewer = document.getElementById('model-viewer-3d');
                    if (viewer) {
                      const isAuto = viewer.getAttribute('auto-rotate') !== null;
                      if (isAuto) {
                        viewer.removeAttribute('auto-rotate');
                      } else {
                        viewer.setAttribute('auto-rotate', '');
                      }
                    }
                  }}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-xl ${darkMode ? 'bg-blue-600/80 hover:bg-blue-700/80 border border-blue-500/30' : 'bg-blue-500/80 hover:bg-blue-600/80 border border-blue-400/30'
                    } text-white`}
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleVR(selectedModel)}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-xl ${darkMode
                    ? 'bg-green-600/80 hover:bg-green-700/80 border border-green-500/30'
                    : 'bg-green-500/80 hover:bg-green-600/80 border border-green-400/30'
                    } text-white`}
                >
                  <View size={20} />
                </button>

                <button
                  onClick={handleFullScreen}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-xl ${darkMode ? 'bg-gray-700/80 hover:bg-gray-800/80 border border-gray-600/30' : 'bg-gray-600/80 hover:bg-gray-700/80 border border-gray-500/30'
                    } text-white`}
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>

            {/* Right Description Panel */}
            {selectedModel && (
              <RightDescriptionPanel
                selectedProject={{
                  name: selectedModel.name || selectedProject?.name || "3D Model",
                  description:
                    selectedProject?.subModels?.find(
                      (s) => s.fileId === selectedModel.url?.split("/").pop()
                    )?.description ||
                    (selectedProject?.modelFileId?.toString() ===
                      selectedModel.url?.split("/").pop()
                      ? selectedProject?.description
                      : "No description available."),
                  darkMode,
                }}
              />
            )}

          </div>
        </div>
      )}

      {/* VR Popup with glassmorphism */}
      {vrPopup.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[60]">
          <div className="backdrop-blur-2xl bg-gray-900/80 border border-purple-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full relative text-white">
            <button
              onClick={() => setVrPopup({ open: false, fileId: null })}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">
              Virtual Reality Experience
            </h2>
            <div
              id="xr-status"
              className="text-center text-gray-300 mb-6 flex flex-col items-center"
            >
              <Loader className="w-8 h-8 animate-spin mb-3 text-purple-500" />
              Checking for VR headset...
            </div>
            <div className="text-sm text-gray-400 mt-4 border-t border-purple-800 pt-4">
              <p className="font-semibold text-purple-300 mb-2">On Meta Quest 3:</p>
              <ul className="list-disc ml-5 text-left space-y-1">
                <li>Connect via Oculus Link (USB or Air Link)</li>
                <li>Or open this site in the Meta Browser (HTTPS)</li>
                <li>VR will launch automatically when detected</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal with glassmorphism */}
      {showNotifications && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className={`w-[400px] max-h-[70vh] overflow-y-auto backdrop-blur-2xl border shadow-2xl rounded-xl p-6 relative ${darkMode ? 'bg-gray-900/80 border-white/10' : 'bg-white/80 border-black/10'
            }`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notifications</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className={`flex justify-between items-start backdrop-blur-md border px-4 py-3 rounded-lg hover:shadow-sm transition ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-gray-50/50 border-black/5'
                      }`}
                  >
                    <div className="pr-3">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : "No date"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNotification(n._id)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      title="Delete"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Help Popup with glassmorphism */}
      {showHelpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[70] p-4">
          <div className={`backdrop-blur-2xl rounded-2xl shadow-xl w-full max-w-lg h-[600px] p-6 flex flex-col gap-4 relative ${darkMode ? 'bg-gray-900/80 border border-white/10' : 'bg-white/80 border border-black/10'
            }`}>

            {/* Close Button */}
            <button
              onClick={() => setShowHelpPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
            >
              ✕
            </button>

            {/* Header */}
            <div className={`flex items-center gap-2 border-b pb-3 mb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Mail size={20} className="text-green-500" />
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                New Help Request
              </h2>
            </div>

            {/* Resolved Badge */}
            {selectedProject?.helpResolved && (
              <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-2 mx-auto">
                <CheckCircle size={16} /> Problem Resolved
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const defaultAdminEmail = "defaultadmin@example.com";
                if (!helpForm.projectId) {
                  alert("⚠️ Please select a project before submitting a help request.");
                  return;
                }
                const formData = new FormData();
                formData.append("projectId", helpForm.projectId);
                formData.append("userId", localStorage.getItem("userId"));
                formData.append("to", helpForm.to || defaultAdminEmail);
                formData.append("from", helpForm.from);
                formData.append("subject", helpForm.subject);
                formData.append("message", helpForm.message);
                helpForm.attachments.forEach((file) =>
                  formData.append("attachments", file)
                );
                try {
                  await API.post("/help/create", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  alert("✅ Help request submitted!");
                  setShowHelpPopup(false);
                } catch (err) {
                  console.error(err);
                  alert("❌ Failed to send help request.");
                }
              }}
              className="flex flex-col gap-4 flex-1 overflow-hidden"
            >
              {/* Project Selection */}
              <div className="flex flex-col gap-1">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select Project
                </label>
                {projects.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    No projects found. Please wait or add one first.
                  </p>
                ) : (
                  <select
                    value={helpForm.projectId || ""}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedProj = projects.find((p) => p._id === selectedId);
                      setHelpForm({
                        ...helpForm,
                        projectId: selectedId,
                        to:
                          selectedProj?.createdBy?.email ||
                          selectedProj?.adminEmail ||
                          "defaultadmin@example.com",
                      });
                    }}
                    className={`w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-green-400 ${darkMode ? 'bg-gray-800/50 border-white/10 text-gray-200' : 'bg-white/50 border-black/10 text-gray-800'
                      }`}
                  >
                    <option value="">-- Choose a project --</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name || project.title}
                      </option>
                    ))}
                  </select>
                )}
                {!helpForm.projectId && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ Please select a project before submitting.
                  </p>
                )}
              </div>

              {/* To */}
              <div className="flex items-center gap-4">
                <label className={`text-sm font-medium w-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>To:</label>
                <input
                  type="email"
                  value={helpForm.to || "defaultadmin@example.com"}
                  readOnly
                  className={`flex-1 border-b py-2 focus:outline-none focus:border-green-500 bg-transparent ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'
                    }`}
                />
              </div>

              {/* From */}
              <div className="flex items-center gap-4">
                <label className={`text-sm font-medium w-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>From:</label>
                <input
                  type="email"
                  value={helpForm.from}
                  readOnly
                  className={`flex-1 border-b py-2 focus:outline-none focus:border-green-500 bg-transparent ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'
                    }`}
                />
              </div>

              {/* Subject */}
              <div className="flex items-center gap-4">
                <label className={`text-sm font-medium w-16 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subject</label>
                <input
                  type="text"
                  value={helpForm.subject}
                  onChange={(e) =>
                    setHelpForm({ ...helpForm, subject: e.target.value })
                  }
                  placeholder="Enter subject…"
                  required
                  className={`flex-1 border-b py-2 focus:outline-none focus:border-green-500 bg-transparent ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'
                    }`}
                />
              </div>

              {/* Message Box */}
              <div className="flex flex-col gap-1">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Write your message…</label>
                <textarea
                  value={helpForm.message}
                  onChange={(e) =>
                    setHelpForm({ ...helpForm, message: e.target.value })
                  }
                  placeholder="Describe your issue…"
                  required
                  className={`w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-green-400 resize-none h-32 ${darkMode ? 'bg-gray-800/50 border-white/10 text-gray-200' : 'bg-white/50 border-black/10 text-gray-800'
                    }`}
                ></textarea>
              </div>

              {/* Attachment Upload */}
              <div className="flex flex-col mt-2">
                <label className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-green-500 transition">
                  <Paperclip size={18} />
                  Attach files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setHelpForm({
                        ...helpForm,
                        attachments: [
                          ...(helpForm.attachments || []),
                          ...Array.from(e.target.files),
                        ],
                      })
                    }
                  />
                </label>

                {helpForm.attachments?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 overflow-y-auto max-h-24">
                    {helpForm.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        <span className="truncate max-w-[85%]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setHelpForm({
                              ...helpForm,
                              attachments: helpForm.attachments.filter((_, i) => i !== idx),
                            })
                          }
                          className="hover:text-red-500 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fixed Send Button */}
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-lg z-50">
                <button
                  type="submit"
                  disabled={!helpForm.projectId}
                  className={`font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors w-full backdrop-blur-xl shadow-lg ${helpForm.projectId
                    ? "bg-green-500/80 hover:bg-green-600/80 text-white border border-green-400/30"
                    : "bg-gray-400/80 text-gray-700 cursor-not-allowed border border-gray-300/30"
                    }`}
                >
                  <Send size={16} /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}