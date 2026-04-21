import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  ShoppingBag,
  ExternalLink,
  User,
  Clock,
  CheckCircle2,
  Truck
} from "lucide-react";
import { formatNaira } from "@/lib/utils/formatCurrency";
import { OrderActionButtons } from "@/components/admin/OrderActionButtons";
import Image from "next/image";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      address: true,
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
    },
  });

  if (!order) notFound();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-white/5 text-white/40 border-white/10";
      case "PAID": return "bg-green-400/10 text-green-400 border-green-400/20";
      case "SHIPPED": return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "DELIVERED": return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      default: return "bg-white/5 text-white/30 border-white/10";
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <Link 
            href="/admin/orders" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors mb-6"
            data-cursor="hover"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Logistics
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">Order #{order.orderNumber}</h1>
            <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[2px] ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-3 italic">
            Received on {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex items-center gap-4">
           {/* Actions go here */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* ─── LEFT COLUMN: ITEMS ────────────────────────────── */}
        <div className="col-span-12 xl:col-span-8 space-y-12">
          <section className="bg-black border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-4 h-4 text-white/20" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Shipment Contents</h2>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{order.items.length} Units Found</span>
            </div>

            <div className="divide-y divide-white/[0.03]">
              {order.items.map((item) => (
                <div key={item.id} className="p-10 flex gap-10 group hover:bg-white/[0.01] transition-all">
                  <div className="w-24 h-24 bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden relative flex-shrink-0 group-hover:border-white/20 transition-all duration-500">
                    {item.product.images[0] ? (
                      <Image 
                        src={item.product.images[0].url} 
                        alt={item.name}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[14px] font-bold text-white mb-1.5">{item.name}</h3>
                        <div className="flex gap-4">
                           <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Size: <span className="text-white/60">{item.size}</span></p>
                           {item.color && <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Color: <span className="text-white/60">{item.color}</span></p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-white">{formatNaira(Number(item.price))}</p>
                        <p className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-widest">×{item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 bg-white/[0.01] border-t border-white/5">
               <div className="flex flex-col gap-4 max-w-xs ml-auto">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/30">
                    <span>Subtotal</span>
                    <span>{formatNaira(Number(order.subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/30">
                    <span>Shipping</span>
                    <span>{formatNaira(Number(order.shippingCost))}</span>
                  </div>
                  {Number(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-red-500">
                      <span>Discount</span>
                      <span>-{formatNaira(Number(order.discountAmount))}</span>
                    </div>
                  )}
                  <div className="h-[1px] bg-white/10 my-2" />
                  <div className="flex justify-between text-xl font-black text-white">
                    <span className="uppercase tracking-tighter">Total</span>
                    <span>{formatNaira(Number(order.total))}</span>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* ─── RIGHT COLUMN: LOGISTICS ────────────────────────── */}
        <div className="col-span-12 xl:col-span-4 space-y-10">
          {/* FULFILLMENT ACTIONS */}
          <section className="p-8 bg-black border border-white/10 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20 mb-8 flex items-center gap-3">
               <Package className="w-3.5 h-3.5" /> Fulfillment Master
            </h3>
            <OrderActionButtons orderId={order.id} currentStatus={order.status} />
          </section>

          {/* CUSTOMER IDENTITY */}
          <section className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">Customer Identity</h3>
               <User className="w-4 h-4 text-white/10" />
            </div>

            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xl font-black text-white/20">
                 {(order.guestFirstName || order.customer?.firstName)?.[0]}
               </div>
               <div>
                 <p className="text-lg font-bold text-white">{order.guestFirstName || order.customer?.firstName} {order.guestLastName || order.customer?.lastName}</p>
                 <Link 
                   href={order.customerId ? `/admin/customers/${order.customerId}` : "#"} 
                   className="text-[10px] font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5 mt-1"
                 >
                   View Profile <ExternalLink className="w-2.5 h-2.5" />
                 </Link>
               </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/5">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/[0.02] flex items-center justify-center text-white/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-[12px] font-medium text-white/70">{order.guestEmail || order.customer?.email}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/[0.02] flex items-center justify-center text-white/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Shipping Address</p>
                    {order.address ? (
                      <p className="text-[12px] font-medium text-white/70 leading-relaxed">
                        {order.address.addressLine1}, {order.address.city}, {order.address.state}, {order.address.country}
                      </p>
                    ) : (
                      <p className="text-[12px] font-medium text-white/20 italic">No address attached</p>
                    )}
                  </div>
               </div>
            </div>
          </section>

          {/* PAYMENT TELEMETRY */}
          <section className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-emerald-500/40" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Payment Telemetry</h3>
               </div>
               <div className={`px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                 {order.paymentStatus}
               </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Gateway</span>
                   <span className="text-[11px] font-bold text-white/70">Paystack</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Reference</span>
                   <span className="text-[11px] font-mono text-white/40">{order.paystackRef || "N/A"}</span>
                </div>
             </div>

             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          </section>
        </div>
      </div>
    </div>
  );
}
