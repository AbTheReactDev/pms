'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Task {
  _id: string
  title: string
  description: string
  createdAt: string // Add this field
  status: string // Add status field
  project: {
    _id: string
    title: string
  }
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks')
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load tasks.')
        }

        setTasks(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`/api/tasks?taskId=${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete task.')
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <p className="text-center mt-5">Loading tasks...</p>
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Task List</h2>
        <Link href="/tasks/create">
          <button className="bg-blue-500 flex gap-2 items-center text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 sm:mt-0">
            New Task
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse hidden sm:table">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Project Name</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.length > 0 ? (
              tasks.map((task) => (
                <tr key={task?._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{task?.title}</td>
                  <td className="p-3 border">
                    {new Date(task?.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border capitalize">{task?.description}</td>
                  <td className="p-3 border capitalize">{task?.status}</td>
                  <td className="p-3 border capitalize">
                    {task?.project?.title}
                  </td>

                  <td className="p-3 border text-center flex justify-center gap-2">
                    <Link href={`/tasks/${task?._id}`}>
                      <button className="text-green-600 hover:underline border border-1 px-2">
                        View
                      </button>
                    </Link>
                    <Link href={`/tasks/edit/${task?._id}`}>
                      <button className="text-blue-600 hover:underline border border-1 px-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(task?._id)}
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
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="sm:hidden">
          {tasks?.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task?._id}
                className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">{task?.title}</h3>
                <p className="text-sm">
                  Date: {new Date(task?.createdAt).toLocaleString()}
                </p>
                <p className="text-sm capitalize">Status: {task?.status}</p>
                <p className="text-sm capitalize">
                  Description: {task?.description}
                </p>
                <p className="text-sm capitalize">
                  Project: {task?.project?.title}
                </p>
                <div className="flex justify-between mt-2">
                  <Link href={`/tasks/${task?._id}`}>
                    <button className="text-green-600 hover:underline">
                      View
                    </button>
                  </Link>
                  <Link href={`/tasks/edit/${task?._id}`}>
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </Link>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-4">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks
