"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Task {
  title: string;
  description: string;
  project: string;
  assignedTo?: string;
  status: "todo" | "in progress" | "completed";
  dueDate?: string;
}

const EditTask = () => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (taskId) fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load task.");
      setTask({
        ...data?.data,
        dueDate: formatDate(data?.data?.dueDate),
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!task) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update task.");

      setMessage("Task updated successfully!");
      router.push("/tasks");
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
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
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={task?.title ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={task?.description ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={task?.status ?? "todo"}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="todo">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task?.dueDate ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isLoading ? "Loading..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default EditTask;
