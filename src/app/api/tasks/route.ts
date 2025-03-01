import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import Project from "@/models/Project";
import dbConnect from "@/lib/mongoDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    await dbConnect();
    const { title, description, projectId, status, dueDate } = await req.json();

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: session.user.id,
      status: status || "todo",
      dueDate,
    });

    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task } });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

// Get all tasks for a specific project
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const tasks = await Task.find().populate("assignedTo");
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}
