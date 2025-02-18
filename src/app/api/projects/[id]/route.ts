import { NextResponse } from "next/server";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoDB";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const project = await Project.findById(params.id).populate("owner");
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
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const updatedProject = await Project.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedProject) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedProject }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Error updating project" }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const deletedProject = await Project.findByIdAndDelete(params.id);
        if (!deletedProject) return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Error deleting project" }, { status: 400 });
    }
}
