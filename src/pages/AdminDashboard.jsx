
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
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
} from "lucide-react";
import UserProjectsFetcher from "../components/UserProjectsFetcher";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FBXViewer from "../components/FBXViewer";
import "@google/model-viewer";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [subModels, setSubModels] = useState([{ name: "", description: "", file: null }]);
  const [activeTab, setActiveTab] = useState("createProject");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [viewImage, setViewImage] = useState(null);

  const [assignedUser, setAssignedUser] = useState("");

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [helpRequests, setHelpRequests] = useState([]);
  const [expandedHelpId, setExpandedHelpId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewModel, setPreviewModel] = useState(null); // { url, name, type }

  // Calculate current help requests for this page
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHelpRequests = helpRequests.slice(indexOfFirst, indexOfLast);

  // Total pages
  const totalPages = Math.ceil(helpRequests.length / itemsPerPage);

  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects");
    }
  };

  const fetchHelpRequests = async () => {
    try {
      const res = await API.get("http://localhost:5000/api/help/all");
      setHelpRequests(res.data);
    } catch (err) {
      console.error("Error fetching help requests:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get("http://localhost:5000/api/auth/users");
        setUsers(usersRes.data.filter((u) => u.role === "user"));
        await fetchProjects();
        await fetchHelpRequests();
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewModel?.url) URL.revokeObjectURL(previewModel.url);
    };
  }, [previewModel, showPreviewModal]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", projectName);
      formData.append("description", projectDesc);
      formData.append("modelName", modelName);
      formData.append("assignedUser", assignedUser);
      if (modelFile) formData.append("modelFile", modelFile);

      const subModelsData = subModels.map((s) => ({
        name: s.name,
        description: s.description,
      }));
      formData.append("subModels", JSON.stringify(subModelsData));
      subModels.forEach((s) => {
        if (s.file) formData.append("subModelFiles", s.file);
      });

      const token = localStorage.getItem("token");

      await API.post("http://localhost:5000/api/projects/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`  // ✅ Include token
        },
      });
      alert("Project created successfully");
      setShowCreateModal(false);
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


  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      alert("Project deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Error deleting project");
    }
  };


  const handleShowInfo = async (id) => {
    try {
      const res = await API.get(`http://localhost:5000/api/projects/${id}`);
      setSelectedProject(res.data);
      setShowInfoModal(true);
    } catch (err) {
      console.log(err);
      alert("Error loading project info");
    }
  };

  const handleResolveHelp = async (id) => {
    if (!window.confirm("Mark this help request as resolved?")) return;
    try {
      const res = await API.put(`/help/resolve/${id}`);

      // Remove resolved request from state
      setHelpRequests(helpRequests.filter((h) => h._id !== id));

      // Add the new notification to state
      setNotifications((prev) => [res.data.notification, ...prev]);

      toast.success("Help request resolved successfully!");
    } catch (err) {
      console.error("Error resolving help:", err);
      toast.error("Failed to resolve help request");
    }
  };




  const handleShowUpdate = (project) => {
    setSelectedProject(project);
    setProjectName(project.name);
    setProjectDesc(project.description || "");
    setModelName(project.modelName || "");
    setSubModels(
      project.subModels?.map((s) => ({
        name: s.name,
        description: s.description,
        file: null,
      })) || [{ name: "", description: "", file: null }]
    );
    setShowUpdateModal(true);
  };


  const handleUpdateProject = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", projectName);
    formData.append("description", projectDesc);
    formData.append("modelName", modelName);

    if (modelFile) formData.append("modelFile", modelFile);

    formData.append("subModels", JSON.stringify(subModels));

    subModels.forEach((s) => {
      if (s.file) {
        formData.append("subModelFiles", s.file);
      }
    });


    await API.put(`/projects/${selectedProject._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Project updated successfully!");
    setShowUpdateModal(false);
    fetchProjects();
  };


  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-[#0B1120] text-white" : "bg-gray-100 text-gray-900"
        }`}
    >

      <aside
        className={`w-64 flex flex-col p-4 transition-all duration-300 ${darkMode ? "bg-[#111827]" : "bg-white border-r border-gray-300"
          }`}
      >
        <h1
          className={`text-2xl font-bold mb-6 ${darkMode ? "text-indigo-500" : "text-indigo-600"
            }`}
        >
          EdgeVR
        </h1>

        <button
          onClick={() => setActiveTab("createProject")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${activeTab === "createProject"
            ? "bg-indigo-600 text-white"
            : darkMode
              ? "text-gray-300 hover:bg-[#1E293B]"
              : "text-gray-700 hover:bg-gray-200"
            }`}
        >
          <FolderPlus className="w-5 h-5" /> Projects
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md mt-2 transition ${activeTab === "users"
            ? "bg-indigo-600 text-white"
            : darkMode
              ? "text-gray-300 hover:bg-[#1E293B]"
              : "text-gray-700 hover:bg-gray-200"
            }`}
        >
          <Users className="w-5 h-5" /> All Users
        </button>

        <button
          onClick={() => setActiveTab("help")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md mt-2 transition ${activeTab === "help"
            ? "bg-indigo-600 text-white"
            : darkMode
              ? "text-gray-300 hover:bg-[#1E293B]"
              : "text-gray-700 hover:bg-gray-200"
            }`}
        >
          <Bell className="w-5 h-5" /> Help Requests
        </button>



        <div className="mt-auto pt-6 border-t border-gray-700 relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition"
          >
            <User className="w-5 h-5  ml-4 text-black" />
            <span className="text-black">Profile</span>
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
                <span className="text-xs">{localStorage.getItem("email") || "admin@edgevr.com"}</span>
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


      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "createProject" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-400">Projects</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-all duration-200"
              >
                <Plus size={16} /> Create Project
              </button>
            </div>

            <div
              className={`p-4 rounded-lg border overflow-x-auto ${darkMode ? "border-gray-700 bg-[#1E293B]" : "bg-white border-gray-300"
                }`}
            >
              {projects.length === 0 ? (
                <p className="text-gray-400">No projects found.</p>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead
                    className={`uppercase text-xs border-b ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    <tr>
                      <th className="px-4 py-2">S.No</th>
                      <th className="px-4 py-2">Project Name</th>
                      <th className="px-4 py-2">Assigned Users</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr
                        key={project._id}
                        className={`border-b ${darkMode
                          ? "border-gray-700 hover:bg-gray-800"
                          : "border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{project.name}</td>
                        <td className="px-4 py-2">
                          {project.assignedTo?.length > 0
                            ? project.assignedTo.map((u) => u.email).join(", ")
                            : "Not assigned"}
                        </td>
                        <td className="px-4 py-2 text-right flex gap-3 justify-end">
                          <button
                            onClick={() => handleShowInfo(project._id)}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={() => handleShowUpdate(project)}
                            className="text-yellow-500 hover:text-yellow-400"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users tab unchanged */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-400">All Users</h2>
            <div
              className={`p-4 rounded-lg border overflow-x-auto ${darkMode ? "border-gray-700 bg-[#1E293B]" : "bg-white border-gray-300"
                }`}
            >
              {users.length === 0 ? (
                <p className="text-gray-400">No users found.</p>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead
                    className={`uppercase text-xs border-b ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    <tr>
                      <th className="px-4 py-2">S.No</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Assigned Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`border-b ${darkMode
                          ? "border-gray-700 hover:bg-gray-800"
                          : "border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
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


      {activeTab === "help" && (
        <div
          className={`flex w-full min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            }`}
        >
          {/* === Middle Panel (Help Requests List) === */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-y-auto ${expandedHelpId ? "w-[400px]" : "w-full"
              } ${darkMode ? "bg-gray-950" : "bg-white"} border-r ${darkMode ? "border-gray-800" : "border-gray-200"
              }`}
          >
            <div className="p-4 border-b border-gray-700 sticky top-0 bg-inherit z-10">
              <h2 className="text-lg font-semibold text-indigo-500 text-center">
                Help Requests
              </h2>
            </div>

            {currentHelpRequests.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                No help requests found.
              </p>
            ) : (
              <ul className="divide-y divide-gray-700">
                {currentHelpRequests.map((req) => (
                  <li
                    key={req._id}
                    onClick={() => setExpandedHelpId(req._id)}
                    className={`cursor-pointer p-4 hover:bg-indigo-900/20 transition ${expandedHelpId === req._id
                      ? "bg-indigo-800/30 border-l-4 border-indigo-500"
                      : ""
                      }`}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">{req.from}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${req.status === "open"
                          ? "bg-yellow-600 text-white"
                          : "bg-green-600 text-white"
                          }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {req.subject || "No subject"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center py-4 space-x-2 border-t border-gray-700">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* === Right Panel (Help Request Details) === */}
          {expandedHelpId && (
            <div
              className={`flex-1 flex flex-col overflow-y-auto h-screen p-6 transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
              {(() => {
                const req = currentHelpRequests.find((r) => r._id === expandedHelpId);
                if (!req) return null;

                return (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4 sticky top-0 bg-inherit z-10">
                      <h3 className="text-lg font-semibold text-indigo-400">
                        Help Request Details
                      </h3>
                      <button onClick={() => setExpandedHelpId(null)}>
                        <X size={20} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    <div className="space-y-3 text-sm overflow-y-auto flex-1 pr-2">
                      <p>
                        <strong>From:</strong> {req.from}
                      </p>
                      <p>
                        <strong>To:</strong> {req.to}
                      </p>
                      <p>
                        <strong>Subject:</strong> {req.subject || "No subject"}
                      </p>
                      <p>
                        <strong>Status:</strong> {req.status}
                      </p>
                      <div>
                        <strong>Message:</strong>
                        <p className="mt-1 text-gray-300">
                          {req.message || "No message"}
                        </p>
                      </div>

                      {/* Attachments */}
                      {req.attachments?.length > 0 && (
                        <div>
                          <strong>Attachments:</strong>
                          <div className="grid grid-cols-3 gap-3 mt-4">
                            {req.attachments.map((att, i) => {
                              const fileUrl = `http://localhost:5000/api/help/file/${att.fileId}`;
                              console.log("Loading attachment:", fileUrl);
                              const isImage = att.contentType?.startsWith("image/");
                              const isPDF = att.contentType === "application/pdf";

                              return (
                                <div key={i} className="flex flex-col items-center">
                                  {isImage ? (
                                    <img
                                      src={fileUrl}
                                      alt={att.filename}
                                      className="w-64 h-64 object-cover rounded cursor-pointer hover:opacity-90 transition"
                                      onClick={() => setViewImage(fileUrl)}
                                    />
                                  ) : isPDF ? (
                                    <iframe
                                      src={fileUrl}
                                      className="w-full h-[70vh] border rounded"
                                      title={att.filename}
                                    />
                                  ) : (
                                    <a
                                      href={fileUrl}
                                      download={att.filename}
                                      className="text-blue-400 underline text-sm"
                                    >
                                      Download {att.filename}
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-4 border-t border-gray-700 flex justify-end space-x-2 mt-6">
                      {req.status === "open" && (
                        <button
                          onClick={() => handleResolveHelp(req._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedHelpId(null)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* === Fullscreen Image Viewer === */}
          {viewImage && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <button
                className="absolute top-4 right-6 text-white text-lg"
                onClick={() => setViewImage(null)}
              >
                ✕ Close
              </button>
              <img
                src={viewImage}
                alt="Attachment"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
              />
            </div>
          )}
        </div>
      )}
      {/* ✅ Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto ${darkMode ? "bg-[#1E293B] text-white" : "bg-white text-gray-900"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-400">Create Project</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`p-2 rounded border ${darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
                required
              />

              <textarea
                placeholder="Description"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={3}
                className={`p-2 rounded border resize-none ${darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
              />

              <input
                type="text"
                placeholder="Main Model Name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className={`p-2 rounded border ${darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
              />

              <label className="text-sm font-semibold text-indigo-400">
                Main Model File
              </label>
              <input
                type="file"
                accept=".fbx,.glb"
                onChange={(e) => setModelFile(e.target.files[0])}
                className="text-gray-300"
              />

              <h4 className="text-indigo-400 mt-2 font-semibold">Sub Models</h4>
              {subModels.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 p-3 rounded border ${darkMode ? "border-gray-600" : "border-gray-300"
                    }`}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Submodel Name"
                      value={s.name}
                      onChange={(e) => handleSubModelChange(i, "name", e.target.value)}
                      className={`p-2 rounded border w-1/2 ${darkMode
                        ? "bg-gray-800 text-white border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={s.description}
                      onChange={(e) =>
                        handleSubModelChange(i, "description", e.target.value)
                      }
                      className={`p-2 rounded border w-1/2 ${darkMode
                        ? "bg-gray-800 text-white border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                    />
                  </div>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded mt-2"
              >
                + Add Submodel
              </button>



              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ✅ Info Modal */}
      {showInfoModal && selectedProject && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100 ${darkMode ? "bg-[#1E293B] text-white" : "bg-white text-gray-900"
              }`}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-400">Project Info</h3>
              <button onClick={() => setShowInfoModal(false)}>
                <X className="text-gray-400 hover:text-red-500 transition" />
              </button>
            </div>

            <p><strong>Name:</strong> {selectedProject.name}</p>
            <p><strong>Description:</strong> {selectedProject.description || "N/A"}</p>
            <p><strong>Model:</strong> {selectedProject.modelName}</p>

            <p className="mt-2">
              <strong>Assigned Users:</strong>{" "}
              {selectedProject.assignedTo?.length
                ? selectedProject.assignedTo.map((u) => u.email).join(", ")
                : "None"}
            </p>

            <div className="mt-2">
              <strong>Submodels:</strong>
              {selectedProject.subModels?.length ? (
                <ul className="list-disc pl-6">
                  {selectedProject.subModels.map((s, i) => (
                    <li key={i}>
                      {s.name} - {s.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No submodels</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ✅ Preview Modal (before creating project) */}
      {showPreviewModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto ${darkMode ? "bg-[#1E293B] text-white" : "bg-white text-gray-900"}`}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-400">Preview Upload</h3>
              <button
                onClick={() => {
                  if (previewModel?.url) URL.revokeObjectURL(previewModel.url);
                  setPreviewModel(null);
                  setShowPreviewModal(false);
                }}
              >
                <X className="text-gray-400 hover:text-red-500 transition" />
              </button>
            </div>

            {/* Details list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Files Selected</h4>
                <ul className="space-y-2 text-sm">
                  {/* Main model */}
                  {modelFile ? (
                    <li className={`p-3 rounded border ${darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-gray-50"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">Main Model</div>
                          <div className="text-xs opacity-80">{modelFile.name}</div>
                          <div className="text-xs opacity-80">{modelFile.type || "application/octet-stream"} · {(modelFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                          onClick={() => {
                            if (previewModel?.url) URL.revokeObjectURL(previewModel.url);
                            const url = URL.createObjectURL(modelFile);
                            setPreviewModel({ url, name: modelFile.name, type: modelFile.type });
                          }}
                        >
                          View
                        </button>
                      </div>
                    </li>
                  ) : (
                    <li className="text-xs opacity-70">No main model selected</li>
                  )}

                  {/* Submodels */}
                  {subModels && subModels.length > 0 && subModels.map((s, i) => (
                    <li key={i} className={`p-3 rounded border ${darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-gray-50"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">Submodel {s.name || `#${i + 1}`}</div>
                          {s.file ? (
                            <>
                              <div className="text-xs opacity-80">{s.file.name}</div>
                              <div className="text-xs opacity-80">{s.file.type || "application/octet-stream"} · {(s.file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </>
                          ) : (
                            <div className="text-xs opacity-70">No file chosen</div>
                          )}
                        </div>
                        {s.file && (
                          <button
                            type="button"
                            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                            onClick={() => {
                              if (previewModel?.url) URL.revokeObjectURL(previewModel.url);
                              const url = URL.createObjectURL(s.file);
                              setPreviewModel({ url, name: s.file.name, type: s.file.type });
                            }}
                          >
                            View
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Viewer */}
              <div className={`rounded border h-[60vh] ${darkMode ? 'border-white/10 bg-black/30' : 'border-black/10 bg-gray-100'}`}>
                {!previewModel ? (
                  <div className="w-full h-full flex items-center justify-center text-sm opacity-70">
                    Select a file and click View to preview
                  </div>
                ) : previewModel.name?.toLowerCase().endsWith('.fbx') ? (
                  <FBXViewer fileUrl={previewModel.url} />
                ) : (
                  <model-viewer
                    src={previewModel.url}
                    alt={previewModel.name || 'Preview Model'}
                    camera-controls
                    autoplay
                    style={{ width: '100%', height: '100%', background: 'transparent' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {showUpdateModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto ${darkMode ? "bg-[#1E293B] text-white" : "bg-white text-gray-900"
              }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-400">Update Project</h3>
              <button onClick={() => setShowUpdateModal(false)}>
                <X size={20} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProject} className="flex flex-col gap-3">

              {/* Project Name */}
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`p-2 rounded border ${darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
                required
              />

              {/* Description */}
              <textarea
                placeholder="Description"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={3}
                className={`p-2 rounded border resize-none ${darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
              />

              {/* Model Name */}
              <input
                type="text"
                placeholder="Main Model Name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className={`p-2 rounded border ${darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
              />

              {/* Main Model File */}
              <label className="text-sm font-semibold text-indigo-400">Main Model File</label>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-400">
                  <strong>Existing File:</strong>{" "}
                  {selectedProject.modelFileName ? (
                    <a
                      href={`${API.defaults.baseURL}/uploads/${selectedProject.modelFileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 underline"
                    >
                      {selectedProject.modelFileName}
                    </a>
                  ) : (
                    "No file uploaded"
                  )}
                </p>
                <input
                  type="file"
                  accept=".fbx,.glb"
                  onChange={(e) => setModelFile(e.target.files[0])}
                  className="text-gray-300"
                />
              </div>

              {/* Submodels */}
              <h4 className="text-indigo-400 mt-2 font-semibold">Sub Models</h4>
              {subModels.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 p-3 rounded border ${darkMode ? "border-gray-600" : "border-gray-300"
                    }`}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Submodel Name"
                      value={s.name}
                      onChange={(e) => handleSubModelChange(i, "name", e.target.value)}
                      className={`p-2 rounded border w-1/2 ${darkMode
                        ? "bg-gray-800 text-white border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={s.description}
                      onChange={(e) =>
                        handleSubModelChange(i, "description", e.target.value)
                      }
                      className={`p-2 rounded border w-1/2 ${darkMode
                        ? "bg-gray-800 text-white border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                    />
                  </div>

                  {/* Existing File */}
                  {s.fileName && (
                    <p className="text-sm text-gray-400">
                      <strong>Existing File:</strong>{" "}
                      <a
                        href={`${API.defaults.baseURL}/uploads/${s.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 underline"
                      >
                        {s.fileName}
                      </a>
                    </p>
                  )}

                  {/* Upload New File */}
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

              {/* Add Submodel */}
              <button
                type="button"
                onClick={addSubModelInput}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded mt-2"
              >
                + Add Submodel
              </button>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
