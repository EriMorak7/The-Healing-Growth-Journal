import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Desk | The Healing & Growth Journal",
  description: "Editorial management portal",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col lg:flex-row font-sans text-[#22160D]">
      <AdminSidebar user={session} />
      <main className="flex-1 p-6 sm:p-10 lg:p-12 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
