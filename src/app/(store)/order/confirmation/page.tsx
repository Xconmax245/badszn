"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, Package, ShieldCheck, Mail } from "lucide-react"

export default function OrderConfirmationPage() {
  const router = useRouter()

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-6">
      <div className="max-w-xl w-full text-center space-y-12">
        
        {/* Success Icon Group */}
        <div className="relative inline-flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center relative z-10"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic"
          >
            Mission_Accomplished
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]"
          >
            Order <br/> <span className="text-white/40">Secured.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/40 text-[11px] font-bold uppercase tracking-widest max-w-[320px] mx-auto leading-relaxed"
          >
            Your procurement request has been finalized. We are currently preparing your assets for deployment.
          </motion.p>
        </div>

        {/* Info Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
            <Mail className="w-5 h-5 text-white/20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Email Confirmation</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/20">Sent to your registered inbox</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
            <Package className="w-5 h-5 text-white/20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Tracking Link</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/20">Updated in 24-48 hours</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-6"
        >
          <button 
            onClick={() => router.push('/shop')}
            className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-white/70 transition-all"
          >
            Continue Browsing 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </button>
        </motion.div>

      </div>
    </div>
  )
}
