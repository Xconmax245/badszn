"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  MessageCircle, 
  Type, 
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Settings2,
  Mail,
  Zap,
  Globe2,
  Lock
} from "lucide-react"

interface SiteConfigFormProps {
  initialData?: any
}

export default function SiteConfigForm({ initialData }: SiteConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const DEFAULT_LINKS = {
    shop: [{ label: "All Products", href: "/shop" }, { label: "New Drops", href: "/shop/new" }, { label: "Collections", href: "/shop/collections" }, { label: "Lookbook", href: "/lookbook" }],
    company: [{ label: "Ethos", href: "/#ethos" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }],
    support: [{ label: "Shipping", href: "/shipping" }, { label: "Returns", href: "/returns" }, { label: "FAQs", href: "/faq" }],
    access: [{ label: "Login", href: "/login" }, { label: "Waitlist", href: "/#waitlist" }],
  }

  const [formData, setFormData] = useState({
    announcementText: initialData?.announcementText || "",
    heroHeadline: initialData?.heroHeadline || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    ethosText: initialData?.ethosText || "",
    maintenanceMode: initialData?.maintenanceMode || false,
    lowStockThreshold: initialData?.lowStockThreshold || 5,
    instagramUrl: initialData?.instagramUrl || "",
    tiktokUrl: initialData?.tiktokUrl || "",
    twitterUrl: initialData?.twitterUrl || "",
    contactEmail: initialData?.contactEmail || "",
    // Footer
    brandMessage: initialData?.brandMessage || "",
    waitlistEnabled: initialData?.waitlistEnabled ?? true,
    waitlistText: initialData?.waitlistText || "",
    footerLinks: (initialData?.footerLinks as typeof DEFAULT_LINKS) || DEFAULT_LINKS,
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    
    try {
      const res = await fetch("/api/admin/config", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData),
      })
      
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-16 pb-40">
      {/* ─── SYSTEM CRITICAL ────────────────────────────────── */}
      <section className="bg-black border border-white/10 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-white/40" /> System Overrides
            </h3>
            <p className="text-[10px] font-medium text-white/20 uppercase mt-2 tracking-widest">Global Operations Killswitch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-3xl transition-all hover:bg-white/[0.04]">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${formData.maintenanceMode ? "bg-red-500/10 text-red-500" : "bg-white/5 text-white/20"}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">Maintenance Mode</p>
                <p className="text-[10px] text-white/20 uppercase mt-1 font-bold tracking-widest">Toggle site visibility</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
              className={`w-14 h-8 rounded-full relative transition-all duration-500 ${formData.maintenanceMode ? "bg-red-600" : "bg-white/10"}`}
            >
              <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 ${formData.maintenanceMode ? "left-7.5" : "left-1.5"}`} />
            </button>
          </div>

          {/* Stock Threshold */}
          <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/5 text-white/20 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">Stock Threshold</p>
                <p className="text-[10px] text-white/20 uppercase mt-1 font-bold tracking-widest">Low stock alert level</p>
              </div>
            </div>
            <input 
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
              className="w-20 bg-black border border-white/10 rounded-xl py-3 text-center text-sm font-bold text-white focus:outline-none focus:border-white/30 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ─── MESSAGING & CONTENT ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-black border border-white/10 rounded-[2.5rem] p-10 space-y-8 group transition-all">
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/20 flex items-center gap-3 uppercase">
            <Megaphone className="w-4 h-4" /> Announcement Bar
          </h3>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Global Message</label>
            <input 
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-white text-sm font-bold tracking-tight focus:outline-none focus:border-white/10 focus:bg-white/[0.04] transition-all"
              placeholder="e.g. Free shipping on all orders over $200"
            />
          </div>
        </section>

        <section className="bg-black border border-white/10 rounded-[2.5rem] p-10 space-y-8 group transition-all">
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/20 flex items-center gap-3 uppercase">
            <MessageCircle className="w-4 h-4" /> Brand Narrative
          </h3>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Marquee Statement</label>
            <textarea 
              rows={3}
              value={formData.ethosText}
              onChange={(e) => setFormData({ ...formData, ethosText: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-white text-sm leading-relaxed font-medium focus:outline-none focus:border-white/10 transition-all resize-none"
              placeholder="Describe the brand ethos..."
            />
          </div>
        </section>
      </div>

      {/* ─── IDENTITY & SOCIALS ────────────────────────────── */}
      <section className="bg-black border border-white/10 rounded-[2.5rem] p-10 space-y-12">
        <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/20 flex items-center gap-3 uppercase">
            <Globe2 className="w-4 h-4" /> Global Presence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold flex items-center gap-3">
               <Globe className="w-4 h-4 text-white/30" /> Instagram
            </label>
            <input 
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-4 text-sm font-medium focus:outline-none focus:border-white transition-all"
              placeholder="@brand_official"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold flex items-center gap-3">
               <Zap className="w-4 h-4 text-white/30" /> Twitter / X
            </label>
            <input 
              type="text"
              value={formData.twitterUrl}
              onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-4 text-sm font-medium focus:outline-none focus:border-white transition-all"
              placeholder="@brand_archive"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold flex items-center gap-3">
               <Mail className="w-4 h-4 text-white/30" /> Contact Email
            </label>
            <input 
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-4 text-sm font-medium focus:outline-none focus:border-white transition-all"
              placeholder="ops@brand.com"
            />
          </div>
        </div>
      </section>

      {/* ─── HERO CONFIGURATION ────────────────────────────── */}
      <section className="bg-black border border-white/10 rounded-[3rem] p-12 space-y-12 relative overflow-hidden">
        <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/20 flex items-center gap-3 uppercase">
          <Type className="w-4 h-4" /> Hero Engine
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Main Heading</label>
            <input 
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-6 px-0 focus:outline-none focus:border-white transition-all text-3xl font-black tracking-tight"
              placeholder="BAD SZN"
            />
          </div>
          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Campaign Subtitle</label>
            <input 
              type="text"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-6 px-0 focus:outline-none focus:border-white transition-all text-sm font-bold uppercase tracking-widest"
              placeholder="UNISEX STREETWEAR — COLLECTION 01"
            />
          </div>
        </div>
      </section>

      {/* ─── FOOTER CONFIGURATION ───────────────────────── */}
      <section className="bg-black border border-white/10 rounded-[2.5rem] p-10 space-y-12">
        <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/20 flex items-center gap-3 uppercase">
          <Globe2 className="w-4 h-4" /> Footer Terminal
        </h3>

        {/* Brand Message + Waitlist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Brand Tagline</label>
            <input
              type="text"
              value={formData.brandMessage}
              onChange={(e) => setFormData({ ...formData, brandMessage: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-4 text-sm font-medium focus:outline-none focus:border-white transition-all"
              placeholder="Limited by design."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Waitlist CTA Text</label>
            <input
              type="text"
              value={formData.waitlistText}
              onChange={(e) => setFormData({ ...formData, waitlistText: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 text-white py-4 text-sm font-medium focus:outline-none focus:border-white transition-all"
              placeholder="Get early access."
            />
          </div>
        </div>

        {/* Waitlist toggle */}
        <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
          <div>
            <p className="text-[13px] font-bold text-white">Waitlist Input</p>
            <p className="text-[10px] text-white/20 uppercase mt-1 font-bold tracking-widest">Show in footer</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, waitlistEnabled: !formData.waitlistEnabled })}
            className={`w-14 h-8 rounded-full relative transition-all duration-500 ${formData.waitlistEnabled ? "bg-[var(--accent-red)]" : "bg-white/10"}`}
          >
            <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 ${formData.waitlistEnabled ? "left-7" : "left-1.5"}`} />
          </button>
        </div>

        {/* Footer Links Editor — 4 locked columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          {(["shop", "company", "support", "access"] as const).map((col) => (
            <div key={col} className="space-y-4">
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-[var(--accent-red)]">— {col}</h4>
              {formData.footerLinks[col].map((link, idx) => (
                <div key={idx} className="space-y-2 border-b border-white/5 pb-4">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...formData.footerLinks[col]]
                      updated[idx] = { ...updated[idx], label: e.target.value }
                      setFormData({ ...formData, footerLinks: { ...formData.footerLinks, [col]: updated } })
                    }}
                    className="w-full bg-transparent text-white/60 text-[11px] font-bold focus:outline-none border-b border-white/10 focus:border-white/30 py-1 transition-all"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...formData.footerLinks[col]]
                      updated[idx] = { ...updated[idx], href: e.target.value }
                      setFormData({ ...formData, footerLinks: { ...formData.footerLinks, [col]: updated } })
                    }}
                    className="w-full bg-transparent text-white/20 text-[10px] font-medium focus:outline-none border-b border-white/5 focus:border-white/20 py-1 transition-all"
                    placeholder="/path"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── ACTION BAR ────────────────────────────────────── */}
      <div className="fixed bottom-12 left-[130px] right-0 z-[60] flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto"
        >
          <button 
            type="submit"
            disabled={loading}
            className={`
              min-w-[450px] py-6 px-16 rounded-full text-[13px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl border
              ${success ? "bg-emerald-600 text-white border-emerald-500" : "bg-white text-black hover:bg-white/90 active:scale-95 border-white"}
            `}
            data-cursor="hover"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Synchronizing...
              </span>
            ) : success ? (
              <><CheckCircle2 className="w-5 h-5" /> Configuration Locked</>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" /> 
                Update Site Configuration
              </>
            )}
          </button>
        </motion.div>
      </div>
    </form>
  )
}
