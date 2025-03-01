import { NextResponse } from "next/server";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoDB";
import Task from "@/models/Task";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const project = await Project.findById(params.id).populate("owner").populate('tasks');
        if (!project) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Error fetching project" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        if (project.owner.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const updatedData = await req.json();
        const updatedProject = await Project.findByIdAndUpdate(params.id, updatedData, { new: true });

        return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Error updating project" }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        if (project.owner.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }
        
        await Task.deleteMany({ project: params.id });

        await Project.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Error deleting project" }, { status: 500 });
    }
}

