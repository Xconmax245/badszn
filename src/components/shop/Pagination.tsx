'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage:  number
  totalPages:   number
  onPageChange: (p: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-10 py-24 border-t border-white/5">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-text-primary/20 disabled:opacity-5 hover:text-accent-red transition-all duration-300"
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      <div className="flex flex-col items-center gap-1">
        <span className="font-black text-[10px] text-text-primary tracking-[0.4em] uppercase">
          PAGE {currentPage.toString().padStart(2, '0')}
        </span>
        <span className="font-sans text-[8px] font-black text-text-primary/10 tracking-[0.2em] uppercase">
          OF {totalPages.toString().padStart(2, '0')}
        </span>
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-text-primary/20 disabled:opacity-5 hover:text-accent-red transition-all duration-300"
        aria-label="Next Page"
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  )
}
