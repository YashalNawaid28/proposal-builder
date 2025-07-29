"use client";
import { Users, Grid2x2, ListTodo, Tag, House } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    title: "Home",
    icon: House,
    href: "/jobs",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-black text-white w-64"
      style={
        {
          "--sidebar-accent": "#374151",
          "--sidebar-accent-foreground": "#fff",
        } as React.CSSProperties & Record<string, string>
      }
      {...props}
    >
      <SidebarHeader className="flex flex-col bg-black items-center gap-4 pt-8 pb-12">
        {/* Logo and Branding */}
        <Image
          width={225}
          height={64}
          src="/images/logo.svg"
          alt="Visible Graphics Logo"
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col bg-black gap-2 px-4">
        {/* Main Navigation */}
        <SidebarMenu className="w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <Link href={link.href} className="w-full flex items-center">
                    <link.icon className="w-5 h-5" />
                    <span className="ml-2 text-[14px] font-medium">
                      {link.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Brands Section */}
        <div className="text-[14px] text-gray-400 mb-2 mt-4 px-4">Brands</div>
        <SidebarMenu className="w-full">
          {brandLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <Link href={link.href} className="w-full flex items-center">
                    <Image
                      src={link.icon}
                      alt={link.title}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="ml-2 text-[14px] font-medium">
                      {link.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Admin Section */}
        <div className="text-[14px] text-gray-400 mb-2 mt-4 px-4">Admin</div>
        <SidebarMenu className="w-full">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-900/60 text-white"
                  }`}
                >
                  <Link href={link.href} className="w-full flex items-center">
                    <link.icon
                      className={`w-5 h-5 ${
                        link.title === "Options" ? "rotate-[135deg]" : ""
                      }`}
                    />
                    <span className="ml-2 text-[14px] font-medium">
                      {link.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto bg-black text-[14px] px-4 pb-4">
        <UserButton showUserInfo={true} />
      </SidebarFooter>
    </Sidebar>
  );
}
