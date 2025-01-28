"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface NavbarProps {
  isHomePage?: boolean;
}

const Navbar = ({ isHomePage }: NavbarProps) => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between">
      {isHomePage ? (
        <h1 className="text-2xl font-bold text-gray-700">Logo</h1>
      ) : (
        <h1 className="text-2xl font-bold text-gray-700">
          Welcome, {session?.user?.name}
        </h1>
      )}

      <div className="flex gap-2 items-center">
        {status === "authenticated" && isHomePage && (
          <Link href="/dashboard">Dashboarad ➡️</Link>
        )}
        <button
          onClick={handleSignOut}
          className="animate-pulse rounded-lg p-2"
        >
          🔴
        </button>
      </div>
    </header>
  );
};

export default Navbar;
