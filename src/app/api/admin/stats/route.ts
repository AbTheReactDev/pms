import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";
import Project from "@/models/Project";
import Task from "@/models/Task";
import dbConnect from "@/lib/mongoDB";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const [totalUsers, totalProjects, totalTasks, activeProjects] =
      await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Task.countDocuments(),
        Project.countDocuments({ status: "ongoing" }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalTasks,
      activeProjects,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
} 