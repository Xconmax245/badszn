'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { 
  ShoppingBag, 
  Settings2, 
  Eye, 
  EyeOff, 
  Tag, 
  Package, 
  Layout, 
  Search as SearchIcon,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Activity
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function ShopControlPanel() {
  const { data: settings, error, isLoading } = useSWR('/api/admin/shop-settings', fetcher)
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleToggle = (field: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: !prev[field] }))
    setSaveStatus('idle')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    try {
      const res = await fetch('/api/admin/shop-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSaveStatus('success')
        mutate('/api/admin/shop-settings')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-white/10" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Establishing Connection...</p>
      </div>
    )
  }

  if (!formData) return null

  return (
    <div className="space-y-16">
      {/* ─── HEADER TERMINAL ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-white/[0.03] flex items-center justify-center border border-white/10 relative group overflow-hidden">
             <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <ShoppingBag className="text-white/40 group-hover:text-white transition-colors relative z-10" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Shop_Operations</h2>
            <div className="flex items-center gap-3 mt-1">
              <Activity size={10} className="text-emerald-500 animate-pulse" />
              <p className="text-[9px] text-white/20 font-bold tracking-[0.3em] uppercase">Global_Storefront_Telemetry</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            relative group flex items-center gap-4 px-10 py-5 font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-700 overflow-hidden
            ${saveStatus === 'success' 
              ? 'bg-emerald-500 text-white border border-emerald-400' 
              : 'bg-white text-black hover:bg-white/90 active:scale-95'}
          `}
        >
          <div className="absolute inset-0 bg-black/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
          <span className="relative z-10 flex items-center gap-3">
            {isSaving ? <Loader2 className="animate-spin" size={14} /> : saveStatus === 'success' ? <CheckCircle2 size={14} /> : <Lock size={14} />}
            {saveStatus === 'success' ? 'Synchronized' : 'Commit_Changes'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* ─── MASTER CONTROL ────────────────────────────────── */}
        <div className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-white/20" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Master_Control</h3>
            </div>
            
            <div 
              onClick={() => handleToggle('shopEnabled')}
              className={`p-8 border cursor-pointer transition-all duration-700 relative overflow-hidden group ${formData.shopEnabled ? 'bg-white/[0.03] border-white/10' : 'bg-red-500/[0.02] border-red-500/10'}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <Settings2 size={48} />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-2">
                  <p className="text-sm font-black text-white uppercase tracking-widest">Storefront_Visibility</p>
                  <p className="text-[9px] text-white/30 font-bold tracking-[0.2em] leading-relaxed uppercase max-w-[250px]">
                    {formData.shopEnabled ? 'Active: All customers have access' : 'Offline: Site-wide shop gate active'}
                  </p>
                </div>
                <div className={`h-8 w-16 rounded-none p-1.5 transition-all duration-700 ${formData.shopEnabled ? 'bg-white' : 'bg-white/10'}`}>
                  <div className={`h-5 w-5 transition-all duration-700 ${formData.shopEnabled ? 'translate-x-8 bg-black' : 'translate-x-0 bg-white/20'}`} />
                </div>
              </div>
            </div>
          </section>

          {/* ─── DISPLAY LOGIC ────────────────────────────────── */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-white/20" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Display_Logic</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleOption 
                label="Sale_Badges" 
                active={formData.showSaleBadge} 
                icon={<Tag size={14} />} 
                onClick={() => handleToggle('showSaleBadge')}
              />
              <ToggleOption 
                label="New_Indicators" 
                active={formData.showNewBadge} 
                icon={<Bell size={14} />} 
                onClick={() => handleToggle('showNewBadge')}
              />
              <ToggleOption 
                label="Stock_Telemetry" 
                active={formData.showStockBadge} 
                icon={<Package size={14} />} 
                onClick={() => handleToggle('showStockBadge')}
              />
              <ToggleOption 
                label="Sold_Out_Overlay" 
                active={formData.showSoldOutOverlay} 
                icon={<EyeOff size={14} />} 
                onClick={() => handleToggle('showSoldOutOverlay')}
              />
            </div>
          </section>
        </div>

        {/* ─── INTERACTION & CONTENT ─────────────────────────── */}
        <div className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-white/20" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Interaction_Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleOption 
                label="Filter_System" 
                active={formData.enableFilters} 
                icon={<Layout size={14} />} 
                onClick={() => handleToggle('enableFilters')}
              />
              <ToggleOption 
                label="Search_Archive" 
                active={formData.enableSearch} 
                icon={<SearchIcon size={14} />} 
                onClick={() => handleToggle('enableSearch')}
              />
            </div>
          </section>

          <section className="space-y-8 pt-4">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Global_Announcement</span>
                  {!formData.announcementText && <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Optional</span>}
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={formData.announcementText || ''} 
                    onChange={(e) => handleInputChange('announcementText', e.target.value)}
                    placeholder="Enter announcement text..."
                    className="w-full bg-white/[0.02] border border-white/5 p-6 text-xs font-bold tracking-[0.1em] text-white focus:outline-none focus:border-white/20 transition-all uppercase placeholder:text-white/10"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] bg-white/20 w-0 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Featured_Category_Focus</span>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={formData.featuredCategorySlug || ''} 
                    onChange={(e) => handleInputChange('featuredCategorySlug', e.target.value)}
                    placeholder="e.g. tops, outerwear"
                    className="w-full bg-white/[0.02] border border-white/5 p-6 text-xs font-bold tracking-[0.1em] text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] bg-white/20 w-0 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {saveStatus === 'error' && (
        <div className="flex items-center gap-4 p-6 bg-red-500/5 border border-red-500/10 text-red-400 font-bold text-[10px] tracking-[0.3em] uppercase animate-in slide-in-from-top duration-500">
          <AlertCircle size={16} />
          Protocol_Error: System failed to synchronize storefront settings.
        </div>
      )}
    </div>
  )
}

function ToggleOption({ label, active, icon, onClick }: { label: string; active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 border cursor-pointer flex items-center justify-between transition-all duration-500 group relative overflow-hidden ${active ? 'bg-white/[0.05] border-white/20' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={`transition-all duration-500 ${active ? 'text-white scale-110' : 'text-white/20 scale-100'}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${active ? 'text-white' : 'text-white/30'}`}>
          {label}
        </span>
      </div>
      <div className={`h-1 w-1 rounded-full transition-all duration-700 ${active ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]' : 'bg-white/10'}`} />
    </div>
  )
}
