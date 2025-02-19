"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load projects.");
        }

        setProjects(data?.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete project.");
      }

      // Remove the deleted project from the UI
      setProjects((prevProjects) => prevProjects.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading projects...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Project List</h2>
        <Link href="/projects/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + New Project
          </button>
        </Link>
      </div>

      

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Start Date</th>
              <th className="p-3 border">End Date</th>
              <th className="p-3 border">Link</th>
              <th className="p-3 border">Budget</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.length > 0 ? (
              projects.map((project) => (
                <tr key={project?._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{project?.title}</td>
                  <td className="p-3 border capitalize">{project?.status}</td>
                  <td className="p-3 border">
                    {new Date(project?.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {new Date(project?.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{project?.appLink}</td>
                  <td className="p-3 border">Rs.{project?.budget}</td>
                  <td className="p-3 border text-center flex justify-center gap-2">
                    <Link href={`/projects/${project?._id}`}>
                      <button className="text-green-600 hover:underline border border-1 px-2">
                        View
                      </button>
                    </Link>
                    <Link href={`/projects/edit/${project?._id}`}>
                      <button className="text-blue-600 hover:underline border border-1 px-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(project?._id)}
                      className="text-red-600 hover:underline border border-1 px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
