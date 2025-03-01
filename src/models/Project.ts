import mongoose from 'mongoose';

interface ProjectDocument extends mongoose.Document {
    title: string;
    description: string;
    owner: mongoose.Types.ObjectId;  // Reference to the User model
    startDate: Date;
    endDate?: Date;
    appLink?: string;
    status: 'ongoing' | 'completed' | 'paused' | 'not started';
    technologies: string[]; 
    budget: number;
    tasks: mongoose.Types.ObjectId[]; 
}

const projectSchema = new mongoose.Schema<ProjectDocument>(
    {
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
            ref: 'User',  
            required: true,
            index: true  // Added for better query performance
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            validate: {
                validator: function (this: ProjectDocument, value: Date) {
                    return !value || value >= this.startDate;
                },
                message: "End date must be after the start date"
            }
        },
        appLink: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['ongoing', 'completed', 'paused', 'not started'],
            default: 'not started'
        },
        technologies: {
            type: [String],
            required: true,
            default: []  // Ensure it's always an array
        },
        budget: {
            type: Number,
            required: true
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task'
            }
        ]
    },
    {
        timestamps: true
    }
);

const Project = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', projectSchema);

export default Project;
export type { ProjectDocument };
