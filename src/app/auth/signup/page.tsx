'use client'
import Link from 'next/link'
import React, { useState } from 'react'

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      alert('User registered successfully')
    } else {
      const error = await response.json()
      alert(error.error)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Sign Up</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-black text-sm font-medium"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-black text-sm font-medium"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-black text-sm font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 text-black border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-black text-sm font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 text-black border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500  text-white p-2 rounded"
        >
          Sign Up
        </button>
        <div className="h-[1px] w-full bg-black my-5" />

        <div className="flex gap-2 items-center">
          <p className="text-black">Already have an account ? </p>{' '}
          <Link
            className="text-black underline font-medium"
            href="/auth/signin"
          >
            Signin
          </Link>
        </div>
      </form>
    </div>
  )
}
