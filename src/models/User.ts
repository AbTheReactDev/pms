import mongoose from 'mongoose'

interface UserDocument extends mongoose.Document {
<<<<<<< HEAD
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    gender: string;
    contactNo: string;
    profilePicture: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
=======
  name: string
  email: string
  firstName: string
  lastName: string
  password: string
  gender: string
  contactNo: string
  profilePicture: string
>>>>>>> d75bcd9293ca6db9529c0693c8974eb8790a1f8d
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    contactNo: { type: String },
    profilePicture: { type: String },
<<<<<<< HEAD
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});
=======
  },
  {
    timestamps: true,
  }
)
>>>>>>> d75bcd9293ca6db9529c0693c8974eb8790a1f8d

const User =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)

export default User

export type { UserDocument }
