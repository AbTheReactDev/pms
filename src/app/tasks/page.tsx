'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Task {
  _id: string
  title: string
  description: string
  createdAt: string
  status: string
  project: {
    _id: string
    title: string
  }
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesProject = projectFilter === 'all' || task.project._id === projectFilter
      return matchesSearch && matchesStatus && matchesProject
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
    })

  const uniqueProjects = Array.from(new Set(tasks.map(task => task.project._id)))
    .map(id => tasks.find(task => task.project._id === id)?.project)

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

      {/* Filters and Search */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Projects</option>
          {uniqueProjects.map((project) => (
            <option key={project?._id} value={project?._id}>
              {project?.title}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className="p-2 border rounded"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border rounded"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
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
            {filteredAndSortedTasks?.length > 0 ? (
              filteredAndSortedTasks.map((task) => (
                <tr key={task?._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{task?.title}</td>
                  <td className="p-3 border">
                    {new Date(task?.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border capitalize">{task?.description}</td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded-full text-sm ${task?.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task?.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {task?.status}
                    </span>
                  </td>
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
                <td colSpan={6} className="text-center p-4">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="sm:hidden">
          {filteredAndSortedTasks?.length > 0 ? (
            filteredAndSortedTasks.map((task) => (
              <div
                key={task?._id}
                className="bg-white p-4 mb-4 rounded-lg shadow-md border"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{task?.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${task?.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task?.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {task?.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(task?.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  Description: {task?.description}
                </p>
                <p className="text-sm text-gray-600 mb-4 capitalize">
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
                  <button
                    onClick={() => handleDelete(task?._id)}
                    className="text-red-600 hover:underline"
                  >
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
