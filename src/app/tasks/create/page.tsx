'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const CreateTask = () => {
  const router = useRouter()
  const [projects, setProjects] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    dueDate: '',
    date: new Date().toISOString().split('T')[0],
    status: 'todo',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        description: formData?.description,
        projectId: formData.projectId,
        dueDate: formData.dueDate,
        date: formData.date,
        status: formData.status,
      }),
    })

    if (res.ok) {
      alert('Task created!')
      router.push('/tasks') // Redirect to tasks list
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load projects.')
        }
        setProjects(data?.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create a New Task</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task Description"
          required
          className="w-full p-2 border rounded"
        ></textarea>

        <select
          value={formData?.projectId || ''}
          className="w-full p-2 border rounded"
          name="projectId"
          id="projectId"
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a project
          </option>{' '}
          {/* Default Placeholder */}
          {projects?.map?.((project) => (
            <option key={project?._id} value={project?._id}>
              {project?.title}
            </option>
          )) || []}
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          placeholder="Due Date"
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default CreateTask
