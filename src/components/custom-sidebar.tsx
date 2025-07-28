"use client";
import { Users, Grid2x2, ListTodo, Tag, House } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  {
    title: "Home",
    icon: House,
    href: "/",
  },
];

const brandLinks = [
  {
    title: "Dave's Hot Chicken",
    icon: "/images/chicken.png",
    href: "/brands/daves-hot-chicken",
  },
];

const adminLinks = [
  {
    title: "Brands",
    icon: Grid2x2,
    href: "/brands",
  },
  {
    title: "Signs",
    icon: ListTodo,
    href: "/signs",
  },
  {
    title: "Options",
    icon: Tag,
    href: "/options",
  },
  {
    title: "Users",
    icon: Users,
    href: "/users",
  },
];

interface CustomSidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CustomSidebar({
  className = "",
  style,
}: Readonly<CustomSidebarProps>) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-black text-white w-64 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="flex flex-col bg-black items-center gap-4 pt-8 pb-12">
        <Image
          width={225}
          height={64}
          src="/images/logo.svg"
          alt="Visible Graphics Logo"
          className={isCollapsed ? "w-12 h-12" : ""}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col bg-black gap-2 px-4 flex-1">
        {/* Main Navigation */}
        <div className="w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.title} className="mb-1">
                <Link
                  href={link.href}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="ml-2 text-[14px] font-medium">
                      {link.title}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Brands Section */}
        {!isCollapsed && (
          <div className="text-[14px] text-gray-400 mb-2 mt-4 px-4">Brands</div>
        )}
        <div className="w-full">
          {brandLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.title} className="mb-1">
                <Link
                  href={link.href}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <Image
                    src={link.icon}
                    alt={link.title}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  {!isCollapsed && (
                    <span className="ml-2 text-[14px] font-medium">
                      {link.title}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Admin Section */}
        {!isCollapsed && (
          <div className="text-[14px] text-gray-400 mb-2 mt-4 px-4">Admin</div>
        )}
        <div className="w-full">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.title} className="mb-1">
                <Link
                  href={link.href}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <link.icon
                    className={`w-5 h-5 ${
                      link.title === "Options" ? "rotate-[135deg]" : ""
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="ml-2 text-[14px] font-medium">
                      {link.title}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-black text-[14px] px-4 pb-4">
        <UserButton showUserInfo={!isCollapsed} />
      </div>
    </div>
  );
}
