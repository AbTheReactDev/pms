import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/Task';
import Project from '@/models/Project';
import dbConnect from '@/lib/mongoDB';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Create a new task
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { title,date, description, projectId, assignedTo, status, dueDate } = await req.json();

      

        const task = await Task.create({
            title,
            date,
            description,
            project: projectId,
            assignedTo,
            status,
            dueDate
        });

        // Add task to project's task list
        await Project.findByIdAndUpdate(projectId, { $push: { tasks: task } });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
    }
}

// Get all tasks for user's projects
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // First get all projects owned by the user
        const userProjects = await Project.find({ owner: session.user.id });
        const projectIds = userProjects.map(project => project._id);

        // Then get all tasks for these projects
        const tasks = await Task.find({ 
            project: { $in: projectIds } 
        }).populate('project').populate('assignedTo');

        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
    }
}

// Update a task
export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const { taskId, ...updates } = await req.json();

        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(task, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
    }
}

// Delete a task
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const taskId = req.nextUrl.searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Remove task from project's task list
        await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
    }
}

