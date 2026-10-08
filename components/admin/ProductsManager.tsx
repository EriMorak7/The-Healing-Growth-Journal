"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  PlusCircle,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  whoItsFor: string | null;
  whatsIncluded: string | null;
  price: number;
  currency: string;
  mockupImage: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
}

interface ProductsManagerProps {
  initialProducts: ProductItem[];
}

export default function ProductsManager({
  initialProducts,
}: ProductsManagerProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingProduct({
      id: "",
      name: "",
      slug: "",
      tagline: "",
      description: "",
      whoItsFor: "",
      whatsIncluded: "",
      price: 5000,
      currency: "NGN",
      mockupImage: "",
      fileUrl: "",
      isPublished: true,
      isFeatured: false,
    });
    setError("");
    setSuccess("");
  };

  const handleOpenEdit = (p: ProductItem) => {
    setIsNew(false);
    setEditingProduct({ ...p });
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    setEditingProduct(null);
    setIsNew(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setEditingProduct({ ...editingProduct, mockupImage: data.url });
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = isNew
        ? "/api/admin/products"
        : `/api/admin/products/${editingProduct.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      if (isNew) {
        setProducts([data.product, ...products]);
      } else {
        setProducts(
          products.map((p) => (p.id === data.product.id ? data.product : p))
        );
      }

      setSuccess("Product saved successfully.");
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="paper-card p-6 flex flex-col justify-between group hover:border-[#283E2C] transition-all"
          >
            <div className="space-y-3">
              {p.mockupImage && (
                <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#EAE0D1] mb-3 bg-[#F4ECE0]">
                  <img
                    src={p.mockupImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#BD7350]">
                  {formatPrice(p.price, p.currency)}
                </span>
                <span
                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-sm ${
                    p.isPublished
                      ? "bg-[#E5EDE6] text-[#283E2C]"
                      : "bg-[#F4ECE0] text-[#866746]"
                  }`}
                >
                  {p.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <h3 className="font-serif text-lg text-[#22160D] line-clamp-1">
                {p.name}
              </h3>

              <p className="text-xs text-[#6A4F35] line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EAE0D1]/80 flex items-center justify-between">
              <a
                href={`/shop/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-wider font-semibold text-[#866746] hover:text-[#283E2C] inline-flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#283E2C] bg-[#E5EDE6] hover:bg-[#D4E2D6] rounded-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 text-[#A83226] hover:bg-[#FDF2F0] rounded-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm shadow-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D1]">
              <h2 className="font-serif text-xl text-[#22160D]">
                {isNew ? "Add Digital Product" : `Edit: ${editingProduct.name}`}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded text-[#866746] hover:bg-[#EAE0D1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 text-xs bg-[#FDF2F0] border border-[#F3C8C2] text-[#A83226] rounded-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-xs bg-[#E5EDE6] border border-[#C4D9C6] text-[#283E2C] rounded-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                      slug: isNew
                        ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        : editingProduct.slug,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                    Price (NGN) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingProduct.tagline || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, tagline: e.target.value })
                  }
                  placeholder="e.g. A 30-day gentle workbook for navigating grief"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                    Who It&apos;s For
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.whoItsFor || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        whoItsFor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                    What&apos;s Included
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.whatsIncluded || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        whatsIncluded: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs"
                  />
                </div>
              </div>

              {/* Mockup Image */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1">
                  Mockup Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingProduct.mockupImage || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        mockupImage: e.target.value,
                      })
                    }
                    placeholder="/images/products/example.jpg"
                    className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs"
                  />
                  <label className="px-3 py-2 bg-[#EAE0D1] hover:bg-[#D3BEA1] rounded-sm cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded border-[#D3BEA1] text-[#283E2C] focus:ring-[#283E2C]"
                  />
                  <span className="font-semibold text-[#22160D]">Published in Shop</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="rounded border-[#D3BEA1] text-[#283E2C] focus:ring-[#283E2C]"
                  />
                  <span className="font-semibold text-[#22160D]">Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EAE0D1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-[#D3BEA1] rounded-sm hover:bg-[#EAE0D1] text-[#4F3925]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] rounded-sm font-semibold uppercase tracking-wider text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
