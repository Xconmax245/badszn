import { prisma } from "@/lib/prisma"
import { 
  MessageSquare
} from "lucide-react"
import { AdminSearch } from "@/components/admin/AdminSearch"
import { AdminFilter } from "@/components/admin/AdminFilter"
import { ReviewsTable } from "@/components/admin/ReviewsTable"

export default async function AdminReviewsPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; status?: string } 
}) {
  const query = searchParams.q || "";
  const statusFilter = searchParams.status === "APPROVED" ? true : searchParams.status === "PENDING" ? false : undefined;

  const reviews = await prisma.review.findMany({
    where: {
      AND: [
        statusFilter !== undefined ? { isApproved: statusFilter } : {},
        query ? {
          OR: [
            { body: { contains: query, mode: 'insensitive' } },
            { product: { name: { contains: query, mode: 'insensitive' } } },
            { customer: { username: { contains: query, mode: 'insensitive' } } },
            { customer: { firstName: { contains: query, mode: 'insensitive' } } },
            { customer: { lastName: { contains: query, mode: 'insensitive' } } },
          ]
        } : {}
      ]
    },
    include: {
      customer: true,
      product: true
    },
    orderBy: { createdAt: "desc" }
  })

  const reviewStatuses = [
    { label: "Approved", value: "APPROVED" },
    { label: "Pending", value: "PENDING" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Social Proof Log</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Moderate and curate the brand's public feedback.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="REVIEW BODY / PRODUCT / USER..." />
          <AdminFilter queryKey="status" options={reviewStatuses} label="All Reviews" />
        </div>
      </div>

      <ReviewsTable initialReviews={reviews} />
    </div>
  )
}
