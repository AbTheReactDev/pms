import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    gender: 'male' | 'female' | 'other';
    contactNo: string;
    profilePicture: string;
    role: 'admin' | 'manager' | 'developer';
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'developer'] as const,
            default: 'developer'
        },
        gender: { type: String, enum: ['male', 'female', 'other'] as const },
        contactNo: { type: String },
        profilePicture: { type: String }
    },
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
export type { UserDocument };
