"use client";
import * as React from "react";
import {
  IconBuildingStore,
  IconSignLeft,
  IconSettings,
  IconChevronDown,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const user = {
  name: "Nick Rogers",
  email: "nick@visiblegraphics.com",
  avatar: "/avatars/shadcn.jpg",
};

const navLinks = [
  {
    title: "Brands",
    icon: IconBuildingStore,
    active: true,
  },
  {
    title: "Signs",
    icon: IconSignLeft,
    active: false,
  },
  {
    title: "Options",
    icon: IconSettings,
    active: false,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-black text-white"
      style={
        {
          "--sidebar-accent": "#374151", // Tailwind gray-700
          "--sidebar-accent-foreground": "#fff",
        } as React.CSSProperties & Record<string, string>
      }
      {...props}
    >
      <SidebarHeader className="flex flex-col bg-black items-center gap-4 pt-8 pb-4">
        {/* Logo and Branding */}
        <Image
          width={230}
          height={64}
          src="/images/logo.svg"
          alt="Visible Graphics Logo"
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col bg-black gap-2 px-4">
        {/* Section Title */}
        <div className="text-sm text-gray-400 mb-2 mt-2">Admin</div>
        {/* Navigation Links */}
        <SidebarMenu className="w-full">
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.title}>
              <SidebarMenuButton
                asChild
                isActive={link.active}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  link.active
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-800/60 text-white"
                }`}
              >
                <a href="#">
                  <link.icon className="w-5 h-5" />
                  <span className="ml-2 text-sm font-medium">{link.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto bg-black px-4 pb-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-9 w-9 rounded-lg grayscale">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">NR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-gray-400">{user.email}</div>
          </div>
          <IconChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
