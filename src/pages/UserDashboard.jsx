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
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "@google/model-viewer";
import FBXViewer from "../components/FBXViewer";
import { useTheme } from "../context/ThemeContext";

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
  ChevronRight
} from "lucide-react";

// Optimized RightDescriptionPanel with memoization
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
        } ${darkMode ? 'bg-gray-900/95 border-l border-purple-500 text-gray-200' : 'bg-white/95 border-l border-purple-200 text-gray-900'} h-full relative flex flex-col backdrop-blur-sm`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute top-1/2 -left-3 transform -translate-y-1/2 rounded-full p-2 shadow-lg transition-all ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
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
              className={`mt-4 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-purple-800/50 hover:bg-purple-700 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
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

// Optimized Project Card Component for Grid Layout
const ProjectCard = React.memo(({ project, isSelected, onClick, darkMode }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? darkMode 
            ? 'border-purple-500 bg-purple-900/30 shadow-2xl shadow-purple-500/30' 
            : 'border-purple-400 bg-purple-50 shadow-2xl shadow-purple-200'
          : darkMode 
            ? 'border-gray-700 bg-gray-800/50 hover:border-purple-500 hover:bg-purple-900/20 hover:shadow-2xl hover:shadow-purple-500/20' 
            : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-2xl hover:shadow-purple-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-2 truncate">{project.name}</h4>
          <p className={`text-sm line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.description || 'No description available'}
          </p>
        </div>
        <div className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
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

// Optimized Model Card Component
const ModelCard = React.memo(({ model, onClick, darkMode, isMain = false }) => {
  return (
    <div
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        darkMode 
          ? isMain
            ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 hover:border-purple-400' 
            : 'bg-gradient-to-br from-gray-800/50 to-purple-900/50 border border-gray-600 hover:border-purple-400'
          : isMain
            ? 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 hover:border-purple-300'
            : 'bg-gradient-to-br from-gray-50 to-purple-50 border border-gray-200 hover:border-purple-300'
      }`}
      onClick={onClick}
    >
      <div className={`p-6 border-b ${darkMode ? isMain ? 'border-purple-500/30' : 'border-gray-600' : isMain ? 'border-purple-200' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isMain ? (darkMode ? 'bg-purple-600' : 'bg-purple-500') : (darkMode ? 'bg-blue-600' : 'bg-blue-500')}`}>
            <View className="text-white" size={18} />
          </div>
          {isMain ? 'Main Model' : model.name}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ${!isMain ? 'line-clamp-2' : ''}`}>
          {isMain ? 'Primary 3D model for this project' : (model.description || '3D model component')}
        </p>
      </div>
      <div className="p-4 bg-black/20 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          isMain
            ? darkMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
            : darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}>
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
        className="p-2 rounded-lg bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
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
  const [helpForm, setHelpForm] = useState({
    to: "",
    from: "",
    subject: "",
    message: "",
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Optimized search with useMemo
  const filteredProjects = useMemo(() => 
    projects.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [projects, searchTerm]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Optimized project data fetching
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

  // Optimized notifications with cleanup
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await API.get(`/notifications/user/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Optimized model opening with loading state
  const openModelPopup = async (fileId, fileName) => {
    try {
      setModelLoading(true);
      const url = `http://localhost:5000/api/projects/file/${fileId}`;
      setSelectedModel({ url, name: fileName });
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error opening model:", error);
    } finally {
      setModelLoading(false);
    }
  };

  // Optimized zoom handler
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

              const newRadius = Math.max(0.1, Math.min(100, radius * (prevZoom / newZoom)));
              viewer.setAttribute(
                "camera-orbit",
                `${azimuth}deg ${elevation}deg ${newRadius}m`
              );
            } else {
              const currentOrbit = viewer.getAttribute("camera-orbit") || "0deg 75deg 2.5m";
              const parts = currentOrbit.split(" ");
              const azimuth = parts[0];
              const elevation = parts[1];
              const radiusMatch = parts[2]?.match(/([\d.]+)m/);
              const radius = radiusMatch ? parseFloat(radiusMatch[1]) : 2.5;
              const newRadius = Math.max(0.2, Math.min(10, radius * (prevZoom / newZoom)));
              viewer.setAttribute("camera-orbit", `${azimuth} ${elevation} ${newRadius}m`);
            }
          } catch (error) {
            console.warn("Zoom adjustment failed:", error);
          }
        });
      }

      return newZoom;
    });
  }, []);

  const handleVR = (fileId) => {
    setVrPopup({ open: true, fileId });
  };

  const handleFullScreen = () => {
    const viewer = document.getElementById("model-viewer-3d");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewer?.requestFullscreen?.();
    }
  };

  // Optimized VR popup effect
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
    <div
      className={`min-h-screen transition-colors duration-300 relative ${darkMode
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white"
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100 text-gray-900"
        }`}
    >
      {/* Simplified Background */}
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} />

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
          <div className="flex items-center justify-between p-6">
            {/* Logo and Search Bar */}
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
                  <Grid3X3 className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  EdgeVR
                </h1>
              </div>

              {/* Search Bar */}
              <div className={`relative rounded-xl overflow-hidden max-w-md flex-1 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 focus:outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setShowNotifications(true)}
                className={`relative p-3 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
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
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Mail size={18} />
                Get Help
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          {selectedProject ? (
            /* Project Details View */
            <>
              {/* Project Header */}
              <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className={`mb-4 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      Back to Projects
                    </button>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {selectedProject.name}
                    </h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                    {selectedProject.subModels?.length || 0} Models
                  </div>
                </div>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedProject.description}
                </p>
              </div>

              {/* 3D Models Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Model Card */}
                {selectedProject.modelFileId && (
                  <ModelCard
                    model={selectedProject}
                    onClick={() => openModelPopup(selectedProject.modelFileId, selectedProject.modelFileName)}
                    darkMode={darkMode}
                    isMain={true}
                  />
                )}

                {/* Sub Models */}
                {selectedProject.subModels?.map((subModel, index) => (
                  <ModelCard
                    key={index}
                    model={subModel}
                    onClick={() => openModelPopup(subModel.fileId, subModel.fileName)}
                    darkMode={darkMode}
                    isMain={false}
                  />
                ))}
              </div>

              {/* Empty State for No Models */}
              {!selectedProject.modelFileId && (!selectedProject.subModels || selectedProject.subModels.length === 0) && (
                <div className={`text-center py-12 rounded-2xl ${darkMode ? 'bg-gray-800/30' : 'bg-white/30'}`}>
                  <Grid3X3 className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                  <h3 className="text-xl font-bold mb-2">No 3D Models</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    This project doesn't contain any 3D models yet.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Projects Grid View */
            <>
              {/* Projects Header */}
             

              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader className="animate-spin text-purple-500" size={32} />
                </div>
              ) : currentProjects.length > 0 ? (
                <>
                  {/* Projects Grid - 8 per page */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentProjects.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        isSelected={selectedProject?._id === project._id}
                        onClick={() => setSelectedProject(project)}
                        darkMode={darkMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
                  <FolderPlus className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                  <h2 className="text-2xl font-bold mb-2">No Projects Found</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {searchTerm ? 'Try adjusting your search terms' : 'No projects available in your account'}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 3D Model Viewer Modal */}
      {selectedModel && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${darkMode ? 'bg-black/90' : 'bg-white/95'}`}>
          <div
            className={`relative rounded-3xl shadow-2xl w-[95vw] h-[90vh] overflow-hidden flex transition-colors duration-300 ${
              darkMode
                ? 'bg-gradient-to-br from-gray-900 to-purple-900 border border-purple-500'
                : 'bg-white border border-gray-300'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedModel(null);
                setZoom(1);
              }}
              className={`absolute top-4 right-4 z-50 p-3 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-red-600 text-white' 
                  : 'bg-white hover:bg-red-500 text-gray-800 hover:text-white shadow-lg'
              }`}
            >
              <X size={20} />
            </button>

            {/* 3D Viewer */}
            <div className="flex-1 relative overflow-hidden rounded-l-3xl">
              {modelLoading && (
                <div
                  className={`absolute inset-0 flex items-center justify-center text-lg font-semibold transition-colors duration-300 z-10 ${
                    darkMode ? 'bg-black text-purple-400' : 'bg-white text-purple-600'
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

              {/* Control Buttons */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-50">
                <button
                  onClick={() => handleZoom(0.2)}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                    darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                  } text-white`}
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                    darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
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
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleVR(selectedModel.url.split('/').pop())}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                    darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  <View size={20} />
                </button>
                <button
                  onClick={handleFullScreen}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-600 hover:bg-gray-700'
                  } text-white`}
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>

            {/* Right Description Panel */}
            <RightDescriptionPanel
              selectedProject={{
                name: selectedModel.name || selectedProject.name,
                description:
                  selectedProject.subModels?.find(
                    (s) => s.fileId === selectedModel.url.split('/').pop()
                  )?.description ||
                  (selectedProject.modelFileId?.toString() ===
                    selectedModel.url.split('/').pop()
                    ? selectedProject.description
                    : 'No description available.'),
                darkMode,
              }}
            />
          </div>
        </div>
      )}

      {/* VR Popup */}
      {vrPopup.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[60]">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 border border-purple-500 rounded-2xl shadow-2xl p-8 max-w-md w-full relative text-white">
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

      {showNotifications && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-[400px] max-h-[70vh] overflow-y-auto bg-white border border-gray-300 shadow-2xl rounded-xl p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center">No notifications</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className="flex justify-between items-start bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg hover:shadow-sm transition"
                  >
                    <div className="pr-3">
                      <p className="text-sm font-medium text-gray-700">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : "No date"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNotification(n._id)}
                      className="text-gray-400 hover:text-red-500"
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


      {/* help popup */}
      {showHelpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[600px] p-6 flex flex-col gap-4 relative">

            {/* Close Button */}
            <button
              onClick={() => setShowHelpPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-2">
              <Mail size={20} className="text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">
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

                // ✅ Check if project is selected
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
                <label className="text-sm text-gray-600 font-medium">
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
                        // ✅ Use the project’s assigned admin email if available
                        to:
                          selectedProj?.createdBy?.email ||
                          selectedProj?.adminEmail ||
                          "defaultadmin@example.com",
                      });
                    }}
                    className="w-full px-2 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400"
                  >
                    <option value="">-- Choose a project --</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name || project.title}
                      </option>
                    ))}
                  </select>
                )}

                {/* Warning message when no project selected */}
                {!helpForm.projectId && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ Please select a project before submitting.
                  </p>
                )}
              </div>

              {/* To */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600 font-medium w-16">To:</label>
                <input
                  type="email"
                  value={helpForm.to || "defaultadmin@example.com"}
                  readOnly
                  className="flex-1 border-b border-gray-300 text-gray-800 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* From */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600 font-medium w-16">From:</label>
                <input
                  type="email"
                  value={helpForm.from}
                  readOnly
                  className="flex-1 border-b border-gray-300 text-gray-800 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Subject */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600 font-medium w-16">Subject</label>
                <input
                  type="text"
                  value={helpForm.subject}
                  onChange={(e) =>
                    setHelpForm({ ...helpForm, subject: e.target.value })
                  }
                  placeholder="Enter subject…"
                  required
                  className="flex-1 border-b border-gray-300 text-gray-800 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Message Box */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">Write your message…</label>
                <textarea
                  value={helpForm.message}
                  onChange={(e) =>
                    setHelpForm({ ...helpForm, message: e.target.value })
                  }
                  placeholder="Describe your issue…"
                  required
                  className="w-full px-2 py-2 rounded-md border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400 resize-none h-32"
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

                {/* Scrollable Attachment List */}
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
                  className={`font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors w-full ${helpForm.projectId
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
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

