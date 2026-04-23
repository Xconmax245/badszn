import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  Package, 
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { StatusUpdateAction } from "@/components/admin/StatusUpdateAction"

export default async function OrderDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        }
      }
    }
  })

  if (!order) notFound()

  // Parse shipping address from JSON
  let address: any = null
  if (order.shippingAddress) {
    try {
      address = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress
    } catch (e) {
      console.error("Failed to parse shipping address JSON", e)
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/orders"
            className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black uppercase tracking-tight text-white">#{order.orderNumber}</h1>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                order.paymentStatus === 'PAID' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              Registry_Entry: {order.id} · Logged {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusUpdateAction orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* ─── ORDER ITEMS ─── */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <div className="bg-[#111111] border border-white/[0.05] rounded-[2.5rem] overflow-hidden p-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-10">Manifest_Registry</h3>
            <div className="space-y-8">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-8 group">
                  <div className="w-24 h-32 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    {item.imageUrl || item.product?.images[0]?.url ? (
                      <img 
                        src={item.imageUrl || item.product?.images[0]?.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[14px] font-black text-white uppercase tracking-wider mb-2">{item.name}</h4>
                        <div className="flex gap-4">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Size: <span className="text-white/60">{item.size}</span></p>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Qty: <span className="text-white/60">{item.quantity}</span></p>
                        </div>
                      </div>
                      <p className="font-mono text-[14px] text-white">{formatNaira(Number(item.price))}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                      <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">Line_Total</p>
                      <p className="font-mono text-[12px] text-white/40">{formatNaira(Number(item.total))}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t-2 border-white/5 space-y-4">
              <div className="flex justify-between items-center text-white/30">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Subtotal</p>
                <p className="font-mono text-[13px]">{formatNaira(Number(order.subtotal))}</p>
              </div>
              <div className="flex justify-between items-center text-white/30">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Shipping</p>
                <p className="font-mono text-[13px]">{formatNaira(Number(order.shippingCost))}</p>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between items-center text-red-500/50">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Discount</p>
                  <p className="font-mono text-[13px]">-{formatNaira(Number(order.discountAmount))}</p>
                </div>
              )}
              <div className="flex justify-between items-center pt-4">
                <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white">Grand_Total</p>
                <p className="text-[24px] font-black text-white text-aura-glow">{formatNaira(Number(order.total))}</p>
              </div>
            </div>
          </div>
          
          {/* Order Status Timeline (Coming Soon or Simple View) */}
          <div className="p-10 glass-aura rounded-[2.5rem]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">System_Timeline</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-white/5" />
              
              <div className="flex gap-6 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  ['DELIVERED'].includes(order.status) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-black border-white/10 text-white/20'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">Delivered</p>
                  <p className="text-[9px] text-white/20 uppercase font-bold mt-1">Order reached destination</p>
                </div>
              </div>

              <div className="flex gap-6 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  ['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-black border-white/10 text-white/20'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">Shipped</p>
                  <p className="text-[9px] text-white/20 uppercase font-bold mt-1">In transit via logistics partner</p>
                </div>
              </div>

              <div className="flex gap-6 relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-white/10 border-white/20 text-white">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">Order Confirmed</p>
                  <p className="text-[9px] text-white/20 uppercase font-bold mt-1">Payment verified and logged</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CUSTOMER & SHIPPING ─── */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Customer Card */}
          <div className="p-10 glass-aura rounded-[2.5rem] relative overflow-hidden group">
             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center justify-between">
              Customer_Identity
              <User className="w-4 h-4 text-white/10" />
            </h3>
            {order.customer ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Account</p>
                  <Link href={`/admin/customers/${order.customer.id}`} className="text-[13px] font-black text-white uppercase tracking-widest hover:text-aura-glow transition-all flex items-center gap-2">
                    @{order.customer.username}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Email Address</p>
                  <p className="text-[13px] font-black text-white lowercase tracking-tight">{order.customer.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                 <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Guest Profile</p>
                  <p className="text-[13px] font-black text-white uppercase tracking-widest">{order.guestFirstName} {order.guestLastName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Contact Email</p>
                  <p className="text-[13px] font-black text-white lowercase tracking-tight">{order.guestEmail}</p>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="p-10 glass-aura rounded-[2.5rem] relative overflow-hidden">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center justify-between">
              Logistics_Destination
              <MapPin className="w-4 h-4 text-white/10" />
            </h3>
            {address ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Recipient</p>
                  <p className="text-[13px] font-black text-white uppercase tracking-widest">{address.fullName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Address</p>
                  <p className="text-[13px] font-black text-white uppercase tracking-widest leading-relaxed">
                    {address.line1}<br />
                    {address.line2 && <>{address.line2}<br /></>}
                    {address.city}, {address.state}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Phone Number</p>
                  <p className="text-[13px] font-black text-white uppercase tracking-widest">{address.phone}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-red-500/20 rounded-2xl text-center">
                <AlertCircle className="w-5 h-5 text-red-500/40 mx-auto mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest text-red-500/40">No address logged</p>
              </div>
            )}
          </div>

          {/* Payment Snapshot */}
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center justify-between">
              Payment_Intelligence
              <CreditCard className="w-4 h-4 text-white/10" />
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Method</p>
                <p className="text-[10px] font-black text-white uppercase">Paystack</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Gateway Ref</p>
                <p className="text-[10px] font-mono text-white/40">{order.paystackRef || 'N/A'}</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Status</p>
                </div>
                <p className={`text-[10px] font-black uppercase ${order.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
