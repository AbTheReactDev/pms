"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load projects.");
      }
      setProjects(data?.data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProjects();
  }, []);


  const handleDelete = async (id:string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete project.");
      }

      setProjects((prevProjects) => prevProjects.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
      
    }
  };

  

  if (loading) return <p className="text-center mt-5">Loading projects...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Project List</h2>
        <Link href="/projects/create">
          <button className="bg-blue-500 flex gap-2 items-center text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 sm:mt-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
</svg>
 New Project
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse hidden sm:table">
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
                  <td className="p-3 border break-words max-w-[100px]"><a className="text-fuchsia-700" href={project?.appLink}>Project Link</a></td>
                  <td className="p-3 border">Rs.{project?.budget}</td>
                  <td className="p-3 max-h-max flex justify-center items-center gap-2">
                    <Link href={`/projects/${project?._id}`}>
                      <button  className="text-green-600 hover:underline border border-1 px-2">
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

        {/* Mobile View */}
        <div className="sm:hidden">
          {projects?.length > 0 ? (
            projects.map((project) => (
              <div key={project?._id} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{project?.title}</h3>
                <p className="text-sm">Status: {project?.status}</p>
                <p className="text-sm">Start: {new Date(project?.startDate).toLocaleDateString()}</p>
                <p className="text-sm">End: {new Date(project?.endDate).toLocaleDateString()}</p>
                <p className="text-sm break-words">Link: {project?.appLink}</p>
                <p className="text-sm">Budget: Rs.{project?.budget}</p>
                <div className="flex justify-between mt-2">
                  <Link href={`/projects/${project?._id}`}>
                    <button className="text-green-600 hover:underline">View</button>
                  </Link>
                  <Link href={`/projects/edit/${project?._id}`}>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(project?._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-4">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;