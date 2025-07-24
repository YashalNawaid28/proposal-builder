"use client";
import * as React from "react";
import {
  IconBuildingStore,
  IconSignLeft,
  IconSettings,
} from "@tabler/icons-react";
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
    title: "Brands",
    icon: IconBuildingStore,
    href: "/brands",
  },
  {
    title: "Signs",
    icon: IconSignLeft,
    href: "/signs",
  },
  {
    title: "Options",
    icon: IconSettings,
    href: "/options",
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
          {navLinks.map((link, idx) => {
            const isActive =
              pathname === link.href ||
              (idx === 0 &&
                (pathname === "/dashboard" || pathname === "/brands"));
            return (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800/60 text-white"
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
      <SidebarFooter className="mt-auto bg-black px-4 pb-4">
        <UserButton showUserInfo={true} />
      </SidebarFooter>
    </Sidebar>
  );
}
