"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Check, 
  AlertCircle,
  Calendar,
  Layers,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CollectionFormProps {
  initialData?: any
}

export default function CollectionForm({ initialData }: CollectionFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    featuredOrder: initialData?.featuredOrder || 1,
    launchDate: initialData?.launchDate ? new Date(initialData.launchDate).toISOString().split('T')[0] : "",
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-slugify
  useEffect(() => {
    if (!isEdit && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, isEdit])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const data = new FormData()
    data.append("file", file)
    data.append("folder", "collections")

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data
      })

      if (!res.ok) throw new Error("Upload failed")
      
      const { url } = await res.json()
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } catch (err: any) {
      setError("Failed to upload image. Please try again.")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = isEdit 
        ? `/api/admin/collections/${initialData.id}` 
        : "/api/admin/collections"
      
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save")
      }

      router.push("/admin/collections")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* ─── HEADER ────────────────────────────────────────── */}
      <div className="flex items-center justify-between sticky top-0 z-40 py-8 bg-bg-primary/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/collections" 
            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1 italic">
              Atmosphere_Logic // {isEdit ? "MODIFY_CAMPAIGN" : "INITIALIZE_DROP"}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white uppercase">
              {formData.name || "New Drop"}
            </h1>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving || uploading}
          className="bg-white text-black px-10 py-4 rounded-full flex items-center gap-3 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white/90 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
        >
          {saving ? "Deploying..." : <><Save className="w-4 h-4" /> Commit Changes</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 text-red-500 animate-in slide-in-from-top duration-500">
           <AlertCircle className="w-6 h-6" />
           <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-12">
        {/* ─── MAIN CONTENT (8 Cols) ───────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black italic ml-1">Campaign Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:outline-none focus:border-white/20 transition-all"
                  placeholder="E.G. DROP 001"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black italic ml-1">System Slug</label>
                <input 
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white/40 text-sm font-mono focus:outline-none focus:border-white/20 transition-all font-bold"
                  placeholder="drop-001"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black italic ml-1">Archive Narrative (Description)</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm leading-relaxed focus:outline-none focus:border-white/20 transition-all resize-none"
                placeholder="The creative ethos behind this capsule..."
              />
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <ImageIcon className="w-5 h-5 text-white/20" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Media Assets</h3>
            </div>

            <div className="relative group">
              {formData.imageUrl ? (
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <Image src={formData.imageUrl} alt="Preview" fill className="object-cover opacity-80" />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="h-[300px] w-full border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-6 group-hover:border-white/20 transition-all bg-white/[0.01]">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                     {uploading ? <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-8 h-8" />}
                   </div>
                   <div className="text-center">
                     <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                        {uploading ? "Uploading Artifact..." : "Upload Campaign Visual"}
                     </p>
                     <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20 mt-2">JPG, PNG, WEBP (MAX 5MB)</p>
                   </div>
                   <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ─── SIDEBAR (4 Cols) ────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-3">
               <Layers className="w-4 h-4" /> Core Logic
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Active State</p>
                  <p className="text-[8px] text-white/20 uppercase mt-1 tracking-widest">Visible Archive</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`w-12 h-6 rounded-full relative transition-colors ${formData.isActive ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? "left-7" : "left-1"}`} />
                </button>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Featured Drop</p>
                    <p className="text-[8px] text-white/20 uppercase mt-1 tracking-widest">Home Editorial</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${formData.isFeatured ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                {formData.isFeatured && (
                  <div className="pt-6 mt-4 border-t border-white/5 space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <label className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-black italic px-1">Carousel Priority</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number"
                        min="1"
                        value={formData.featuredOrder}
                        onChange={(e) => setFormData({ ...formData, featuredOrder: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-20 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-lg font-black focus:outline-none focus:border-white/20 transition-all text-center"
                      />
                      <div className="flex-1">
                        <p className="text-[8px] text-white/15 uppercase font-bold tracking-widest leading-relaxed italic">
                           Higher priority ensures top-level placement in the editorial stack.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-3">
               <Calendar className="w-4 h-4" /> Manifest Date
            </h3>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black italic ml-1">Launch Sequence</label>
              <input 
                type="date"
                value={formData.launchDate}
                onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-[12px] font-mono focus:outline-none focus:border-white/20 transition-all font-bold uppercase"
              />
              <p className="text-[8px] text-white/15 uppercase font-bold tracking-widest leading-relaxed bg-white/[0.01] p-4 rounded-xl border border-dashed border-white/5">
                Note: Setting a date triggers the countdown signal on the store frontend.
              </p>
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}
