"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-2xl font-bold text-gray-700">PMS</h1>

      <div className="flex gap-2 items-center">
        <h1 className="font-bold">
          {session?.user?.firstName} {session?.user?.lastName}
        </h1>
        <div className="relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-10 h-10 bg-gray-200 rounded-full focus:outline-none"
            aria-label="Toggle Profile Dropdown"
          >
            👤
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>

              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
