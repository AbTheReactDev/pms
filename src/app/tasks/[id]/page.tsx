'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const TaskDetail = () => {
  const { id } = useParams() // Get task ID from URL
  const router = useRouter()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load task?.')
        }
        setTask(data?.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTask()
  }, [id])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete task.')
      } else {
        alert('Task deleted successfully')
      }
      router.push('/tasks')
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading)
    return <p className="text-center mt-5">Loading task details...</p>
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>

  console.log(task)

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold">{task?.title}</h1>
      <p className="text-gray-600 mt-2">{task?.description}</p>

      <div className="mt-2">
        <span className="font-semibold">Status:</span>
        <span
          className={`ml-2 px-2 py-1 rounded text-sm text-white ${getStatusColor(
            task?.status
          )}`}
        >
          {task?.status}
        </span>
      </div>

      <p className="text-gray-600 mt-2">
        Created At : {new Date(task?.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mt-2">
        Due Date : {new Date(task?.dueDate).toLocaleDateString()}
      </p>

      <div className="mt-6 flex space-x-4">
        <Link href="/tasks">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back
          </button>
        </Link>
        <button
          onClick={() => handleDelete(task?._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Delete task
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
    default:
      return 'bg-gray-500'
  }
}

export default TaskDetail
