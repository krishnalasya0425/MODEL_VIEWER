// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* -------- HEADER (Sticky) -------- */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           {/* Left: EdgeVR Logo */}
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           {/* Middle: Search Bar */}
//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           {/* Right: Icons */}
//           <div className="flex items-center space-x-5">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>
//             <button className="text-gray-600 hover:text-blue-600">
//               <User className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* -------- MAIN CONTENT (Scrollable) -------- */}
//       <main className="flex-1 overflow-y-auto p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Projects List */}
//         <div className="space-y-4">
//           {projects.length > 0 ? (
//             projects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects assigned.</p>
//           )}
//         </div>

//         {/* -------- MODEL VIEWER -------- */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             <h3 className="font-semibold mb-3 text-gray-800">Model Viewer:</h3>
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer fileUrl={viewFile} />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// with styles vijay file is viisble but slow

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User, LogOut } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//     }
//   };

//   // Filter projects by search term
//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* -------- HEADER (Sticky) -------- */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           {/* Left: EdgeVR Logo */}
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           {/* Middle: Search Bar */}
//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           {/* Right: Icons */}
//           <div className="flex items-center space-x-5 relative">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>

//             {/* Profile Icon with Logout */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="text-gray-600 hover:text-blue-600"
//               >
//                 <User className="w-5 h-5" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded"
//                   >
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* -------- MAIN CONTENT (Scrollable) -------- */}
//       <main className="flex-1 overflow-auto p-8">

//         {/* Projects List */}
//         <div className="space-y-4">
//           {filteredProjects.length > 0 ? (
//             filteredProjects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects found.</p>
//           )}
//         </div>

//         {/* -------- MODEL VIEWER -------- */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             <h3 className="font-semibold mb-3 text-gray-800">Model Viewer:</h3>
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer fileUrl={viewFile} />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
//without vr working
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User, LogOut } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [loadingModel, setLoadingModel] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       setLoadingModel(true);

//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);

//       // Max 10 seconds fallback
//       setTimeout(() => setLoadingModel(false), 10000);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//       setLoadingModel(false);
//     }
//   };

//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           <div className="flex items-center space-x-5 relative">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>

//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="text-gray-600 hover:text-blue-600"
//               >
//                 <User className="w-5 h-5" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded"
//                   >
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-auto p-8">
//         <div className="space-y-4">
//           {filteredProjects.length > 0 ? (
//             filteredProjects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects found.</p>
//           )}
//         </div>

//         {/* MODEL VIEWER */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             {loadingModel && (
//               <div className="text-center font-semibold text-gray-700 mb-3">
//                 Loading model...
//               </div>
//             )}
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer
//                 fileUrl={viewFile}
//                 onLoad={() => setLoadingModel(false)}
//               />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 onLoad={() => setLoadingModel(false)}
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//                 setLoadingModel(false);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
//model is displaying in vr with textures 
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User, LogOut } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [loadingModel, setLoadingModel] = useState(false);
//   const [vrPopup, setVrPopup] = useState({ open: false, fileId: null });

//   // ✅ Updated: Auto-launch VR when Meta Quest 3 is detected
// useEffect(() => {
//   if (!vrPopup.open) return;

//   const checkVR = async () => {
//     // Wait until popup DOM renders
//     let xrStatus = null;
//     for (let i = 0; i < 10; i++) {
//       xrStatus = document.getElementById("xr-status");
//       if (xrStatus) break;
//       await new Promise((r) => setTimeout(r, 100)); // wait 100ms
//     }
//     if (!xrStatus) return; // still not found, exit safely

//   if (navigator.xr) {
//   try {
//     const supported = await navigator.xr.isSessionSupported("immersive-vr");
//     if (supported) {
//       xrStatus.textContent = "✅ Meta Quest 3 detected. Launching Unity VR...";

//       // 🔹 Call backend to launch Unity executable
//   fetch("http://localhost:5000/api/system/launch-unity-vr", { method: "POST" })
//   .then((r) => r.json())
//   .then((data) => {
//     if (data.success) {
//   xrStatus.textContent = "🚀 Unity VR launched successfully!";

//   // ✅ Debug + safe guard
//   if (!vrPopup.fileId) {
//     console.error("❌ No fileId found for VR view. Popup state:", vrPopup);
//     alert("File ID missing — cannot load model in VR.");
//     return;
//   }

// console.log("Launching VR for file:", vrPopup.fileId);
// window.open(`/vr-viewer?file=${vrPopup.fileId}&type=glb`, "_blank");

// }
//  else {
//       xrStatus.textContent = "⚠️ Unity VR launch failed.";
//       window.open(`/vr-viewer?file=${vrPopup.fileId}&type=glb`, "_blank");
//     }
//     setTimeout(() => setVrPopup({ open: false, fileId: null }), 1500);
//   })

//         .catch(() => {
//           xrStatus.textContent = "⚠️ VR bridge connection failed.";
//           window.open(`/vr-viewer?file=${vrPopup.fileId}`, "_blank");
//         });
//     } else {
//       xrStatus.textContent = "❌ No VR headset detected. Connect Meta Quest 3.";
//     }
//   } catch {
//     xrStatus.textContent = "⚠️ VR not supported on this browser.";
//   }
// }

//   };

//   checkVR();
// }, [vrPopup.open]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       setLoadingModel(true);
//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);
//       setTimeout(() => setLoadingModel(false), 10000);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//       setLoadingModel(false);
//     }
//   };

//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           <div className="flex items-center space-x-5 relative">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>

//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="text-gray-600 hover:text-blue-600"
//               >
//                 <User className="w-5 h-5" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded"
//                   >
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-auto p-8">
//         <div className="space-y-4">
//           {filteredProjects.length > 0 ? (
//             filteredProjects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                     <button

//                       onClick={() => setVrPopup({ open: true, fileId: p.modelFileId.toString() })}
//                       className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
//                     >
//                       View in VR
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects found.</p>
//           )}
//         </div>

//         {/* MODEL VIEWER */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             {loadingModel && (
//               <div className="text-center font-semibold text-gray-700 mb-3">
//                 Loading model...
//               </div>
//             )}
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer fileUrl={viewFile} onLoad={() => setLoadingModel(false)} />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 onLoad={() => setLoadingModel(false)}
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//                 setLoadingModel(false);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>

//             {/* ✅ VR Popup (auto-launch when detected) */}
//             {vrPopup.open && (
//               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//                 <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
//                   <button
//                     onClick={() => setVrPopup({ open: false, fileId: null })}
//                     className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
//                   >
//                     ✕
//                   </button>

//                   <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
//                     View This Model in Virtual Reality
//                   </h2>

//                   <div
//                     id="xr-status"
//                     className="text-center text-gray-700 mb-4 flex flex-col items-center"
//                   >
//                     <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
//                     Checking for connected VR headset...
//                   </div>

//                   <div className="text-sm text-gray-600 mt-3 border-t pt-3">
//                     <p><strong>On Meta Quest 3:</strong></p>
//                     <ul className="list-disc ml-5 text-left">
//                       <li>Make sure your Quest 3 is connected via Oculus Link (USB or Air Link)</li>
//                       <li>Or open this site in the Meta Browser (via HTTPS)</li>
//                       <li>VR will launch automatically when detected</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User, LogOut, ZoomIn, ZoomOut, Eye, View, Maximize } from "lucide-react"; // ✅ added Maximize icon


// function RightDescriptionPanel({ selectedProject }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   if (!selectedProject) return null;

//   const desc = selectedProject.description || "No description available.";
//   const shortDesc = desc.length > 300 ? desc.slice(0, 300) + "..." : desc;

//   return (
//     <div
//       className={`transition-all duration-500 ${
//         collapsed ? "w-6" : "w-96"
//       } bg-black/60 border-l border-purple-700 h-full relative flex flex-col`}
//     >
//       {/* Collapse/Expand Button */}
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white rounded-full p-1"
//       >
//         {collapsed ? ">" : "<"}
//       </button>

//       {/* Description Content */}
//       {!collapsed && (
//         <div className="p-6 text-gray-200 overflow-y-auto">
//           <h3 className="text-purple-400 text-lg font-semibold mb-3">
//             {selectedProject.name}
//           </h3>
//           <p className="text-sm leading-relaxed text-gray-300">
//             {expanded ? desc : shortDesc}
//           </p>

//           {desc.length > 300 && (
//             <button
//               onClick={() => setExpanded(!expanded)}
//               className="mt-4 text-purple-400 hover:text-purple-300 text-sm underline"
//             >
//               {expanded ? "View Less" : "View More"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedModel, setSelectedModel] = useState(null);
//   const [zoom, setZoom] = useState(1);
//   const [vrPopup, setVrPopup] = useState({ open: false, fileId: null });
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   // Fetch projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;
//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const openModelPopup = (fileId, fileName) => {
//     const url = `http://localhost:5000/api/projects/file/${fileId}`;
//     setSelectedModel({ url, name: fileName });
//   };

//   const handleZoom = (delta) => {
//     setZoom((z) => Math.min(3, Math.max(0.5, z + delta)));
//   };

//   const handleVR = (fileId) => {
//     setVrPopup({ open: true, fileId });
//   };

//   // ✅ Handle fullscreen
//   const handleFullScreen = () => {
//     const viewer = document.getElementById("model-viewer-3d");
//     const container = document.fullscreenElement
//       ? document.exitFullscreen()
//       : viewer?.requestFullscreen?.();
//   };

//   // Auto VR detection logic (unchanged)
// useEffect(() => {
//   if (!vrPopup.open) return;

//   const checkVR = async () => {
//     const xrStatus = document.getElementById("xr-status");
//     if (!xrStatus) return;

//     if (!navigator.xr) {
//       xrStatus.innerHTML = `
//         <div class="text-center text-yellow-400">
//           ⚠️ WebXR not available.<br/>Use Chrome or Meta Quest Browser.
//         </div>`;
//       return;
//     }

//     try {
//       const supported = await navigator.xr.isSessionSupported("immersive-vr");

//       if (supported) {
//         // ✅ Show connection message + button
//         xrStatus.innerHTML = `
//           <div class="text-center flex flex-col items-center">
//             <div class="text-green-400 text-lg font-semibold mb-2">✅ Meta Quest 3 Connected</div>
//             <p class="text-gray-300 mb-3">Ready to explore in Virtual Reality!</p>
//             <button id="launch-vr-btn"
//               class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold shadow-lg">
//               Enter VR Mode
//             </button>
//             <p class="text-xs text-gray-400 mt-2">Works with Meta Quest / WebXR-enabled browsers</p>
//           </div>
//         `;

//         // ✅ Handle "Enter VR Mode" click
//         document.getElementById("launch-vr-btn").onclick = async () => {
//           xrStatus.innerHTML = `
//             <div class="text-gray-300 text-center">
//               <div class="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
//               Launching immersive view...
//             </div>`;

//           const viewer = document.querySelector("model-viewer");
//           if (!viewer) {
//             xrStatus.innerHTML = `<div class="text-red-400 text-center">❌ Model viewer not found.</div>`;
//             return;
//           }

//           try {
//             // ✅ model-viewer built-in VR activation (works for both Quest and desktop)
//             if (typeof viewer.activateAR === "function") {
//               await viewer.activateAR();
//               xrStatus.innerHTML = `
//                 <div class="text-center flex flex-col items-center">
//                   <div class="text-green-400 text-lg font-semibold mb-2">🟢 Immersive VR Session Active</div>
//                   <p class="text-gray-300">Move your headset to explore the model in 3D space.</p>
//                 </div>`;
//             } else {
//               xrStatus.innerHTML = `
//                 <div class="text-center text-red-400">
//                   ⚠️ VR not supported by this viewer build.
//                 </div>`;
//             }
//           } catch (err) {
//             xrStatus.innerHTML = `
//               <div class="text-center text-red-400">
//                 ⚠️ Failed to start immersive session.<br/>
//                 ${err.message || err.name}
//               </div>`;
//           }
//         };
//       } else {
//         xrStatus.innerHTML = `
//           <div class="text-center text-red-400">
//             ❌ No VR headset detected.<br/>Connect Meta Quest 3 via Link or Air Link.
//           </div>`;
//       }
//     } catch (err) {
//       xrStatus.innerHTML = `
//         <div class="text-center text-yellow-400">
//           ⚠️ WebXR not supported.<br/>Use Chrome or Meta Quest Browser.
//         </div>`;
//     }
//   };

//   checkVR();
// }, [vrPopup.open]);



//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-black/40 backdrop-blur-lg border-r border-purple-800 flex flex-col">
//         <div className="p-4 text-center border-b border-purple-800 text-purple-400 font-bold text-xl">
//           My Projects
//         </div>
//         <div className="flex-1 overflow-auto">
//           {projects.length > 0 ? (
//             projects.map((p) => (
//               <div
//                 key={p._id}
//                 onClick={() => setSelectedProject(p)}
//                 className={`cursor-pointer px-4 py-3 border-b border-purple-800 hover:bg-purple-800/30 transition ${
//                   selectedProject?._id === p._id ? "bg-purple-900/50" : ""
//                 }`}
//               >
//                 <span className="font-semibold">{p.name}</span>
//               </div>
//             ))
//           ) : (
//             <p className="p-4 text-gray-400">No projects found.</p>
//           )}
//         </div>
//         <div className="p-3 border-t border-purple-800 flex justify-between items-center">
//           <Bell className="w-5 h-5 text-purple-400" />
//           <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
//             <User className="w-5 h-5 text-purple-400" />
//           </button>
//           {showProfileMenu && (
//             <div className="absolute bottom-16 right-4 bg-black/90 border border-purple-700 rounded-lg shadow-lg">
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-purple-700 hover:text-white rounded"
//               >
//                 <LogOut className="w-4 h-4" /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* MAIN AREA */}
//       <main className="flex-1 p-8 overflow-auto">
//         {!selectedProject && (
//           <p className="text-center text-gray-300">Select a project from the sidebar.</p>
//         )}

//         {selectedProject && (
//           <>
//             <h2 className="text-2xl font-bold text-purple-300 mb-4">
//               {selectedProject.name}
//             </h2>
//             <p className="text-gray-400 mb-6">{selectedProject.description}</p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Main model */}
//               {selectedProject.modelFileId && (
//                 <div
//                   className="bg-black/50 border border-purple-700 rounded-xl p-4 hover:shadow-purple-500/40 hover:scale-[1.02] transition cursor-pointer"
//                   onClick={() =>
//                     openModelPopup(selectedProject.modelFileId, selectedProject.modelFileName)
//                   }
//                 >
//                   <h3 className="text-purple-300 font-semibold mb-2">Main Model</h3>
//                 </div>
//               )}

//               {/* Submodels */}
//               {selectedProject.subModels?.map((s, i) => (
//                 <div
//                   key={i}
//                   className="bg-black/50 border border-purple-700 rounded-xl p-4 hover:shadow-purple-500/40 hover:scale-[1.02] transition cursor-pointer"
//                   onClick={() => openModelPopup(s.fileId, s.fileName)}
//                 >
//                   <h3 className="text-purple-300 font-semibold mb-2">{s.name}</h3>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </main>

//       {/* POPUP MODEL VIEWER */}
// {/* POPUP MODEL VIEWER */}
// {selectedModel && (
//   <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//     <div className="relative bg-gradient-to-br from-black via-gray-900 to-black border border-purple-700 rounded-2xl shadow-2xl w-[90vw] h-[85vh] overflow-hidden flex">

//       {/* Close button */}
//       <button
//         onClick={() => {
//           setSelectedModel(null);
//           setZoom(1);
//         }}
//         className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl z-50"
//       >
//         ✕
//       </button>

//       {/* ===== LEFT SIDE: MODEL VIEWER ===== */}
//       <div className="flex-1 relative bg-black overflow-hidden rounded-l-2xl">
//         {selectedModel.url.endsWith(".fbx") ? (
//           <FBXViewer fileUrl={selectedModel.url} />
//         ) : (
// <model-viewer
//   id="model-viewer-3d"
//   src={selectedModel.url}
//   alt="3D Model"
//   camera-controls
//   auto-rotate
//   ar
//   ar-modes="webxr scene-viewer quick-look"
//   xr-environment
//   vr-modes="webxr"
//   style={{
//     width: "100%",
//     height: "100%",
//     backgroundColor: "transparent",
//   }}
// ></model-viewer>


//         )}

//         {/* Floating Controls */}
//         <div className="absolute bottom-5 right-5 flex gap-3 z-50">
//           <button
//             onClick={() => handleZoom(0.2)}
//             title="Zoom In"
//             className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-md"
//           >
//             <ZoomIn size={20} />
//           </button>

//           <button
//             onClick={() => handleZoom(-0.2)}
//             title="Zoom Out"
//             className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-md"
//           >
//             <ZoomOut size={20} />
//           </button>

//           <button
//             onClick={() => {
//               const viewer = document.getElementById("model-viewer-3d");
//               if (viewer) {
//                 const isAuto = viewer.getAttribute("auto-rotate") !== null;
//                 if (isAuto) {
//                   viewer.removeAttribute("auto-rotate");
//                   viewer.cameraOrbit = "0deg 75deg 2.5m";
//                 } else {
//                   viewer.setAttribute("auto-rotate", "");
//                 }
//               }
//             }}
//             title="Toggle 3D Mode"
//             className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-md"
//           >
//             <Eye size={20} />
//           </button>

//           <button
//             onClick={() => handleVR(selectedModel.url.split('/').pop())}
//             title="View in VR"
//             className="bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-md"
//           >
//             <View size={20} />
//           </button>

//           <button
//             onClick={handleFullScreen}
//             title="Fullscreen"
//             className="bg-gray-700 hover:bg-gray-800 p-3 rounded-full shadow-md"
//           >
//             <Maximize size={20} />
//           </button>
//         </div>
//       </div>

//       {/* ===== RIGHT SIDE: COLLAPSIBLE DESCRIPTION ===== */}
//       <RightDescriptionPanel selectedProject={selectedProject} />

//       {/* VR Popup */}
//       {vrPopup.open && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[60]">
//           <div className="bg-black border border-purple-700 rounded-xl shadow-lg p-6 max-w-md w-full relative text-white">
//             <button
//               onClick={() => setVrPopup({ open: false, fileId: null })}
//               className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-bold mb-4 text-center text-purple-300">
//               View This Model in Virtual Reality
//             </h2>

//             <div
//               id="xr-status"
//               className="text-center text-gray-300 mb-4 flex flex-col items-center"
//             >
//               <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
//               Checking for connected VR headset...
//             </div>

//             <div className="text-sm text-gray-400 mt-3 border-t border-purple-800 pt-3">
//               <p><strong>On Meta Quest 3:</strong></p>
//               <ul className="list-disc ml-5 text-left">
//                 <li>Connect via Oculus Link (USB or Air Link)</li>
//                 <li>Or open this site in the Meta Browser (HTTPS)</li>
//                 <li>VR will launch automatically when detected</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// )}


//     </div>
//   );
// }
// === UserDashboard.jsx ===
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "@google/model-viewer";
import FBXViewer from "../components/FBXViewer";
import { useTheme } from "../context/ThemeContext";

import {
  Bell,
  User,
  LogOut,
  Users,
  FolderPlus,
  Edit,
  Trash,
  Info,
  Plus,
  X,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Eye,
  Maximize,
  View
} from "lucide-react";



function RightDescriptionPanel({ selectedProject }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!selectedProject) return null;

  const desc = selectedProject.description || "No description available.";
  const shortDesc = desc.length > 300 ? desc.slice(0, 300) + "..." : desc;

  return (
    <div
      className={`transition-all duration-500 ${collapsed ? "w-6" : "w-96"
        } bg-black/60 border-l border-purple-700 h-full relative flex flex-col`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white rounded-full p-1"
      >
        {collapsed ? ">" : "<"}
      </button>

      {!collapsed && (
        <div className="p-6 text-gray-200 overflow-y-auto">
          <h3 className="text-purple-400 text-lg font-semibold mb-3">{selectedProject.name}</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            {expanded ? desc : shortDesc}
          </p>

          {desc.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm underline"
            >
              {expanded ? "View Less" : "View More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [vrPopup, setVrPopup] = useState({ open: false, fileId: null });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await API.get(`/projects/my-projects?userId=${userId}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openModelPopup = (fileId, fileName) => {
    const url = `http://localhost:5000/api/projects/file/${fileId}`;
    setSelectedModel({ url, name: fileName });
  };
  const handleZoom = (delta) => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(3, Math.max(0.5, prevZoom + delta));
      const viewer = document.getElementById("model-viewer-3d");

      if (viewer && viewer.getCameraOrbit) {
        const orbit = viewer.getCameraOrbit();

        const radiusStr = orbit.radius?.toString() || "2.5m";
        const match = radiusStr.match(/([\d.]+)/);
        const radius = match ? parseFloat(match[1]) : 2.5;

        const azimuth = orbit.theta?.deg ?? 0;
        const elevation = orbit.phi?.deg ?? 75;


        const newRadius = Math.max(0.1, Math.min(100, radius * (prevZoom / newZoom)));

        console.log(
          `Zoom change: old radius ${radius.toFixed(2)} → new radius ${newRadius.toFixed(2)}`
        );


        viewer.setAttribute(
          "camera-orbit",
          `${azimuth}deg ${elevation}deg ${newRadius}m`
        );
      } else if (viewer) {

        const currentOrbit = viewer.getAttribute("camera-orbit") || "0deg 75deg 2.5m";
        const parts = currentOrbit.split(" ");
        const azimuth = parts[0];
        const elevation = parts[1];
        const radiusMatch = parts[2]?.match(/([\d.]+)m/);
        const radius = radiusMatch ? parseFloat(radiusMatch[1]) : 2.5;
        const newRadius = Math.max(0.2, Math.min(10, radius * (prevZoom / newZoom)));

        viewer.setAttribute("camera-orbit", `${azimuth} ${elevation} ${newRadius}m`);
      }

      return newZoom;
    });
  };






  const handleVR = (fileId) => {
    setVrPopup({ open: true, fileId });
  };

  const handleFullScreen = () => {
    const viewer = document.getElementById("model-viewer-3d");
    document.fullscreenElement ? document.exitFullscreen() : viewer?.requestFullscreen?.();
  };


  useEffect(() => {
    if (!vrPopup.open) return;

    const checkVR = async () => {

      let xrStatus = null;
      for (let i = 0; i < 10; i++) {
        xrStatus = document.getElementById("xr-status");
        if (xrStatus) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!xrStatus) return;

      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported("immersive-vr");
          if (supported) {
            xrStatus.textContent = "✅ Meta Quest 3 detected. Launching Unity VR...";


            fetch("http://localhost:5000/api/system/launch-unity-vr", { method: "POST" })
              .then((r) => r.json())
              .then((data) => {
                if (data.success) {
                  xrStatus.textContent = "🚀 Unity VR launched successfully!";
                  if (!vrPopup.fileId) {
                    console.error("❌ No fileId found for VR view. Popup state:", vrPopup);
                    alert("File ID missing — cannot load model in VR.");
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
                xrStatus.textContent = "⚠️ VR bridge connection failed.";
                window.open(`/vr-viewer?file=${vrPopup.fileId}`, "_blank");
              });
          } else {
            xrStatus.textContent = "❌ No VR headset detected. Connect Meta Quest 3.";
          }
        } catch {
          xrStatus.textContent = "⚠️ VR not supported on this browser.";
        }
      } else {
        xrStatus.textContent = "⚠️ WebXR not available. Use Chrome or Meta Quest Browser.";
      }
    };

    checkVR();
  }, [vrPopup.open]);




  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${darkMode
        ? "bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white"
        : "bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-900"
        }`}
    >


      <aside
        className={`w-64 backdrop-blur-lg border-r flex flex-col transition-colors duration-500 ${darkMode
          ? "bg-black/40 border-purple-800"
          : "bg-white border-gray-300 text-gray-800"
          }`}
      >

        <div className="p-4 text-center border-b border-purple-800 text-purple-400 font-bold text-xl">
          My Projects
        </div>
        <div className="flex-1 overflow-auto">
          {projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedProject(p)}
                className={`cursor-pointer px-4 py-3 border-b border-purple-800 hover:bg-purple-800/30 transition ${selectedProject?._id === p._id ? "bg-purple-900/50" : ""
                  }`}
              >
                <span className="font-semibold">{p.name}</span>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-400">No projects found.</p>
          )}
        </div>
        <div className="mt-auto pt-6 border-t border-gray-700 relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>

          {showProfileMenu && (
            <div
              className={`absolute left-0 bottom-14 w-56 rounded-lg shadow-lg p-3 z-50 ${darkMode ? "bg-[#1E293B]" : "bg-white border border-gray-300"
                }`}
            >
              <p
                className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                <strong>My Details:</strong> <br />
                <span className="text-xs">admin@edgevr.com</span>
              </p>

              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover:bg-indigo-600 hover:text-white transition"
              >
                <span>Theme Settings</span>
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-3 py-2 mt-2 rounded-md text-sm hover:bg-red-600 hover:text-white transition"
              >
                <span>Logout</span>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 p-8 overflow-auto">
        {!selectedProject && (
          <p className="text-center text-gray-300">Select a project from the sidebar.</p>
        )}

        {selectedProject && (
          <>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              {selectedProject.name}
            </h2>
            <p className="text-gray-400 mb-6">{selectedProject.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedProject.modelFileId && (
                <div
                  className="bg-black/50 border border-purple-700 rounded-xl p-4 hover:shadow-purple-500/40 hover:scale-[1.02] transition cursor-pointer"
                  onClick={() =>
                    openModelPopup(selectedProject.modelFileId, selectedProject.modelFileName)
                  }
                >
                  <h3 className="text-purple-300 font-semibold mb-2">Main Model</h3>
                </div>
              )}

              {selectedProject.subModels?.map((s, i) => (
                <div
                  key={i}
                  className="bg-black/50 border border-purple-700 rounded-xl p-4 hover:shadow-purple-500/40 hover:scale-[1.02] transition cursor-pointer"
                  onClick={() => openModelPopup(s.fileId, s.fileName)}
                >
                  <h3 className="text-purple-300 font-semibold mb-2">{s.name}</h3>
                </div>
              ))}
            </div>
          </>
        )}
      </main>


      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-black via-gray-900 to-black border border-purple-700 rounded-2xl shadow-2xl w-[90vw] h-[85vh] overflow-hidden flex">
            <button
              onClick={() => {
                setSelectedModel(null);
                setZoom(1);
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl z-50"
            >
              ✕
            </button>

            <div className="flex-1 relative bg-black overflow-hidden rounded-l-2xl">
              {selectedModel.url.endsWith(".fbx") ? (
                <FBXViewer fileUrl={selectedModel.url} zoom={zoom} />
              ) : (
                <>
                  <div
                    id="loading-overlay"
                    className="absolute inset-0 flex items-center justify-center bg-black text-purple-400 text-lg font-semibold"
                  >
                    Loading 3D model...
                  </div>

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
                    onLoad={(e) => {
                      const viewer = e.target;
                      const overlay = document.getElementById("loading-overlay");
                      if (overlay) overlay.style.display = "none";

                      const scene = viewer.model?.scene;
                      if (scene) {
                        scene.scale.set(150, 150, 150);
                      }

                      // ✅ Center model properly & keep distance
                      viewer.setAttribute("camera-orbit", "0deg 75deg 25m");
                      viewer.setAttribute("camera-target", "0m 1.5m 0m");
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "transparent",
                      transition: "camera-orbit 0.3s ease-out",
                    }}
                  ></model-viewer>
                </>
              )}


              <div className="absolute bottom-5 right-5 flex gap-3 z-50">
                <button
                  onClick={() => handleZoom(0.2)}
                  className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-md"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-md"
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={() => {
                    const viewer = document.getElementById("model-viewer-3d");
                    if (viewer) {
                      const isAuto = viewer.getAttribute("auto-rotate") !== null;
                      if (isAuto) {
                        viewer.removeAttribute("auto-rotate");
                        viewer.cameraOrbit = "0deg 75deg 2.5m";
                      } else {
                        viewer.setAttribute("auto-rotate", "");
                      }
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-md"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleVR(selectedModel.url.split("/").pop())}
                  className="bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-md"
                >
                  <View size={20} />
                </button>
                <button
                  onClick={handleFullScreen}
                  className="bg-gray-700 hover:bg-gray-800 p-3 rounded-full shadow-md"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>

            <RightDescriptionPanel
              selectedProject={{
                name: selectedModel.name || selectedProject.name,
                description:
                  selectedProject.subModels?.find(
                    (s) => s.fileId === selectedModel.url.split("/").pop()
                  )?.description ||
                  (selectedProject.modelFileId?.toString() ===
                    selectedModel.url.split("/").pop()
                    ? selectedProject.description
                    : "No description available."),
              }}
            />


            {vrPopup.open && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[60]">
                <div className="bg-black border border-purple-700 rounded-xl shadow-lg p-6 max-w-md w-full relative text-white">
                  <button
                    onClick={() => {
                      // Close the popup
                      setVrPopup({ open: false, fileId: null });

                      // Show restoring overlay
                      const overlay = document.createElement("div");
                      overlay.id = "restore-overlay";
                      overlay.innerText = "Restoring viewer...";
                      overlay.style.position = "absolute";
                      overlay.style.top = "50%";
                      overlay.style.left = "50%";
                      overlay.style.transform = "translate(-50%, -50%)";
                      overlay.style.background = "rgba(0, 0, 0, 0.6)";
                      overlay.style.color = "#fff";
                      overlay.style.padding = "10px 20px";
                      overlay.style.borderRadius = "10px";
                      overlay.style.fontSize = "16px";
                      overlay.style.zIndex = "9999";
                      document.body.appendChild(overlay);

                      // Reset <model-viewer> after closing VR
                      setTimeout(() => {
                        const oldViewer = document.getElementById("model-viewer-3d");
                        if (oldViewer) {
                          const parent = oldViewer.parentElement;
                          const src = oldViewer.getAttribute("src");

                          // remove old viewer
                          oldViewer.remove();

                          // create new one
                          const newViewer = document.createElement("model-viewer");
                          newViewer.id = "model-viewer-3d";
                          newViewer.setAttribute("src", src);
                          newViewer.setAttribute("alt", "3D Model");
                          newViewer.setAttribute("camera-controls", "");
                          newViewer.setAttribute("auto-rotate", "");
                          newViewer.setAttribute("xr-environment", "");
                          newViewer.setAttribute("ar", "");
                          newViewer.style.width = "100%";
                          newViewer.style.height = "100%";
                          newViewer.style.backgroundColor = "transparent";

                          parent.appendChild(newViewer);
                        }

                        // Hide overlay
                        setTimeout(() => {
                          const overlayEl = document.getElementById("restore-overlay");
                          if (overlayEl) overlayEl.remove();
                        }, 1000);
                      }, 800);
                    }}
                    className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>


                  <h2 className="text-xl font-bold mb-4 text-center text-purple-300">
                    View This Model in Virtual Reality
                  </h2>
                  <div
                    id="xr-status"
                    className="text-center text-gray-300 mb-4 flex flex-col items-center"
                  >
                    <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    Checking for connected VR headset...
                  </div>
                  <div className="text-sm text-gray-400 mt-3 border-t border-purple-800 pt-3">
                    <p><strong>On Meta Quest 3:</strong></p>
                    <ul className="list-disc ml-5 text-left">
                      <li>Connect via Oculus Link (USB or Air Link)</li>
                      <li>Or open this site in the Meta Browser (HTTPS)</li>
                      <li>VR will launch automatically when detected</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
