import mongoose from 'mongoose';

interface ProjectDocument extends mongoose.Document {
    title: string;
    description: string;
    owner: mongoose.Types.ObjectId;  // reference to the User model
    startDate: Date;
    endDate: Date;
    status: 'ongoing' | 'completed' | 'paused' | 'not started';
    technologies: string[]; // list of technologies used in the project
    budget: number;
    tasks: mongoose.Types.ObjectId[]; // reference to an array of Task models (optional, depending on your structure)
}

const projectSchema = new mongoose.Schema<ProjectDocument>({
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model (assuming you're associating a project with a user)
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'paused', 'not started'],
        default: 'not started'
    },
    technologies: {
        type: [String],
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'  // Reference to Task model, if you're tracking tasks in a project (optional)
    }]
}, {
    timestamps: true
});

// This will create the Project model if it doesn't exist already
const Project = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', projectSchema);

export default Project;

export type { ProjectDocument };
