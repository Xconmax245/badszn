import { prisma } from "@/lib/prisma"

export default async function EnvDiagnostic() {
  const url = process.env.DATABASE_URL || "NOT_SET"
  const direct = process.env.DIRECT_URL || "NOT_SET"
  
  return (
    <div className="p-20 text-white bg-black min-h-screen font-mono">
      <h1 className="text-3xl mb-10 text-yellow-500 underline">AURA_ENV_DIAGNOSTIC</h1>
      
      <div className="space-y-8">
        <section>
          <p className="text-white/40 uppercase text-xs tracking-widest mb-2">Process Env</p>
          <div className="p-4 bg-white/5 border border-white/10 rounded">
            <p>DATABASE_URL: <span className="text-blue-400">{url.split('@')[0]}</span>@<span className="text-blue-600">{url.split('@')[1]}</span></p>
            <p>DIRECT_URL: <span className="text-blue-400">{direct.split('@')[0]}</span>@<span className="text-blue-600">{direct.split('@')[1]}</span></p>
          </div>
        </section>

        <section>
          <p className="text-white/40 uppercase text-xs tracking-widest mb-2">Prisma Singleton Check</p>
          <div className="p-4 bg-white/5 border border-white/10 rounded text-green-400">
            {prisma ? "PRISMA_SINGLETON_ACTIVE" : "PRISMA_SINGLETON_MISSING"}
          </div>
        </section>

        <section>
          <p className="text-white/40 uppercase text-xs tracking-widest mb-2">Connection Test (Direct Ping)</p>
          <div className="p-4 bg-white/5 border border-white/10 rounded">
            <PingTest />
          </div>
        </section>
      </div>
    </div>
  )
}

async function PingTest() {
  try {
    const start = Date.now()
    const result = await prisma.$queryRaw`SELECT 1 as ping`
    const end = Date.now()
    return (
      <div className="text-green-500">
        <p>SUCCESS</p>
        <p className="text-xs text-white/60 mt-1">Latency: {end - start}ms</p>
        <pre className="text-[10px] mt-2">{JSON.stringify(result, null, 2)}</pre>
      </div>
    )
  } catch (err: any) {
    return (
      <div className="text-red-500">
        <p>FAILURE</p>
        <p className="text-xs text-white/80 mt-2 break-all">{err.message}</p>
      </div>
    )
  }
}
