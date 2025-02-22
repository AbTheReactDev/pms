"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateProject = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        appLink:"",
        status: "not started",
        technologies: "",
        budget: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const projectData = {
            ...formData,
            technologies: formData.technologies.split(",").map((tech) => tech.trim()),
            budget: parseFloat(formData.budget),
            appLink:(formData.appLink)
            
        };

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projectData),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.message || "Failed to create project.");
        } else {
            router.push("/projects"); // Redirect to projects list
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create a New Project</h2>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Project Title"
                    required
                    className="w-full p-2 border rounded"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Project Description"
                    required
                    className="w-full p-2 border rounded"
                ></textarea>

                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />

                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    placeholder="End Date"
                    className="w-full p-2 border rounded"
                />

                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="not started">Not Started</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                </select>

                <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="Technologies (comma-separated)"
                    required
                    className="w-full p-2 border rounded"
                />

<input
                    type="string"
                    name="appLink"
                    value={formData.appLink}
                    onChange={handleChange}
                    placeholder="Link (Optional)"
                    required
                    className="w-full p-2 border rounded"
                />

                <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Budget"
                    required
                    className="w-full p-2 border rounded"
                />

                

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Project"}
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
