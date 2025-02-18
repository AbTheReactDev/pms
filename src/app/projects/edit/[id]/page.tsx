"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Project {
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: "not started" | "ongoing" | "completed" | "paused";
    technologies: string;
    budget: number;
}

const EditProject = () => {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.id as string; // Ensure ID is a string

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (projectId) fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to load project.");

            setProject({
                ...data?.data?.project,
                technologies: data?.data?.project?.technologies?.join(", ") || "", // Convert array to string
                startDate: formatDate(data?.project?.startDate), // Format date correctly
                endDate: data?.project?.endDate ? formatDate(data?.project?.endDate) : "", // Handle optional endDate
            });

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const formatDate = (date?: string | Date): string => {
        return date ? new Date(date).toISOString().split("T")[0] : "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProject((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!project) return;

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...project,
                    technologies: project?.technologies?.split(",").map((tech) => tech.trim()), // Convert string to array
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update project.");

            setMessage("Project updated successfully!");
            router.push("/dashboard/projects");
        } catch (err: any) {
            setError(err.message);
        }
    };
    

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={project?.title ?? ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={project?.description ?? ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={project?.startDate ?? ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={project?.endDate ?? ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        name="status"
                        value={project?.status ?? "not started"}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="not started">Not Started</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Technologies (comma-separated)</label>
                    <input
                        type="text"
                        name="technologies"
                        value={project?.technologies ?? ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Budget</label>
                    <input
                        type="number"
                        name="budget"
                        value={project?.budget ?? 0}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Update Project
                </button>
            </form>
        </div>
    );
};

export default EditProject;
