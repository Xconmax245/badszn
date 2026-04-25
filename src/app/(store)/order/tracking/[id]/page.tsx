import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle2, Clock } from "lucide-react"

function formatStatus(status: string) {
  switch (status) {
    case "PAID": return "Payment received"
    case "PROCESSING": return "Preparing your order"
    case "SHIPPED": return "On the way"
    case "DELIVERED": return "Delivered"
    default: return "Pending"
  }
}

const steps = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!order) notFound()

  const currentStepIndex = steps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/30 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Orders
        </Link>

        <header className="space-y-4">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold text-white/30 uppercase tracking-widest">Order #{order.orderNumber || order.id.slice(0, 8)}</p>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Track Order</h1>
          </div>
          
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8">
            {/* Timeline */}
            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex
                const isCurrent = idx === currentStepIndex
                
                return (
                  <div key={step} className="flex gap-6 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors ${
                      isCompleted ? 'bg-white text-black' : 'bg-black border border-white/10 text-white/20'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm font-semibold ${isCompleted ? 'text-white' : 'text-white/20'}`}>
                        {formatStatus(step)}
                      </p>
                      {isCurrent && (
                        <p className="text-[12px] text-white/40">We are currently at this stage.</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </header>

        {/* Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white/30">
              <Truck size={16} />
              <p className="text-[12px] font-semibold uppercase tracking-wider">Shipping Details</p>
            </div>
            <div className="space-y-2">
              <p className="text-[14px] text-white/60 leading-relaxed">
                {order.carrier || "Carrier not assigned"}<br />
                Tracking ID: <span className="text-white">{order.trackingNumber || "Pending"}</span>
              </p>
              {order.trackingUrl && (
                <a 
                  href={order.trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-[12px] font-semibold text-white underline underline-offset-4"
                >
                  Track on Carrier Site
                </a>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white/30">
              <Package size={16} />
              <p className="text-[12px] font-semibold uppercase tracking-wider">Items</p>
            </div>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-white/60">{item.name} <span className="text-white/20">×{item.quantity}</span></span>
                  <span className="text-white/40">₦{Number(item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
