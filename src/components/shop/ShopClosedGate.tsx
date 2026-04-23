export function ShopClosedGate() {
  return (
    <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 bg-animate-pulse">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")` }} 
      />
      
      <div className="text-center space-y-8 relative z-10">
        <p className="text-[12rem] font-black leading-none text-white/5 tracking-tighter uppercase select-none">OFF</p>
        <div className="space-y-4">
          <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-white">System_Archive_Offline</h2>
          <p className="max-w-xs mx-auto text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] leading-loose">
            Access to the storefront archive is currently restricted. The next drop sequence is initializing. 
          </p>
        </div>
        <div className="pt-10">
            <div className="inline-block px-4 py-2 border border-white/10 rounded-full">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent-red animate-pulse">Waiting for Signal...</span>
            </div>
        </div>
      </div>
    </main>
  )
}
