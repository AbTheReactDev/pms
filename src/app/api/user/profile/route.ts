import { NextResponse } from 'next/server'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { authOptions } from '@/lib/authOptions'
import dbConnect from '@/lib/mongoDB'

export async function PUT(req: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const userId = session.user.id // Logged-in user ID
    const body = await req.json()
    const { firstName, lastName, contactNo, gender, profilePicture, password } =
      body

    const updatedData: any = {}
    if (firstName) updatedData.firstName = firstName
    if (lastName) updatedData.lastName = lastName
    if (contactNo) updatedData.contactNo = contactNo
    if (gender) updatedData.gender = gender
    if (profilePicture) updatedData.profilePicture = profilePicture

    // If password update is requested, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10)
      updatedData.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    })

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: 'Error updating profile' },
      { status: 500 }
    )
  }
}
