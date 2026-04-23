export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-brand-stone">
      <div className="px-6 md:px-16 pt-36 pb-16">
        <div className="h-28 w-56 bg-brand-hair rounded-sm animate-pulse" />
      </div>
      <div className="px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                      gap-x-5 gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-brand-hair animate-pulse" />
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-brand-hair rounded-full w-2/3 animate-pulse" />
              <div className="h-3 bg-brand-hair rounded-full w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
