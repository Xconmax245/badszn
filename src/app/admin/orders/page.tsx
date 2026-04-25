import { prisma } from "@/lib/prisma"
import AdminOrdersList from "@/components/admin/AdminOrdersList"

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true
    }
  })

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Orders</h1>
          <p className="text-sm text-white/40">Manage and track customer purchases</p>
        </div>
      </header>

      <AdminOrdersList initialOrders={orders} />
    </div>
  )
}
