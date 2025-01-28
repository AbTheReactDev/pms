"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Hi {session?.user?.name}, Welcome to the Project Management App
      </h1>
    </div>
  );
}
