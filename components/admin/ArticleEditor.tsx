"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Heart,
  Sparkles,
  Eye,
  CheckCircle2,
  Trash2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Minus,
  Edit3,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage?: string | null;
  authorName?: string;
  readingTime?: string;
  isPublished?: boolean;
  publishedAt?: string | Date;
  isSundayLove?: boolean;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryIds?: string[];
  tags?: string[];
}

interface ArticleEditorProps {
  initialData?: ArticleData;
  categories: Category[];
  isEditing?: boolean;
}

export default function ArticleEditor({
  initialData,
  categories,
  isEditing = false,
}: ArticleEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "Glory");
  const [readingTime, setReadingTime] = useState(initialData?.readingTime || "4 min read");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isSundayLove, setIsSundayLove] = useState(initialData?.isSundayLove ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categoryIds || []
  );
  const [tagInput, setTagInput] = useState(
    initialData?.tags ? initialData.tags.join(", ") : ""
  );

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el) {
      setBody((prev) => prev + prefix + suffix);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected || "text").length
      );
    }, 50);
  };

  // Auto generate slug from title if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFeaturedImage(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleInsertBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const imgTag = `\n\n<figure class="my-8 text-center"><img src="${data.url}" alt="Story Illustration" class="rounded-sm mx-auto shadow-md max-h-[500px] object-cover border border-[#EAE0D1]" /></figure>\n\n`;
      setBody((prev) => prev + imgTag);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (publishState: boolean) => {
    setError("");
    setSuccess("");
    setSaving(true);

    const tagsArray = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      excerpt,
      body,
      featuredImage: featuredImage || null,
      authorName,
      readingTime,
      isPublished: publishState,
      isSundayLove,
      isFeatured,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      categoryIds: selectedCategories,
      tags: tagsArray,
    };

    try {
      const url = isEditing
        ? `/api/admin/articles/${initialData?.id}`
        : "/api/admin/articles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save article");

      setSuccess("Piece saved successfully.");
      setTimeout(() => {
        router.push("/admin/articles");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE0D1]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="p-2 rounded hover:bg-[#EAE0D1] text-[#866746] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#22160D] tracking-tight">
              {isEditing ? "Edit Article" : "Write New Piece"}
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#866746] font-sans mt-0.5">
              {isEditing ? `Modifying: ${title}` : "Compose reflections, essays, or Sunday letters"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm bg-[#FAF7F2] text-[#4F3925] border border-[#D3BEA1] hover:bg-[#EAE0D1] transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 text-xs uppercase tracking-widest font-bold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Publish Piece"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-sm bg-[#FDF2F0] border border-[#F3C8C2] text-xs text-[#A83226]">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-sm bg-[#E5EDE6] border border-[#C4D9C6] text-xs text-[#283E2C] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Two-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Title, Excerpt, Body Editor (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="paper-card p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#4F3925] mb-2">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. To Hold Love Tenderly, Even When It Must Rest"
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm font-serif text-lg text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#866746] mb-1.5">
                URL Slug *
              </label>
              <div className="flex items-center gap-2 text-xs text-[#866746]">
                <span className="font-mono opacity-60">/journal/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="to-hold-love-tenderly"
                  className="flex-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm font-mono text-xs text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#4F3925] mb-2">
                Short Excerpt / Deck *
              </label>
              <textarea
                required
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A warm, concise 1-2 sentence preview for archive cards and search snippets..."
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-sm font-sans text-[#22160D] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
              />
            </div>

            {/* Body Content Editor with Studio Toolbar & Live Preview */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#EAE0D1]">
                {/* Tabs: Write vs Live Preview */}
                <div className="flex items-center gap-1 bg-[#F4ECE0] p-1 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all ${
                      activeTab === "edit"
                        ? "bg-[#FAF7F2] text-[#22160D] shadow-sm"
                        : "text-[#866746] hover:text-[#22160D]"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all ${
                      activeTab === "preview"
                        ? "bg-[#FAF7F2] text-[#22160D] shadow-sm"
                        : "text-[#866746] hover:text-[#22160D]"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Reader Preview</span>
                  </button>
                </div>

                {/* Inline Image Inserter Button */}
                <label className="inline-flex items-center gap-1.5 text-xs text-[#283E2C] hover:underline cursor-pointer font-semibold">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Insert Story Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInsertBodyImage}
                    className="hidden"
                  />
                </label>
              </div>

              {activeTab === "edit" ? (
                <div className="space-y-2">
                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 bg-[#F4ECE0]/60 p-1.5 rounded-sm border border-[#E6DCCE]">
                    <button
                      type="button"
                      onClick={() => insertFormatting("**", "**")}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] font-bold text-xs"
                      title="Bold (**text**)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("*", "*")}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] italic text-xs"
                      title="Italic (*text*)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#D3BEA1] mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n\n## ", "\n\n")}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] text-xs font-semibold"
                      title="Heading 2 (## Section)"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n\n### ", "\n\n")}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] text-xs font-semibold"
                      title="Heading 3 (### Sub-section)"
                    >
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#D3BEA1] mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n\n> "', '"\n\n')}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] text-xs"
                      title='Quote (> "Reflective line")'
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n\n- ", "\n- \n\n")}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] text-xs"
                      title="Bullet List (- item)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n\n---\n\n")}
                      className="p-1.5 rounded hover:bg-[#EAE0D1] text-[#4F3925] text-xs"
                      title="Divider line (---)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    required
                    rows={18}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your article paragraphs here. Separate paragraphs with a blank line. Use the toolbar buttons above for quotes, headings, and formatting."
                    className="w-full px-5 py-4 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm font-editorial text-base sm:text-lg text-[#22160D] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
                  />
                  <span className="block text-[11px] text-[#866746]">
                    Word count: ~{body.trim() ? body.trim().split(/\s+/).length : 0} words • First paragraph automatically gets an editorial drop cap
                  </span>
                </div>
              ) : (
                /* Live Reader Preview */
                <div className="p-6 sm:p-8 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm space-y-6">
                  {featuredImage && (
                    <div className="aspect-[16/9] rounded-sm overflow-hidden border border-[#EAE0D1]">
                      <img src={featuredImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-2 border-b border-[#EAE0D1] pb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {isSundayLove && (
                        <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-bold bg-[#E5EDE6] text-[#283E2C] rounded-sm">
                          The Sunday Love Series
                        </span>
                      )}
                      <span className="text-xs text-[#866746]">
                        By {authorName} • {readingTime}
                      </span>
                    </div>
                    <h2 className="text-3xl font-serif text-[#22160D]">
                      {title || "Untitled Piece"}
                    </h2>
                    {excerpt && (
                      <p className="text-sm font-editorial text-[#6A4F35] italic">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  <div className="prose prose-stone max-w-none text-[#22160D] font-editorial text-lg leading-relaxed space-y-6">
                    {body.split("\n\n").map((block, idx) => {
                      const trimmed = block.trim();
                      if (!trimmed) return null;

                      if (trimmed.startsWith("<figure") || trimmed.startsWith("<img")) {
                        return <div key={idx} dangerouslySetInnerHTML={{ __html: trimmed }} />;
                      }

                      if (trimmed.startsWith("## ")) {
                        return <h2 key={idx} className="font-serif text-2xl text-[#22160D] pt-4">{trimmed.replace("## ", "")}</h2>;
                      }

                      if (trimmed.startsWith("### ")) {
                        return <h3 key={idx} className="font-serif text-xl text-[#22160D] pt-2">{trimmed.replace("### ", "")}</h3>;
                      }

                      if (trimmed.startsWith("> ")) {
                        return (
                          <blockquote key={idx} className="border-l-2 border-[#283E2C] pl-4 italic text-[#283E2C] bg-[#F4ECE0]/50 py-2 pr-3 my-4">
                            {trimmed.replace(/^>\s*/, "")}
                          </blockquote>
                        );
                      }

                      if (trimmed === "---") {
                        return <div key={idx} className="w-16 h-[1px] bg-[#C4B19B] mx-auto my-6" />;
                      }

                      if (idx === 0) {
                        return (
                          <p key={idx} className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#283E2C] first-letter:leading-none text-[#362618]">
                            {trimmed}
                          </p>
                        );
                      }

                      return <p key={idx}>{trimmed}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Metadata, Cover Image (1 Col) */}
        <div className="space-y-6">
          {/* Featured Cover Image Card */}
          <div className="paper-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#4F3925]">
              Featured Cover Image
            </h3>

            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-[#D3BEA1]">
                  <img
                    src={featuredImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFeaturedImage("")}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A83226] hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-[#D3BEA1] rounded-sm p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F4ECE0]/50 transition-colors">
                  <Upload className="w-6 h-6 text-[#866746]" />
                  <span className="text-xs font-semibold text-[#4F3925]">
                    {uploading ? "Uploading..." : "Click to Upload Photo"}
                  </span>
                  <span className="text-[10px] text-[#866746]">
                    PNG, JPG, WebP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                <div className="pt-2">
                  <span className="block text-[10px] uppercase tracking-wider text-[#866746] mb-1">
                    Or Image URL
                  </span>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="/images/articles/example.jpg"
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-sans text-[#22160D]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pillars & Categories */}
          <div className="paper-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#4F3925]">
              What We Write About (Pillars)
            </h3>
            <div className="space-y-2.5">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 text-xs text-[#22160D] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                    className="rounded border-[#D3BEA1] text-[#283E2C] focus:ring-[#283E2C]"
                  />
                  <span className="font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Publication Series & Visibility */}
          <div className="paper-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#4F3925]">
              Series & Placement
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSundayLove}
                  onChange={(e) => setIsSundayLove(e.target.checked)}
                  className="mt-0.5 rounded border-[#D3BEA1] text-[#283E2C] focus:ring-[#283E2C]"
                />
                <div>
                  <span className="block text-xs font-semibold text-[#22160D]">
                    The Sunday Love Series
                  </span>
                  <span className="block text-[11px] text-[#866746]">
                    Feature in dedicated Sunday love letters collection
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-0.5 rounded border-[#D3BEA1] text-[#283E2C] focus:ring-[#283E2C]"
                />
                <div>
                  <span className="block text-xs font-semibold text-[#22160D]">
                    Featured on Homepage
                  </span>
                  <span className="block text-[11px] text-[#866746]">
                    Pin as lead featured piece on home hero
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="mt-0.5 rounded border-[#D3BEA1] text-[#283E2C] focus:ring-[#283E2C]"
                />
                <div>
                  <span className="block text-xs font-semibold text-[#22160D]">
                    Published Status
                  </span>
                  <span className="block text-[11px] text-[#866746]">
                    Visible to public readers on the website
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Metadata & Tags */}
          <div className="paper-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#4F3925]">
              Details & Tags
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#866746] mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-sans text-[#22160D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#866746] mb-1">
                  Reading Time
                </label>
                <input
                  type="text"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  placeholder="e.g. 4 min read"
                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-sans text-[#22160D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#866746] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="grief, love, healing, hope"
                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-sans text-[#22160D]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
