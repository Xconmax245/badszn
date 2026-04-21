import { prisma } from "@/lib/prisma"

export default async function TestPage() {
  try {
    const collections = await prisma.collection.findMany({ take: 1 })
    return (
      <div className="p-20 text-white font-mono">
        <h1 className="text-2xl mb-10 text-green-500">PRISMA_PING_SUCCESS</h1>
        <pre>{JSON.stringify(collections, null, 2)}</pre>
      </div>
    )
  } catch (err: any) {
    return (
      <div className="p-20 text-white font-mono">
        <h1 className="text-2xl mb-10 text-red-500">PRISMA_PING_FAILURE</h1>
        <pre className="text-xs">{err.message}</pre>
        <div className="mt-10 p-5 bg-white/5 border border-white/10">
          <p className="text-white/50 mb-2 uppercase text-[10px] tracking-widest">Environment Check</p>
          <code className="text-[10px]">DATABASE_URL: {process.env.DATABASE_URL?.split('@')[1]}</code>
        </div>
      </div>
    )
  }
}
