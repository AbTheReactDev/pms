"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Invalid credentials or user not found");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Sign In</h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block  text-black text-sm font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-black mt-1 p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-black text-sm font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
        <div className="h-[1px] w-full bg-black my-5" />
        <div className="flex gap-2 items-center">
          <p className="text-black">Dont have an account ? </p>{" "}
          <Link
            className="text-black underline font-medium"
            href="/auth/signup"
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}
