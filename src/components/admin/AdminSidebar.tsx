"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-700" : "";
  };

  return (
    <aside className="bg-blue-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <nav className="space-y-2">
        <Link
          href="/admin"
          className={`block p-2 rounded hover:bg-blue-700 ${isActive("/admin")}`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/users"
          className={`block p-2 rounded hover:bg-blue-700 ${isActive(
            "/admin/users"
          )}`}
        >
          Users
        </Link>
        <Link
          href="/admin/projects"
          className={`block p-2 rounded hover:bg-blue-700 ${isActive(
            "/admin/projects"
          )}`}
        >
          Projects
        </Link>
        <Link
          href="/admin/tasks"
          className={`block p-2 rounded hover:bg-blue-700 ${isActive(
            "/admin/tasks"
          )}`}
        >
          Tasks
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 