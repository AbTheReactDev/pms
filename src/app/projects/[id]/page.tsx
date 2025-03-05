'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Task {
  _id: string
  title: string
  description: string
  status: string
  date: string
  dueDate?: string
}

interface Project {
  _id: string
  title: string
  description: string
  owner: {
    name: string
  }
  status: string
  startDate: string
  endDate: string
  budget: number
  technologies: string[]
  files: string[]
  tasks: Task[]
}

const ProjectDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load project.')
        }

        setProject(data?.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProject()
  }, [id])

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete project.')
      }

      router.push('/projects')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading)
    return <p className="text-center mt-5">Loading project details...</p>
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>
  if (!project) return <p className="text-center mt-5">Project not found</p>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold">{project.title}</h1>
      <p className="text-gray-600 mt-2">{project.description}</p>
      <div className="mt-4">
        <span className="font-semibold">Owner:</span> {project.owner.name}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Status:</span>
        <span
          className={`ml-2 px-2 py-1 rounded text-white ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>
      <div className="mt-2">
        <span className="font-semibold">Start Date:</span>{' '}
        {new Date(project.startDate).toLocaleDateString()}
      </div>
      <div className="mt-2">
        <span className="font-semibold">End Date:</span>{' '}
        {new Date(project.endDate).toLocaleDateString()}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Budget:</span> ${project.budget}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Technologies:</span>{' '}
        {project.technologies.join(', ')}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Files</h2>
        {project.files.map((file) => (
          <p key={file} className="mb-2">
            <Link href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {file}
            </Link>
          </p>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>
        {project.tasks.map((task) => (
          <div key={task._id} className="mb-2 p-2 bg-gray-50 rounded">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-1">
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)} text-white`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <Link href="/projects">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back
          </button>
        </Link>
        <button
          onClick={() => handleDelete(project._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Delete Project
        </button>
      </div>
    </div>
  )
}

// Helper function to style status labels
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'bg-yellow-500'
    case 'completed':
      return 'bg-green-500'
    case 'paused':
      return 'bg-red-500'
    case 'todo':
      return 'bg-gray-500'
    case 'in progress':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export default ProjectDetail
