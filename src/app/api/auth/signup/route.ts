import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongoDB';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { firstName, lastName, email, password } = await request.json();

        if (!firstName || !email || !password) {
            return NextResponse.json(
                { message: 'Firstname, email and password are required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            name: `${firstName.trim()} ${lastName.trim()}`,
        });

        await newUser.save();
        return NextResponse.json(
            { message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
