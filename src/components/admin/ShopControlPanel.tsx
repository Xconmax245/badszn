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
  Loader2
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
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="animate-spin text-white/20" />
      </div>
    )
  }

  if (!formData) return null

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-accent-red/10 flex items-center justify-center border border-accent-red/20">
            <ShoppingBag className="text-accent-red" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Shop_Operations</h2>
            <p className="text-xs text-white/40 font-mono tracking-widest mt-1 uppercase">Global_Storefront_Telemetry</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            flex items-center gap-3 px-6 py-3 font-mono text-[11px] tracking-[0.3em] uppercase transition-all duration-300
            ${saveStatus === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-white text-black hover:bg-white/90'}
          `}
        >
          {isSaving ? <Loader2 className="animate-spin" size={14} /> : saveStatus === 'success' ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saveStatus === 'success' ? 'Sync_Applied' : 'Commit_Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Core Access */}
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 size={14} className="text-white/20" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Master_Control</h3>
            </div>
            
            {/* Shop Enabled Toggle */}
            <div 
              onClick={() => handleToggle('shopEnabled')}
              className={`p-6 border cursor-pointer transition-all duration-500 group ${formData.shopEnabled ? 'bg-accent-red/5 border-accent-red/20' : 'bg-white/[0.02] border-white/5'}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Storefront_Visibility</p>
                  <p className="text-[10px] text-white/30 font-mono tracking-widest leading-loose uppercase">
                    {formData.shopEnabled ? 'Active: All customers have access' : 'Offline: Site-wide shop gate active'}
                  </p>
                </div>
                <div className={`h-6 w-12 rounded-none p-1 transition-colors duration-500 ${formData.shopEnabled ? 'bg-accent-red' : 'bg-white/10'}`}>
                  <div className={`h-4 w-4 bg-white transition-transform duration-500 ${formData.shopEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={14} className="text-white/20" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Display_Logic</h3>
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

        {/* Right Column: Interaction & Content */}
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layout size={14} className="text-white/20" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Interaction_Settings</h3>
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

          <section className="space-y-6 pt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Global_Announcement</span>
                <div className="mt-2 relative">
                  <input 
                    type="text" 
                    value={formData.announcementText || ''} 
                    onChange={(e) => handleInputChange('announcementText', e.target.value)}
                    placeholder="Enter announcement text..."
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-[11px] font-mono tracking-widest text-white focus:outline-none focus:border-accent-red transition-colors uppercase"
                  />
                  {!formData.announcementText && <div className="absolute top-1/2 -translate-y-1/2 right-4 h-1.5 w-1.5 rounded-full bg-white/10" />}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Featured_Category_Focus</span>
                <input 
                  type="text" 
                  value={formData.featuredCategorySlug || ''} 
                  onChange={(e) => handleInputChange('featuredCategorySlug', e.target.value)}
                  placeholder="e.g. tops, outerwear"
                  className="w-full mt-2 bg-white/[0.03] border border-white/10 p-4 text-[11px] font-mono tracking-widest text-white focus:outline-none focus:border-accent-red transition-colors"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {saveStatus === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] tracking-[0.2em] uppercase">
          <AlertCircle size={14} />
          Protocol_Error: Failed to synchronize shop settings.
        </div>
      )}
    </div>
  )
}

function ToggleOption({ label, active, icon, onClick }: { label: string; active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 border cursor-pointer flex items-center justify-between transition-all duration-300 group ${active ? 'bg-white/[0.04] border-white/20' : 'bg-transparent border-white/5 opacity-50'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-colors duration-300 ${active ? 'text-white' : 'text-white/20'}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-mono tracking-widest uppercase transition-colors duration-300 ${active ? 'text-white' : 'text-white/20'}`}>
          {label}
        </span>
      </div>
      <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${active ? 'bg-accent-red shadow-[0_0_8px_#8B0000]' : 'bg-white/10'}`} />
    </div>
  )
}
