import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoDB";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const project = await Task.findById(params.id).populate("assignedTo").populate('project');
        if (!project) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Error fetching task" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    // Get the logged-in user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
       
        const task = await Task.findById(params.id);

        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return NextResponse.json({ success: false, message: 'Associated project not found' }, { status: 404 });
        }

        if (project.owner.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        await Task.findByIdAndDelete(params.id);

        // Remove the task reference from the project
        await Project.updateOne(
            { _id: task.project },
            { $pull: { tasks: task._id } }
        );

        return NextResponse.json({ success: true, message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error deleting task' }, { status: 500 });
    }
}


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