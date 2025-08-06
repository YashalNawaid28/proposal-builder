import { CustomSidebar } from "@/components/custom-sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <CustomSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
