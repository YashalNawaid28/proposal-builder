"use client";
import * as React from "react";
import { Signpost, Settings, Home, Users, Grid3X3 } from "lucide-react";
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
    icon: Home,
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
    icon: Grid3X3,
    href: "/brands",
  },
  {
    title: "Signs",
    icon: Signpost,
    href: "/signs",
  },
  {
    title: "Options",
    icon: Settings,
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
      className="bg-black text-white"
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
          width={230}
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
                    <span className="ml-2 text-sm font-medium">
                      {link.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Brands Section */}
        <div className="text-sm text-gray-400 mb-2 mt-4">Brands</div>
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
                    <span className="ml-2 text-sm font-medium">
                      {link.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Admin Section */}
        <div className="text-sm text-gray-400 mb-2 mt-4">Admin</div>
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
                    <link.icon className="w-5 h-5" />
                    <span className="ml-2 text-sm font-medium">
                      {link.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto bg-black text-sm px-4 pb-4">
        <UserButton showUserInfo={true} />
      </SidebarFooter>
    </Sidebar>
  );
}
