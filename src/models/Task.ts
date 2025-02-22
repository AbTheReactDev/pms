import mongoose from 'mongoose';

interface TaskDocument extends mongoose.Document {
    title: string;
    description: string;
    project: mongoose.Types.ObjectId;  // Reference to the Project model
    assignedTo?: mongoose.Types.ObjectId;  // Optional reference to a User model
    status: 'todo' | 'in progress' | 'completed';
    dueDate?: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['todo', 'in progress', 'completed'],
        default: 'todo'
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Task = mongoose.models.Task || mongoose.model<TaskDocument>('Task', taskSchema);

export default Task;
export type { TaskDocument };
