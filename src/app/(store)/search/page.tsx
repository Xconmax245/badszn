"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { Search as SearchIcon, X, Loader2, ArrowRight } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  
  const [searchInput, setSearchInput] = useState(query)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (term: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/shop/products?search=${encodeURIComponent(term)}`)
      const data = await res.json()
      setResults(data.products || [])
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
  }

  return (
    <div className="bg-black min-h-screen">
      <main className="pt-40 pb-40 px-6 md:px-12 lg:px-24">
        {/* ─── SEARCH INPUT ─── */}
        <div className="max-w-4xl mx-auto mb-24">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Archive..."
              className="w-full bg-transparent border-b border-white/10 py-8 text-4xl md:text-6xl font-black text-white uppercase tracking-tighter placeholder:text-white/5 focus:outline-none focus:border-white/40 transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/20 group-hover:text-white transition-colors"
            >
              {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <ArrowRight className="w-10 h-10" />}
            </button>
          </form>
          <div className="mt-6 flex gap-4">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Suggested:</span>
             {["Hoodie", "Capsule", "Denim"].map(tag => (
               <button 
                key={tag}
                onClick={() => { setSearchInput(tag); router.push(`/search?q=${tag}`) }}
                className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] hover:text-white transition-colors"
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>

        {/* ─── RESULTS GRID ─── */}
        <div className="max-w-7xl mx-auto">
          {query && (
            <div className="flex items-center gap-4 mb-12">
               <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Results for "{query}"</h2>
               <div className="h-[1px] flex-1 bg-white/5" />
               <span className="text-[11px] font-black text-white/20">{results.length} Pieces Found</span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20">
            {results.map((product) => (
              <Link 
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.02] rounded-3xl border border-white/5 mb-6">
                  {product.images[0] && (
                    <Image 
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="space-y-1">
                   <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">{product.name}</h3>
                   <p className="text-[13px] font-black text-white/60">{formatNaira(Number(product.basePrice))}</p>
                </div>
              </Link>
            ))}
          </div>

          {query && !loading && results.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-6 opacity-20">
              <X className="w-12 h-12" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em]">No matches found in the archive</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
