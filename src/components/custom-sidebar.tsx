"use client";
import { Users, Grid2x2, ListTodo, Tag, House } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <div
      className={`bg-black text-white w-64 h-screen flex flex-col ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="flex flex-col bg-black items-center gap-4 pt-8 pb-12">
        <Image
          width={210}
          height={64}
          src="/images/logo.svg"
          alt="Visible Graphics Logo"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col bg-black gap-2 px-4 flex-1">
        {/* Main Navigation */}
        <div className="w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.title} className="">
                <Link
                  href={link.href}
                  className={`w-full flex items-center gap-2 px-4 py-1 h-8 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="ml-1 text-[14px] font-medium">
                    {link.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Brands Section */}
        <div className="text-[12px] text-gray-200 mt-4 px-4">Brands</div>
        <div className="w-full">
          {brandLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.title} className="">
                <Link
                  href={link.href}
                  className={`w-full flex items-center text-[14px] gap-2 px-4 py-1 h-8 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <img src={link.icon} alt="" className="w-5 h-5" />
                  <span className="ml-1 text-[14px] font-medium">
                    {link.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Admin Section */}
        <div className="text-[12px] text-gray-200 mb-1 mt-4 px-4">Admin</div>
        <div className="w-full">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.title} className="mb-0.5">
                <Link
                  href={link.href}
                  className={`w-full flex items-center gap-2 px-4 py-1 h-8 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <link.icon
                    className={`w-4 h-4 ${
                      link.title === "Options" ? "rotate-[135deg]" : ""
                    }`}
                  />
                  <span className="ml-1 text-[14px] font-medium">
                    {link.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-black text-[14px] px-4 pb-4">
        <UserButton showUserInfo={true} />
      </div>
    </div>
  );
}
