'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { 
  ShoppingBag, 
  Settings2, 
  EyeOff, 
  Tag, 
  Package, 
  Layout, 
  Search as SearchIcon,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Monitor
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
        <Loader2 className="animate-spin text-white/10" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Loading Settings</p>
      </div>
    )
  }

  if (!formData) return null

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-white/[0.03] flex items-center justify-center border border-white/10 rounded-2xl">
             <ShoppingBag className="text-white/40" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Shop Operations</h2>
            <p className="text-[10px] text-white/20 font-bold tracking-[0.3em] uppercase mt-1">Manage global storefront behavior</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            flex items-center gap-4 px-10 py-5 rounded-full font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-300
            ${saveStatus === 'success' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-white text-black hover:bg-white/90 active:scale-95'}
          `}
        >
          {isSaving ? <Loader2 className="animate-spin" size={14} /> : saveStatus === 'success' ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saveStatus === 'success' ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Visibility Control */}
        <div className="space-y-12">
          <section className="space-y-8">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Site Visibility</h3>
            
            <div 
              onClick={() => handleToggle('shopEnabled')}
              className={`p-10 rounded-[2rem] border cursor-pointer transition-all duration-500 group relative overflow-hidden ${formData.shopEnabled ? 'bg-white/[0.02] border-white/10' : 'bg-red-500/[0.02] border-red-500/10'}`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-2">
                  <p className="text-base font-black text-white uppercase tracking-tight">Active Storefront</p>
                  <p className="text-[11px] text-white/30 font-medium tracking-wide leading-relaxed uppercase">
                    {formData.shopEnabled ? 'All customers currently have access' : 'Store is hidden from public view'}
                  </p>
                </div>
                <div className={`h-8 w-14 rounded-full p-1.5 transition-all duration-500 ${formData.shopEnabled ? 'bg-white' : 'bg-white/10'}`}>
                  <div className={`h-5 w-5 rounded-full transition-all duration-500 ${formData.shopEnabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/20'}`} />
                </div>
              </div>
            </div>
          </section>

          {/* Product Tags */}
          <section className="space-y-8">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Display Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleOption 
                label="Sale Badges" 
                active={formData.showSaleBadge} 
                icon={<Tag size={16} />} 
                onClick={() => handleToggle('showSaleBadge')}
              />
              <ToggleOption 
                label="New Indicators" 
                active={formData.showNewBadge} 
                icon={<Bell size={16} />} 
                onClick={() => handleToggle('showNewBadge')}
              />
              <ToggleOption 
                label="Stock Counts" 
                active={formData.showStockBadge} 
                icon={<Package size={16} />} 
                onClick={() => handleToggle('showStockBadge')}
              />
              <ToggleOption 
                label="Sold Out Overlay" 
                active={formData.showSoldOutOverlay} 
                icon={<EyeOff size={16} />} 
                onClick={() => handleToggle('showSoldOutOverlay')}
              />
            </div>
          </section>
        </div>

        {/* Global Configuration */}
        <div className="space-y-12">
          <section className="space-y-8">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Store Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleOption 
                label="Filter System" 
                active={formData.enableFilters} 
                icon={<Layout size={16} />} 
                onClick={() => handleToggle('enableFilters')}
              />
              <ToggleOption 
                label="Search Archive" 
                active={formData.enableSearch} 
                icon={<SearchIcon size={16} />} 
                onClick={() => handleToggle('enableSearch')}
              />
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Global Announcement</label>
                <input 
                  type="text" 
                  value={formData.announcementText || ''} 
                  onChange={(e) => handleInputChange('announcementText', e.target.value)}
                  placeholder="Enter text (e.g. Free Shipping on orders over...)"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Featured Category Focus</label>
                <input 
                  type="text" 
                  value={formData.featuredCategorySlug || ''} 
                  onChange={(e) => handleInputChange('featuredCategorySlug', e.target.value)}
                  placeholder="Slug (e.g. tops, outerwear)"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {saveStatus === 'error' && (
        <div className="flex items-center gap-4 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl text-red-400 font-bold text-[10px] tracking-[0.3em] uppercase animate-in slide-in-from-top duration-500">
          <AlertCircle size={16} />
          Error: Failed to update storefront settings.
        </div>
      )}
    </div>
  )
}

function ToggleOption({ label, active, icon, onClick }: { label: string; active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 rounded-3xl border cursor-pointer flex items-center justify-between transition-all duration-300 group relative ${active ? 'bg-white/[0.04] border-white/20' : 'bg-transparent border-white/5 opacity-50 hover:opacity-100'}`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={`transition-all duration-300 ${active ? 'text-white' : 'text-white/20'}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors duration-300 ${active ? 'text-white' : 'text-white/30'}`}>
          {label}
        </span>
      </div>
      <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${active ? 'bg-white' : 'bg-white/10'}`} />
    </div>
  )
}
