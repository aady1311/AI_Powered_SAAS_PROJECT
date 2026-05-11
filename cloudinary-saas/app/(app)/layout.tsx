"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  PlayCircleIcon,
  XIcon,
} from "lucide-react";

const sidebarItems = [
  {
    href: "/home",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  {
    href: "/social-share",
    icon: Share2Icon,
    label: "Social Share",
  },
  {
    href: "/video-upload",
    icon: UploadIcon,
    label: "Upload Video",
  },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { signOut } = useClerk();
  const { user } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      redirectUrl: "/sign-in",
    });
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="drawer lg:drawer-open">
        <input
          id="sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* MAIN CONTENT */}
        <div className="drawer-content flex flex-col">
          {/* NAVBAR */}
          <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
            <div className="navbar px-4 lg:px-8">
              {/* MOBILE MENU */}
              <div className="flex-none lg:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="btn btn-square btn-ghost"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>

              {/* LOGO */}
              <div className="flex-1">
                <button
                  onClick={() => router.push("/home")}
                  className="flex items-center gap-3"
                >
                  <div className="bg-primary text-primary-content p-3 rounded-2xl shadow-lg">
                    <PlayCircleIcon className="w-6 h-6" />
                  </div>

                  <div className="hidden sm:block text-left">
                    <h1 className="text-xl font-black">
                      Cloudinary SaaS
                    </h1>

                    <p className="text-xs text-gray-400">
                      Video Management Platform
                    </p>
                  </div>
                </button>
              </div>

              {/* USER */}
              {user && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="font-semibold text-sm">
                      {user.fullName || user.username}
                    </p>

                    <p className="text-xs text-gray-400">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  <div className="avatar">
                    <div className="w-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={user.imageUrl} alt="user" />
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="btn btn-error btn-sm text-white rounded-xl"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side z-[999]">
          <label
            htmlFor="sidebar-drawer"
            className="drawer-overlay"
            onClick={() => setSidebarOpen(false)}
          ></label>

          <aside className="w-72 min-h-full bg-base-100 border-r border-base-300 flex flex-col">
            {/* TOP */}
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <Link
                  href="/home"
                  className="flex items-center gap-3"
                >
                  <div className="bg-primary text-primary-content p-3 rounded-2xl shadow-lg">
                    <PlayCircleIcon className="w-7 h-7" />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Cloudinary SaaS
                    </h2>

                    <p className="text-xs text-gray-400">
                      Video Compression
                    </p>
                  </div>
                </Link>

                {/* MOBILE CLOSE */}
                <button
                  className="btn btn-sm btn-ghost lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* USER CARD */}
            {user && (
              <div className="p-4">
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-14 rounded-full">
                      <img src={user.imageUrl} alt="user" />
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="font-bold truncate">
                      {user.fullName || user.username}
                    </h3>

                    <p className="text-sm text-gray-400 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MENU */}
            <ul className="menu p-4 flex-1 gap-3">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-4 px-5 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-300
                        ${
                          isActive
                            ? "bg-primary text-primary-content shadow-lg"
                            : "hover:bg-base-200"
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* FOOTER */}
            <div className="p-4 border-t border-base-300">
              <button
                onClick={handleSignOut}
                className="btn btn-error w-full rounded-2xl text-white"
              >
                <LogOutIcon className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}