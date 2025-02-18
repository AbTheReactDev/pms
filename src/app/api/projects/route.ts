import { NextResponse } from "next/server";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoDB";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
        const projects = await Project.find({ owner: session.user.id }).populate("owner", "name email");
        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const newProject = new Project({ ...body, owner: session.user.id });
        await newProject.save();
        return NextResponse.json({ success: true, data: newProject }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Error creating project" }, { status: 400 });
    }
}
