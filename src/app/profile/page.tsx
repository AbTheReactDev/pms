'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import React from 'react'

export default function Profile() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    contactNo: '',
    profilePicture: '',
  })

  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || '',
        gender: session.user.gender || '',
        contactNo: session.user.contactNo || '',
        profilePicture: session.user.profilePicture || '',
      })
    }
  }, [session?.user])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    setMessage(null)
    event.preventDefault()

    // Validate firstName and lastName
    if (!formData.firstName.trim()) {
      setMessage({ type: 'error', text: 'First name is required' })
      setIsLoading(false)
      return
    }

    if (!formData.lastName.trim()) {
      setMessage({ type: 'error', text: 'Last name is required' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user) {
          await update()
          setMessage({ type: 'success', text: 'Profile updated successfully!' })
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' })
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {message && (
          <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {message.text}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              onChange={handleChange}
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              onChange={handleChange}
              name="lastName"
              value={formData.lastName}
              placeholder="Last Name"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              placeholder="Email"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="contact" className="text-sm font-medium">
              Contact Number
            </label>
            <input
              id="contact"
              type="tel"
              value={formData.contactNo}
              name="contactNo"
              onChange={handleChange}
              placeholder="Contact Number"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="profilePicture" className="text-sm font-medium">
              Profile Picture
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.profilePicture && (
              <Image
                height={24}
                width={24}
                src={formData.profilePicture}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
