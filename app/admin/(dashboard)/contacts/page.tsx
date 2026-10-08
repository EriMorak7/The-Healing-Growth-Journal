import React from "react";
import { db } from "@/lib/db";
import ContactsManager from "@/components/admin/ContactsManager";

export default async function AdminContactsPage() {
  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EAE0D1]">
        <div>
          <h1 className="text-3xl font-serif text-[#22160D] tracking-tight">
            Contact Inquiries & Letters
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#866746] font-sans mt-1">
            Read and respond to messages sent by readers through the contact form
          </p>
        </div>
      </div>

      <ContactsManager initialSubmissions={submissions} />
    </div>
  );
}
