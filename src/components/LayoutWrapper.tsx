"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/auth/signin" || pathname === "/auth/signup";

  if (isAuthPage) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300`}>
        <Navbar />
        <main className="p-3">{children}</main>
      </div>
    </div>
  );
}
