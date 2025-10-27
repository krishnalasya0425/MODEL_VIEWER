//display models are
////working moderls in vr
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API, { setAuthToken } from "../utils/api";
// import { Bell, User, LogOut } from "lucide-react";
// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [projectName, setProjectName] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [modelName, setModelName] = useState("");
//   const [modelFile, setModelFile] = useState(null);
//   const [subModels, setSubModels] = useState([{ name: "", description: "", file: null }]);
//   const [assignProjectId, setAssignProjectId] = useState("");
//   const [assignUserIds, setAssignUserIds] = useState([]);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // Load users and projects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersRes = await API.get("http://localhost:5000/api/auth/users"); // create this API in backend
//         setUsers(usersRes.data.filter(u => u.role === "user"));

//         const projectsRes = await API.get("http://localhost:5000/api/projects");
//         setProjects(projectsRes.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchData();
//   }, []);




// const handleAddProject = async (e) => {
//   e.preventDefault();
//   try {
//     const formData = new FormData();
//     formData.append("name", projectName);
//     formData.append("description", projectDesc);
//     formData.append("modelName", modelName);

//     // Attach main model file
//     if (modelFile) formData.append("modelFile", modelFile);

//     // Prepare submodels metadata
//     const subModelsData = subModels.map((s) => ({ 
//       name: s.name, 
//       description: s.description 
//     }));
//     formData.append("subModels", JSON.stringify(subModelsData));

//     // Attach submodel files - ensure they're in correct order
//     subModels.forEach((s) => {
//       if (s.file) formData.append("subModelFiles", s.file);
//     });

//     // Send to backend
//     await API.post("http://localhost:5000/api/projects/create", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });



//     alert("Project created successfully");

//     // Reset form
//     setProjectName("");
//     setProjectDesc("");
//     setModelName("");
//     setModelFile(null);
//     setSubModels([{ name: "", description: "", file: null }]);

//     // Refresh project list
//     const projectsRes = await API.get("http://localhost:5000/api/projects");
//     setProjects(projectsRes.data);
//   } catch (err) {
//     console.log(err);
//     alert("Error creating project");
//   }
// };


//   // Handle adding new submodel input
//   const addSubModelInput = () => setSubModels([...subModels, { name: "", description: "", file: null }]);
//   const handleSubModelChange = (index, field, value) => {
//     const updated = [...subModels];
//     updated[index][field] = value;
//     setSubModels(updated);
//   };

//   // Assign project to users
//   const handleAssignProject = async () => {
//     try {
//       if (!assignProjectId || assignUserIds.length === 0) return alert("Select project and users");
//       await API.post(`http://localhost:5000/api/projects/${assignProjectId}/assign`, { userIds: assignUserIds });
//       alert("Project assigned successfully");
//     } catch (err) {
//       console.log(err);
//       alert("Error assigning project");
//     }
//   };

//   return (
//     <div className="p-8">
//            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
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

//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Create Project</h2>
//         <form onSubmit={handleAddProject} className="flex flex-col gap-2 border p-4 rounded">
//           <input type="text" placeholder="Project Name" value={projectName} onChange={(e)=>setProjectName(e.target.value)} className="p-2 border rounded" required/>
//           <input type="text" placeholder="Project Description" value={projectDesc} onChange={(e)=>setProjectDesc(e.target.value)} className="p-2 border rounded" />
//           <input type="text" placeholder="Main Model Name" value={modelName} onChange={(e)=>setModelName(e.target.value)} className="p-2 border rounded" />
//           <input type="file" accept=".fbx,.glb" onChange={(e)=>setModelFile(e.target.files[0])} />

//           <div>
//             <h3 className="font-semibold">Sub Models</h3>
//             {subModels.map((s, i) => (
//               <div key={i} className="flex gap-2 items-center mb-1">
//                 <input type="text" placeholder="Name" value={s.name} onChange={(e)=>handleSubModelChange(i,"name",e.target.value)} className="p-2 border rounded" required/>
//                 <input type="text" placeholder="Description" value={s.description} onChange={(e)=>handleSubModelChange(i,"description",e.target.value)} className="p-2 border rounded"/>
//                 <input type="file" accept=".fbx,.glb" onChange={(e)=>handleSubModelChange(i,"file",e.target.files[0])} />
//               </div>
//             ))}
//             <button type="button" onClick={addSubModelInput} className="bg-blue-400 text-white px-2 py-1 rounded">Add Submodel</button>
//           </div>
//           <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-2">Create Project</button>
//         </form>
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold mb-2">Assign Project to Users</h2>
//         <div className="flex flex-col gap-2 border p-4 rounded">
//           <select value={assignProjectId} onChange={(e)=>setAssignProjectId(e.target.value)} className="p-2 border rounded">
//             <option value="">Select Project</option>
//             {projects.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
//           </select>

//           <select multiple value={assignUserIds} onChange={(e)=>setAssignUserIds([...e.target.selectedOptions].map(o=>o.value))} className="p-2 border rounded">
//             {users.map(u=><option key={u._id} value={u._id}>{u.email}</option>)}
//           </select>

//           <button onClick={handleAssignProject} className="bg-blue-500 text-white px-4 py-2 rounded">Assign Project</button>
//         </div>
//       </div>
//     </div>
//   );
// }
//styles with tabs (errors)
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API, { setAuthToken } from "../utils/api";
// import { Bell, User, LogOut, Info, Trash2, Edit } from "lucide-react";
// import FBXViewer from "../components/FBXViewer";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [activeTab, setActiveTab] = useState("users"); // 'users' or 'projects'

//   // Project creation states
//   const [projectName, setProjectName] = useState("");
//   const [projectDesc, setProjectDesc] = useState("");
//   const [modelName, setModelName] = useState("");
//   const [modelFile, setModelFile] = useState(null);
//   const [subModels, setSubModels] = useState([{ name: "", description: "", file: null }]);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   // Project assignment states
//   const [assignProjectId, setAssignProjectId] = useState("");
//   const [assignUserIds, setAssignUserIds] = useState([]);

//   // UI states
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [infoProject, setInfoProject] = useState(null); // For project info popup
//   const [viewFile, setViewFile] = useState(null); // For 3D viewer
//   const [loaded, setLoaded] = useState(false);

//   // Logout
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // Fetch users and projects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersRes = await API.get("http://localhost:5000/api/auth/users");
//         setUsers(usersRes.data.filter(u => u.role === "user"));

//         const projectsRes = await API.get("http://localhost:5000/api/projects");
//         setProjects(projectsRes.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchData();
//   }, []);

//   // --- Project Creation ---
//   const handleAddProject = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("name", projectName);
//       formData.append("description", projectDesc);
//       formData.append("modelName", modelName);
//       if (modelFile) formData.append("modelFile", modelFile);

//       const subModelsData = subModels.map((s) => ({ name: s.name, description: s.description }));
//       formData.append("subModels", JSON.stringify(subModelsData));
//       subModels.forEach((s) => { if (s.file) formData.append("subModelFiles", s.file); });

//       await API.post("http://localhost:5000/api/projects/create", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Project created successfully");
//       setProjectName(""); setProjectDesc(""); setModelName(""); setModelFile(null);
//       setSubModels([{ name: "", description: "", file: null }]);
//       const projectsRes = await API.get("http://localhost:5000/api/projects");
//       setProjects(projectsRes.data);
//     } catch (err) {
//       console.log(err);
//       alert("Error creating project");
//     }
//   };

//   const addSubModelInput = () => setSubModels([...subModels, { name: "", description: "", file: null }]);
//   const handleSubModelChange = (index, field, value) => {
//     const updated = [...subModels];
//     updated[index][field] = value;
//     setSubModels(updated);
//   };

//   // Assign project to users
//   const handleAssignProject = async () => {
//     try {
//       if (!assignProjectId || assignUserIds.length === 0) return alert("Select project and users");
//       await API.post(`http://localhost:5000/api/projects/${assignProjectId}/assign`, { userIds: assignUserIds });
//       alert("Project assigned successfully");
//     } catch (err) {
//       console.log(err);
//       alert("Error assigning project");
//     }
//   };

//   // Delete project
//   const handleDeleteProject = async (id) => {
//     if (!confirm("Are you sure you want to delete this project?")) return;
//     try {
//       await API.delete(`http://localhost:5000/api/projects/${id}`);
//       setProjects(projects.filter(p => p._id !== id));
//     } catch (err) {
//       console.log(err);
//       alert("Error deleting project");
//     }
//   };

//   // View 3D model
//   const viewFileHandler = (fileId) => {
//     setLoaded(false);
//     setViewFile(`/api/projects/file/${fileId}`);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r shadow-sm">
//         <div className="p-6 text-2xl font-bold text-blue-600">EdgeVR Admin</div>
//         <nav className="flex flex-col gap-2 p-4">
//           <button
//             className={`text-left p-2 rounded ${activeTab === "users" ? "bg-blue-100 font-semibold" : ""}`}
//             onClick={() => {
//               setActiveTab("users");
//               setShowCreateModal(false); // ✅ correct
//             }}
//           >
//             Users
//           </button>

//           <button
//             className={`text-left p-2 rounded ${activeTab === "projects" ? "bg-blue-100 font-semibold" : ""}`}
//             onClick={() => {
//               setActiveTab("projects");
//               setShowCreateModal(false); // ✅ correct
//             }}
//           >
//             Projects
//           </button>


//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b sticky top-0 z-50 flex justify-between items-center px-6 py-3 mb-4">
//           <div></div>
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
//         </header>

//         {/* --- Users Tab --- */}
//         {activeTab === "users" && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">All Users</h2>
//             <table className="min-w-full bg-white border rounded shadow overflow-hidden">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Email</th>
//                   <th className="p-2 border">Assigned Projects</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map(u => (
//                   <tr key={u._id} className="hover:bg-gray-50">
//                     <td className="p-2 border">{u.email}</td>
//                     <td className="p-2 border">{u.projects?.map(p => p.name).join(", ") || "None"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* --- Projects Tab --- */}
//         {activeTab === "projects" && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">All Projects</h2>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               >
//                 Create Project
//               </button>
//             </div>

//             {/* Projects Table */}
//             <table className="min-w-full bg-white border rounded shadow overflow-hidden">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Name</th>
//                   <th className="p-2 border">Description</th>
//                   <th className="p-2 border">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map(p => (
//                   <tr key={p._id} className="hover:bg-gray-50">
//                     <td className="p-2 border">{p.name}</td>
//                     <td className="p-2 border">{p.description}</td>
//                     <td className="p-2 border flex gap-2">
//                       <button onClick={() => setInfoProject(p)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
//                         <Info className="w-4 h-4" /> Info
//                       </button>
//                       <button onClick={() => alert("Edit not implemented")} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1">
//                         <Edit className="w-4 h-4" /> Edit
//                       </button>
//                       <button onClick={() => handleDeleteProject(p._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1">
//                         <Trash2 className="w-4 h-4" /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* --- Create Project Modal --- */}
//             {showCreateModal && (
//               <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative p-6">
//                   <h3 className="text-lg font-semibold mb-3">Create Project</h3>

//                   <form onSubmit={handleAddProject} className="flex flex-col gap-2">
//                     <input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="p-2 border rounded" required />
//                     <input type="text" placeholder="Project Description" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} className="p-2 border rounded" />
//                     <input type="text" placeholder="Main Model Name" value={modelName} onChange={(e) => setModelName(e.target.value)} className="p-2 border rounded" />
//                     <input type="file" accept=".fbx,.glb" onChange={(e) => setModelFile(e.target.files[0])} />

//                     <div>
//                       <h3 className="font-semibold">Sub Models</h3>
//                       {subModels.map((s, i) => (
//                         <div key={i} className="flex gap-2 items-center mb-1">
//                           <input type="text" placeholder="Name" value={s.name} onChange={(e) => handleSubModelChange(i, "name", e.target.value)} className="p-2 border rounded" required />
//                           <input type="text" placeholder="Description" value={s.description} onChange={(e) => handleSubModelChange(i, "description", e.target.value)} className="p-2 border rounded" />
//                           <input type="file" accept=".fbx,.glb" onChange={(e) => handleSubModelChange(i, "file", e.target.files[0])} />
//                         </div>
//                       ))}
//                       <button type="button" onClick={addSubModelInput} className="bg-blue-400 text-white px-2 py-1 rounded">Add Submodel</button>
//                     </div>

//                     <div className="flex justify-end gap-2 mt-4">
//                       <button type="button" onClick={() => setShowCreateModal(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
//                       <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create</button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- Project Info Modal --- */}
//         {infoProject && (
//           <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative p-6">
//               <h3 className="text-lg font-semibold mb-3">{infoProject.name} - Models</h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
//                 {infoProject.modelFileId && (
//                   <div className="border p-2 rounded flex flex-col items-center">
//                     <span className="font-semibold">{infoProject.modelName || infoProject.name}</span>
//                     <button onClick={() => viewFileHandler(infoProject.modelFileId)} className="bg-yellow-500 text-white px-2 py-1 rounded mt-2">View</button>
//                   </div>
//                 )}
//                 {infoProject.subModels?.map((s, i) => (
//                   <div key={i} className="border p-2 rounded flex flex-col items-center">
//                     <span className="font-semibold">{s.name}</span>
//                     <button
//   onClick={() => {
//     const fid = s.fileId || s._id; // fallback to _id
//     if (fid) viewFileHandler(fid);
//   }}
//   className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
// >
//   View
// </button>


//                   </div>
//                 ))}
//               </div>

//               <button onClick={() => setInfoProject(null)} className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
//             </div>
//           </div>
//         )}

//         {/* --- 3D Viewer Modal --- */}
//         {viewFile && (
//           <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative p-6">
//               {!loaded && <p className="text-gray-500 mb-2">Loading 3D Model...</p>}

//               {viewFile.endsWith(".fbx") ? (
//                 <FBXViewer fileUrl={viewFile} onLoad={() => setLoaded(true)} />
//               ) : viewFile.endsWith(".glb") ? (
//                 <model-viewer
//                   src={viewFile}
//                   alt="3D Model"
//                   camera-controls
//                   auto-rotate
//                   onLoad={() => setLoaded(true)}
//                   style={{ width: "100%", height: "500px", borderRadius: "0.5rem" }}
//                 ></model-viewer>
//               ) : (
//                 <p className="text-red-500">Invalid 3D file</p>
//               )}

//               <button onClick={() => setViewFile(null)} className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
//                 Close
//               </button>
//             </div>
//           </div>
//         )}


//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { Bell, User, LogOut, Users, FolderPlus } from "lucide-react";
import UserProjectsFetcher from "../components/UserProjectsFetcher";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [subModels, setSubModels] = useState([{ name: "", description: "", file: null }]);
  const [assignProjectId, setAssignProjectId] = useState("");
  const [assignUserIds, setAssignUserIds] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("createProject"); // sidebar tab

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get("http://localhost:5000/api/auth/users");
        setUsers(usersRes.data.filter((u) => u.role === "user"));

        const projectsRes = await API.get("http://localhost:5000/api/projects");
        setProjects(projectsRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", projectName);
      formData.append("description", projectDesc);
      formData.append("modelName", modelName);
      if (modelFile) formData.append("modelFile", modelFile);

      const subModelsData = subModels.map((s) => ({
        name: s.name,
        description: s.description,
      }));
      formData.append("subModels", JSON.stringify(subModelsData));

      subModels.forEach((s) => {
        if (s.file) formData.append("subModelFiles", s.file);
      });

      await API.post("http://localhost:5000/api/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Project created successfully");
      setProjectName("");
      setProjectDesc("");
      setModelName("");
      setModelFile(null);
      setSubModels([{ name: "", description: "", file: null }]);

      const projectsRes = await API.get("http://localhost:5000/api/projects");
      setProjects(projectsRes.data);
    } catch (err) {
      console.log(err);
      alert("Error creating project");
    }
  };

  const addSubModelInput = () =>
    setSubModels([...subModels, { name: "", description: "", file: null }]);

  const handleSubModelChange = (index, field, value) => {
    const updated = [...subModels];
    updated[index][field] = value;
    setSubModels(updated);
  };

  const handleAssignProject = async () => {
    try {
      if (!assignProjectId || assignUserIds.length === 0)
        return alert("Select project and users");
      await API.post(
        `http://localhost:5000/api/projects/${assignProjectId}/assign`,
        { userIds: assignUserIds }
      );
      alert("Project assigned successfully");
    } catch (err) {
      console.log(err);
      alert("Error assigning project");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] flex flex-col p-4">
        <h1 className="text-2xl font-bold text-indigo-500 mb-6">EdgeVR</h1>

        <button
          onClick={() => setActiveTab("createProject")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${activeTab === "createProject"
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-[#1E293B]"
            }`}
        >
          <FolderPlus className="w-5 h-5" /> Create Project
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md mt-2 transition ${activeTab === "users"
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-[#1E293B]"
            }`}
        >
          <Users className="w-5 h-5" /> All Users
        </button>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Navbar (border removed) */}


        {/* Tab Content */}
        {activeTab === "createProject" && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-indigo-400">
                Create Project
              </h2>
              <form
                onSubmit={handleAddProject}
                className="flex flex-col gap-2 border border-gray-700 bg-[#1E293B] p-4 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Project Description"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Main Model Name"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="file"
                  accept=".fbx,.glb"
                  onChange={(e) => setModelFile(e.target.files[0])}
                  className="text-gray-300"
                />

                <div>
                  <h3 className="font-semibold text-indigo-400 mb-1">Sub Models</h3>
                  {subModels.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center mb-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={s.name}
                        onChange={(e) =>
                          handleSubModelChange(i, "name", e.target.value)
                        }
                        className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={s.description}
                        onChange={(e) =>
                          handleSubModelChange(i, "description", e.target.value)
                        }
                        className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="file"
                        accept=".fbx,.glb"
                        onChange={(e) =>
                          handleSubModelChange(i, "file", e.target.files[0])
                        }
                        className="text-gray-300"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSubModelInput}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded transition-all duration-200"
                  >
                    Add Submodel
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-all duration-200"
                >
                  Create Project
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-400">
                Assign Project to Users
              </h2>
              <div className="flex flex-col gap-2 border border-gray-700 bg-[#1E293B] p-4 rounded-lg">
                <select
                  value={assignProjectId}
                  onChange={(e) => setAssignProjectId(e.target.value)}
                  className="p-2 bg-gray-800 text-white border border-gray-600 rounded"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  multiple
                  value={assignUserIds}
                  onChange={(e) =>
                    setAssignUserIds([...e.target.selectedOptions].map((o) => o.value))
                  }
                  className="p-2 bg-gray-800 text-white border border-gray-600 rounded"
                >
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.email}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssignProject}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-all duration-200"
                >
                  Assign Project
                </button>
              </div>
            </div>
          </>
        )}

{activeTab === "users" && (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-indigo-400">All Users</h2>
    <div className="border border-gray-700 bg-[#1E293B] p-4 rounded-lg overflow-x-auto">
      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <table className="min-w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs border-b border-gray-700">
            <tr>
              <th className="px-4 py-2 border-r border-gray-700">S.No</th>
              <th className="px-4 py-2 border-r border-gray-700">Email</th>
              <th className="px-4 py-2">Assigned Project</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border-r border-gray-700">{index + 1}</td>
                <td className="px-4 py-2 border-r border-gray-700">{user.email}</td>
                <td className="px-4 py-2 text-gray-400">
  <UserProjectsFetcher userId={user._id} />
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
}
