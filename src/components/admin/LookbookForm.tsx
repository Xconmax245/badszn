"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  AlertCircle,
  Shapes,
  Eye,
  Hash
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface LookbookFormProps {
  initialData?: any
}

// "SMALL", "MEDIUM", "LARGE", "OVERSIZED"
const LAYOUT_TYPES = [
  { value: "SMALL", label: "Small / Portrait", desc: "Narrow aesthetic focus" },
  { value: "MEDIUM", label: "Medium / Standard", desc: "Balanced narrative" },
  { value: "LARGE", label: "Large / Feature", desc: "Wide immersion" },
  { value: "OVERSIZED", label: "Oversized / Hero", desc: "Massive scale impact" }
]

export default function LookbookForm({ initialData }: LookbookFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    imageUrl: initialData?.imageUrl || "",
    layoutType: initialData?.layoutType || "MEDIUM",
    sequenceGroup: initialData?.sequenceGroup || "",
    sortOrder: initialData?.sortOrder || 1,
    isPublished: initialData?.isPublished ?? false,
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const data = new FormData()
    data.append("file", file)
    data.append("folder", "lookbook")

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
        ? `/api/admin/lookbook/${initialData.id}` 
        : "/api/admin/lookbook"
      
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save")
      }

      router.push("/admin/lookbook")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* ─── HEADER ────────────────────────────────────────── */}
      <div className="flex items-center justify-between sticky top-0 z-40 py-8 bg-bg-primary/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/lookbook" 
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-red)] mb-2 italic flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full animate-pulse" />
              Editorial Sequence // {isEdit ? "MODIFY_ENTRY" : "INITIALIZE_ENTRY"}
            </div>
            <h1 className="text-4xl font-black tracking-[-0.03em] uppercase text-white leading-none">
              {formData.title || "Untitled Visual"}
            </h1>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving || uploading}
          className="bg-white text-black px-10 py-4 rounded-full flex items-center gap-3 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[var(--accent-red)] hover:text-white active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] disabled:opacity-50"
        >
          {saving ? "Deploying..." : <><Save className="w-5 h-5" /> Commit to Archive</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 text-red-500 animate-in slide-in-from-top duration-500">
           <AlertCircle className="w-6 h-6" />
           <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 lg:gap-12 relative">
        <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.05"/%3E%3C/svg%3E\')] pointer-events-none opacity-50 mix-blend-overlay'} />

        {/* ─── MAIN CONTENT (7 Cols) ───────────────────────── */}
        <div className="col-span-12 lg:col-span-7 space-y-10 z-10">
          <section className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative group transition-all duration-700 hover:border-white/20">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Upload className="w-48 h-48 -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            </div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
               <div className="w-1 h-6 bg-[var(--accent-red)]" />
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Cinematic Asset</h3>
            </div>

            <div className="relative group/upload z-10">
              {formData.imageUrl ? (
                <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#050505]">
                  <Image src={formData.imageUrl} alt="Preview" fill className="object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="w-16 h-16 rounded-full bg-red-600 border border-white/20 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-[500px] w-full border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-6 hover:border-white/40 hover:bg-white/5 transition-all bg-white/[0.02] cursor-pointer relative overflow-hidden group-hover/upload:shadow-[0_0_50px_rgba(255,255,255,0.03)]">
                   <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover/upload:scale-110 group-hover/upload:bg-white/10 group-hover/upload:text-white transition-all duration-500">
                     {uploading ? <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-8 h-8" />}
                   </div>
                   <div className="text-center z-10">
                     <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white">
                        {uploading ? "Ingesting Media..." : "Drag visual here or click"}
                     </p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-3">High-Res JPG, PNG, WEBP Only</p>
                   </div>
                   <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                   />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ─── SIDEBAR (5 Cols) ────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 space-y-8 z-10">
          
          <section className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all duration-700">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-1 h-6 bg-white/40" />
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Meta Data</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Identifier (Optional)
                </label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 p-4 text-white text-lg font-black focus:outline-none focus:border-[var(--accent-red)] transition-all placeholder:text-white/10"
                  placeholder="e.g. Look 01 - The Trench"
                />
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black flex items-center gap-2">
                  Sequence Group
                </label>
                <input 
                  type="text"
                  value={formData.sequenceGroup}
                  onChange={(e) => setFormData({ ...formData, sequenceGroup: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm font-bold focus:outline-none focus:border-white/30 transition-all uppercase tracking-widest placeholder:text-white/10"
                  placeholder="e.g. FW26_STREET"
                />
                <p className="text-[9px] font-bold tracking-[0.1em] text-white/20 uppercase mt-2">Groups visuals from the same shoot together.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <div className="space-y-3 flex-1">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">Sort Order</label>
                  <input 
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center text-lg font-black focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-black/40 backdrop-blur-2xl border border-[var(--accent-red)]/30 rounded-[2.5rem] p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)] hover:border-[var(--accent-red)]/60 transition-all duration-700">
            <div className="flex items-center gap-4 mb-8">
               <Shapes className="w-5 h-5 text-[var(--accent-red)] animate-pulse" />
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-red)]">Architecture</h3>
            </div>
            
            <div className="space-y-3">
              {LAYOUT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, layoutType: type.value })}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                    formData.layoutType === type.value
                      ? "bg-[var(--accent-red)]/10 border-[var(--accent-red)] shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-[11px] font-black uppercase tracking-widest ${formData.layoutType === type.value ? "text-white" : "text-white/60"}`}>
                      {type.label}
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${formData.layoutType === type.value ? "text-red-400" : "text-white/20"}`}>
                      {type.desc}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.layoutType === type.value ? "border-red-500" : "border-white/20"}`}>
                    {formData.layoutType === type.value && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                   <Eye className="w-4 h-4 text-white/40" />
                 </div>
                 <div>
                   <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Publish Status</p>
                   <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/30 mt-1">Visible on frontend</p>
                 </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                className={`w-14 h-7 rounded-full relative transition-all duration-500 ${formData.isPublished ? "bg-[var(--accent-red)] shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-400" : "bg-white/10 border border-white/5"}`}
              >
                <div className={`absolute top-1 bottom-1 w-5 h-5 bg-white rounded-full transition-all tracking-widest flex items-center justify-center ${formData.isPublished ? "left-8" : "left-1"}`} />
              </button>
            </div>
          </section>

        </div>
      </div>
    </form>
  )
}
