import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  AlertTriangle,
  Package,
  Layers
} from "lucide-react"
import Image from "next/image"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { AdminSearch } from "@/components/admin/AdminSearch"
import { AdminFilter } from "@/components/admin/AdminFilter"

export default async function AdminProductsPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; category?: string } 
}) {
  const query = searchParams.q || "";
  const categoryFilter = searchParams.category || undefined;

  // Fetch categories for the filter
  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  });

  const categoryOptions = categories.map(c => ({
    label: c.name,
    value: c.id
  }));

  const products = await prisma.product.findMany({
    where: {
      AND: [
        categoryFilter ? { categoryId: categoryFilter } : {},
        query ? {
          OR: [
            { variants: { some: { sku: { contains: query, mode: 'insensitive' } } } },
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
          ]
        } : {}
      ]
    },
    include: {
      category: true,
      variants: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // To prioritize SKU matches, we can sort in-memory if needed, 
  // but Prisma's OR order combined with our include should be sufficient for basic ops.

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* ─── HEADER ACTIONS ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Inventory</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Manage and Deploy Catalog Units</p>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <AdminSearch placeholder="PRODUCT NAME / SKU / SLUG..." />
          <AdminFilter queryKey="category" options={categoryOptions} label="Categories" />
          
          <Link 
            href="/admin/products/new"
            className="shrink-0 bg-white text-black py-4 px-10 rounded-full flex items-center justify-center gap-3 text-[11px] font-black tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
            data-cursor="hover"
          >
            <Plus className="w-4 h-4" /> Add
          </Link>
        </div>
      </div>

      {/* ─── TABLE CONTAINER ────────────────────────────────── */}
      <div className="bg-black border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01]">
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Product</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Category</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Price</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Stock</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-10">
                      <Package className="w-16 h-16" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em]">No items match your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
              products.map((product: any) => {
                const totalStock = product.variants.reduce((acc: number, curr: any) => acc + curr.stock, 0)
                const isLowStock = product.variants.some((v: any) => v.stock <= 5)
                  
                  return (
                    <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden flex-shrink-0 relative group-hover:border-white/20 transition-all duration-500">
                            {product.images[0] ? (
                              <Image 
                                src={product.images[0].url} 
                                alt={product.name}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-white transition-colors">{product.name}</p>
                            <p className="text-[9px] text-white/15 uppercase font-bold tracking-widest mt-1.5">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{product.category.name}</span>
                      </td>
                      <td className="px-10 py-6 text-[12px] font-mono text-white/60">
                        {formatNaira(Number(product.basePrice))}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col gap-2.5">
                           <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-black tracking-widest ${isLowStock ? "text-red-500" : "text-white/50"}`}>
                                {totalStock} UNITS
                              </span>
                              {isLowStock && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                           </div>
                           <div className="w-16 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                              <div 
                                className={`h-full absolute left-0 top-0 transition-all duration-1000 ${isLowStock ? "bg-red-500" : "bg-white/20"}`} 
                                style={{ width: `${Math.min((totalStock / 50) * 100, 100)}%` }} 
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className={`
                          inline-flex items-center px-3.5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border
                          ${product.status === "ACTIVE" 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                            : "bg-white/5 text-white/10 border-white/10"}
                        `}>
                          {product.status === "ACTIVE" ? "Deployed" : "Archived"}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                          <Link 
                            href={`/admin/products/${product.id}`} 
                            className="p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/20 hover:text-white hover:bg-white/[0.08] transition-all" 
                            data-cursor="hover"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Link>
                          <a 
                            href={`/shop/${product.slug}`} 
                            target="_blank" 
                            className="p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/20 hover:text-white hover:bg-white/[0.08] transition-all" 
                            data-cursor="hover"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
const ImageIcon = Layers;
