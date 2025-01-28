"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-5">
      <h1 className="text-3xl font-bold">
        Hi {session?.user?.name}, Welcome to the Project Management App
      </h1>
      <button
        onClick={handleSignOut}
        className="p-2 bg-red-600 text-white rounded-lg "
      >
        Logout
      </button>
    </div>
  );
}
