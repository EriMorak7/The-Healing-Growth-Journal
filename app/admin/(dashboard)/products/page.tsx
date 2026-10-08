import React from "react";
import { db } from "@/lib/db";
import ProductsManager from "@/components/admin/ProductsManager";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EAE0D1]">
        <div>
          <h1 className="text-3xl font-serif text-[#22160D] tracking-tight">
            Digital Products & Shop
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#866746] font-sans mt-1">
            Manage your digital journals, recovery workbooks, and downloadable guides
          </p>
        </div>
      </div>

      <ProductsManager initialProducts={products} />
    </div>
  );
}
