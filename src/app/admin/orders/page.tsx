import { prisma } from "@/lib/prisma"
import { 
  ShoppingBag
} from "lucide-react"
import { AdminSearch } from "@/components/admin/AdminSearch"
import { AdminFilter } from "@/components/admin/AdminFilter"
import { OrdersTable } from "@/components/admin/OrdersTable"

export default async function AdminOrdersPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; status?: string } 
}) {
  const query = searchParams.q || "";
  const statusFilter = searchParams.status || undefined;

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        statusFilter ? { status: statusFilter as any } : {},
        query ? {
          OR: [
            { orderNumber: { contains: query, mode: 'insensitive' } },
            { guestEmail: { contains: query, mode: 'insensitive' } },
            { guestFirstName: { contains: query, mode: 'insensitive' } },
            { guestLastName: { contains: query, mode: 'insensitive' } },
            { 
              customer: { 
                OR: [
                  { email: { contains: query, mode: 'insensitive' } },
                  { username: { contains: query, mode: 'insensitive' } },
                  { firstName: { contains: query, mode: 'insensitive' } },
                  { lastName: { contains: query, mode: 'insensitive' } },
                ]
              } 
            }
          ]
        } : {}
      ]
    },
    include: {
      customer: true,
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  const orderStatuses = [
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Packed", value: "PACKED" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Refunded", value: "REFUNDED" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Order Logistics</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Monitor fulfillment and payment flows.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="ORDER ID / EMAIL / NAME..." />
          <AdminFilter queryKey="status" options={orderStatuses} label="All Statuses" />
        </div>
      </div>

      <OrdersTable initialOrders={orders} />
    </div>
  )
}
