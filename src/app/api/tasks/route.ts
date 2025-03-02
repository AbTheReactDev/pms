import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import Project from "@/models/Project";
import dbConnect from "@/lib/mongoDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
    
    await dbConnect();
    const { title, description, projectId, status, dueDate } = await req.json();
    const session = await getServerSession(authOptions);
    try {
        const project = await Project.findById(projectId);
        if (!project) return NextResponse.json({ message: "Project not found", status: 400 });

        const newTask = await Task.create({ title, description, project: projectId, assignedTo: session?.user?.id, status, dueDate });

        project.tasks.push(newTask._id);
        await project.save();

        return NextResponse.json({ message: "Task added successfully", data: newTask, status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error, status: 500 });
    }
}


export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find().populate("assignedTo").populate("project");
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}
