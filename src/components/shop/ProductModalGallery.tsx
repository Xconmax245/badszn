'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ProductImage } from '@/types/shop'

interface Props {
  images: ProductImage[]
  productName: string
}

export function ProductModalGallery({ images, productName }: Props) {
  if (!images.length) {
    return (
      <div className="w-full aspect-[3/4] flex items-center justify-center bg-zinc-900/10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">No Visualization</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      {images.map((img, i) => (
        <motion.div
           key={img.id}
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: '-50px' }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i === 0 ? 0 : 0.1 }}
           className="relative w-full aspect-[3/4] bg-[#0A0A0A] overflow-hidden"
        >
          <Image
            src={img.url}
            alt={img.altText ?? `${productName} Gallery ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={i === 0}
          />
        </motion.div>
      ))}
    </div>
  )
}
