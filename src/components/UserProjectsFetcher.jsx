// src/components/UserProjectsFetcher.jsx
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function UserProjectsFetcher({ userId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get(
          `http://localhost:5000/api/projects/my-projects?userId=${userId}`
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching assigned projects:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProjects();
  }, [userId]);

  if (loading) return <span className="text-gray-500">Loading...</span>;
  if (projects.length === 0) return <span className="text-gray-400">No project assigned</span>;

  return (
    <span className="text-gray-300">
      {projects.map((p) => p.name).join(", ")}
    </span>
  );
}
