import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
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
    }
}, {
    timestamps: true
});


const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;

export type { UserDocument };
