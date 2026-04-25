"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/stores/cartStore"
import { Tag, Loader2, Check, X } from "lucide-react"

interface CheckoutFormProps {
  form: any
  setForm: (form: any) => void
}

const Input = ({ name, placeholder, value, onChange, type = "text" }: { name: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }) => (
  <div className="relative group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-[13px] font-medium text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/[0.05] transition-all outline-none"
    />
  </div>
)

const CouponInput = () => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { applyCoupon, removeCoupon, coupon, subtotal } = useCartStore()

  const handleApply = async () => {
    if (!code) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: subtotal() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid code")
        return
      }

      applyCoupon({
        id: data.id,
        code: data.code,
        type: data.type,
        value: data.value,
        discountAmount: data.discountAmount,
        isValid: true,
      })
      setCode("")
    } catch (err) {
      setError("System error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  if (coupon?.isValid) {
    return (
      <div className="flex items-center justify-between p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Tag size={14} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white tracking-tight">{coupon.code}</p>
            <p className="text-[11px] text-emerald-500 font-medium">Discount Applied</p>
          </div>
        </div>
        <button 
          onClick={removeCoupon}
          className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter Code"
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-[13px] font-medium text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/[0.05] transition-all outline-none"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code}
          className="px-8 rounded-2xl bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-all disabled:opacity-20 active:scale-95"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] font-medium text-red-500 ml-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CheckoutForm({ form, setForm }: CheckoutFormProps) {
  const [savedAddresses, setSavedAddresses]   = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [saveAddress, setSaveAddress]         = useState(false)

  // Fetch addresses on load
  useEffect(() => {
    fetch("/api/addresses")
      .then(res => res.json())
      .then(data => {
        if (data.addresses) {
          setSavedAddresses(data.addresses)
          const defaultAddr = data.addresses.find((a: any) => a.isDefault)
          if (defaultAddr) setSelectedAddress(defaultAddr)
        }
      })
      .catch(err => console.error("Failed to fetch addresses:", err))
  }, [])

  // Auto-fill form when selected
  useEffect(() => {
    if (!selectedAddress) return

    setForm({
      ...form,
      fullName: selectedAddress.fullName,
      phone:    selectedAddress.phone,
      line1:    selectedAddress.line1,
      city:     selectedAddress.city,
      state:    selectedAddress.state,
    })
  }, [selectedAddress])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      {/* Address Selector */}
      {savedAddresses.length > 0 && (
        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h3 className="text-[12px] font-semibold text-white/30 mb-6">Saved Addresses</h3>
          <div className="flex flex-col gap-3">
            {savedAddresses.map(addr => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                  selectedAddress?.id === addr.id 
                    ? "bg-white/5 border-white/20 shadow-aura" 
                    : "bg-white/[0.01] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[14px] font-semibold text-white tracking-tight">{addr.fullName}</p>
                  {addr.isDefault && (
                    <span className="text-[10px] font-medium bg-white/10 text-white/40 px-3 py-1 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-[12px] text-white/30 font-medium leading-relaxed">
                  {addr.line1}, {addr.city}, {addr.state}
                </p>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setSelectedAddress(null)}
            className="mt-6 text-[11px] font-semibold text-white/40 hover:text-white transition-colors"
          >
            + Add New Address
          </button>
        </section>
      )}

      <section className="space-y-8">
        <h3 className="text-[12px] font-semibold text-white/30 px-1 flex items-center gap-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-mono text-[12px]">01</span>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
          <Input name="email" placeholder="Email Address" type="email" value={form.email} onChange={handleChange} />
          <Input name="phone" placeholder="Phone Number" type="tel" value={form.phone} onChange={handleChange} />
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-[12px] font-semibold text-white/30 px-1 flex items-center gap-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-mono text-[12px]">02</span>
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Input name="line1" placeholder="Street Address" value={form.line1} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <Input name="state" placeholder="State" value={form.state} onChange={handleChange} />
          </div>
        </div>

        {/* Save address toggle */}
        <div className="mt-8 px-2">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={saveAddress} 
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="peer appearance-none w-5 h-5 border border-white/10 rounded-md checked:bg-white checked:border-white transition-all duration-300"
              />
              <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300">
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-[12px] font-medium text-white/30 group-hover:text-white/50 transition-colors">Save this address for later</span>
          </label>
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-[12px] font-semibold text-white/30 px-1 flex items-center gap-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-mono text-[12px]">03</span>
          Delivery Method
        </h3>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[13px] font-semibold text-white tracking-tight">Standard Shipping</p>
            <p className="text-[11px] text-white/30 font-medium">3-5 Business Days</p>
          </div>
          <span className="text-[12px] font-semibold text-white/60">Calculated at Summary</span>
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-[12px] font-semibold text-white/30 px-1 flex items-center gap-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-mono text-[12px]">04</span>
          Discount Code
        </h3>
        <CouponInput />
      </section>

      <section className="space-y-8">
        <h3 className="text-[12px] font-semibold text-white/30 px-1 flex items-center gap-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-mono text-[12px]">05</span>
          Payment Information
        </h3>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-white tracking-tight">Secure Payment via Paystack</p>
          </div>
          <p className="text-[12px] text-white/30 font-medium leading-relaxed">
            Card, Transfer, and Bank payment options available. All transactions are secure and encrypted.
          </p>
        </div>
      </section>
    </motion.div>
  )
}
