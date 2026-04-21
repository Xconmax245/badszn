"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  ArrowLeft, 
  Zap, 
  Settings, 
  Calendar, 
  AlertTriangle,
  X,
  Check
} from "lucide-react"
import Link from "next/link"

interface CollectionEditorProps {
  initialData?: any
}

export default function CollectionEditor({ initialData }: CollectionEditorProps) {
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [showModal, setShowModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    featuredOrder: initialData?.featuredOrder || 1,
    launchDate: initialData?.launchDate ? new Date(initialData.launchDate).toISOString().split('T')[0] : "",
  })

  const handleSave = async () => {
    setSaveStatus("saving")
    try {
      // 1. Basic Metadata Patch
      const res = await fetch(`/api/admin/collections/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error("Failed to save core metadata")
      
      // 2. Transactional Reordering (Atmosphere Engine)
      const reorderRes = await fetch("/api/api/admin/collections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialData.id,
          newOrder: formData.featuredOrder,
          isFeatured: formData.isFeatured
        })
      })

      if (!reorderRes.ok) throw new Error("Reorder failed but data was saved")

      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("[SAVE_ERROR]:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleGoLive = async () => {
    const nextData = { ...formData, isActive: true }
    setFormData(nextData)
    setLoading(true)
    try {
      await fetch(`/api/admin/collections/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData)
      })
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/collections" 
            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all font-premium"
            data-cursor="hover"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 italic">
              Atmosphere_Logic // {initialData ? "EDIT_COLLECTION" : "NEW_CAMPAIGN"}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white uppercase">
              {initialData ? formData.name : "Create Drop"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!formData.isActive && (
            <button 
              onClick={() => setShowModal(true)}
              disabled={loading}
              className="bg-white/5 border border-white/10 text-accent-red px-6 py-3 rounded-full flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent-red/10 hover:border-accent-red/20 transition-all disabled:opacity-50"
              data-cursor="hover"
            >
              <Zap className="w-4 h-4 fill-accent-red" /> {loading ? "LAUNCHING..." : "Go Live Now"}
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`
              px-8 py-3 rounded-full flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] transition-all
              ${saveStatus === "success" ? "bg-green-500 text-white" : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"}
              disabled:opacity-50
            `} 
            data-cursor="hover"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Drop</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <section className="bg-[#111111] border border-white/[0.05] rounded-3xl p-8 space-y-8 shadow-2xl">
            <div className="space-y-2 relative group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold italic">Collection Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-white/[0.08] text-white py-4 px-0 focus:outline-none focus:border-white transition-all font-black text-2xl uppercase tracking-tight"
                placeholder="E.G. DROP 001 // THE VOID"
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold italic">Narrative / Description</label>
              <textarea 
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white p-4 text-xs leading-relaxed focus:outline-none focus:border-white/20 transition-all resize-none shadow-inner"
                placeholder="The story behind this drop..."
              />
            </div>
          </section>

          <section className="bg-[#111111] border border-white/[0.05] rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-white/20" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Scheduling & Launch</h3>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold italic">Target Launch Date</label>
              <input 
                type="date"
                value={formData.launchDate}
                onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-white text-xs font-mono focus:outline-none focus:border-white/20 transition-all opacity-60 hover:opacity-100 transition-opacity"
              />
              <p className="text-[9px] text-white/20 uppercase font-medium tracking-widest bg-white/[0.02] p-3 rounded-lg border border-dashed border-white/5">
                Note: Setting a launch date will activate the Countdown SignalBar on the frontend.
              </p>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#111111] border border-white/[0.05] rounded-3xl p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Visibility States
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Live State</p>
                  <p className="text-[8px] text-white/20 uppercase mt-0.5 tracking-widest">Active & Visible</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.isActive ? "bg-green-500" : "bg-white/10"}`} onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                  <div className={`absolute top-1 bottom-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? "left-6" : "left-1"}`} />
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Featured Drop</p>
                    <p className="text-[8px] text-white/20 uppercase mt-0.5 tracking-widest">Spotlight on Home</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.isFeatured ? "bg-accent-red" : "bg-white/10"}`} onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}>
                    <div className={`absolute top-1 bottom-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isFeatured ? "left-6" : "left-1"}`} />
                  </div>
                </div>

                {formData.isFeatured && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="pt-4 border-t border-white/5 space-y-2"
                  >
                    <label className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold italic">Carousel Priority (Order)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number"
                        min="1"
                        value={formData.featuredOrder}
                        onChange={(e) => setFormData({ ...formData, featuredOrder: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg p-3 text-white text-[12px] font-black focus:outline-none focus:border-white/20 transition-all"
                      />
                      <p className="text-[8px] text-white/10 italic leading-tight">Order is re-sequenced automatically upon saving.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ GO LIVE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10 text-center space-y-6">
                <div className="w-16 h-16 bg-accent-red/10 border border-accent-red/20 rounded-2xl flex items-center justify-center mx-auto text-accent-red mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">Confirm Immediate Launch?</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed font-bold">
                  This will make the drop live immediately. All scheduled launch dates will be overridden.
                </p>

                <div className="pt-6 space-y-3">
                  <button 
                    onClick={handleGoLive}
                    disabled={loading}
                    className="w-full bg-white text-black py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent-red hover:text-white transition-all disabled:opacity-50"
                  >
                    {loading ? "INITIALIZING..." : <><Zap className="w-4 h-4 fill-current" /> YES, GO LIVE NOW</>}
                  </button>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors py-2"
                  >
                    CANCEL_ABORT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
