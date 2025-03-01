"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const ProjectDetail = () => {
  const { id } = useParams(); // Get project ID from URL
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load project?.");
        }

        console.log(data);

        setProject(data?.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

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

      router.push("/projects");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-5">Loading project details...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;
console.log(project);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold">{project?.title}</h1>
      <p className="text-gray-600 mt-2">{project?.description}</p>

      <div className="mt-4">
        <span className="font-semibold">Owner:</span> {project?.owner?.name}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Status:</span>
        <span
          className={`ml-2 px-2 py-1 rounded text-white ${getStatusColor(
            project?.status
          )}`}
        >
          {project?.status}
        </span>
      </div>
      <div className="mt-2">
        <span className="font-semibold">Start Date:</span>{" "}
        {new Date(project?.startDate).toLocaleDateString()}
      </div>
      <div className="mt-2">
        <span className="font-semibold">End Date:</span>{" "}
        {new Date(project?.endDate).toLocaleDateString()}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Budget:</span> ${project?.budget}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Technologies:</span>{" "}
        {project?.technologies?.join(", ")}
      </div>
    
      

      <div className="mt-6 flex space-x-4">
        <Link href="/projects">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back
          </button>
        </Link>
        <button
          onClick={() => handleDelete(project?._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
};

// Helper function to style status labels
const getStatusColor = (status: string) => {
  switch (status) {
    case "ongoing":
      return "bg-yellow-500";
    case "completed":
      return "bg-green-500";
    case "paused":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default ProjectDetail;
