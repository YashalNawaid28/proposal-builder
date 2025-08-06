"use client";
import { Users, Grid2x2, ListTodo, Tag, House, LogOut, User } from "lucide-react";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./supabase-auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-900/60 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.email}
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
