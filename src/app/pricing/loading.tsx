// src/app/pricing/loading.tsx
export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-12 bg-slate-200 rounded w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-[600px] mx-auto"></div>
        </div>

        {/* Pricing cards skeleton */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg p-8 animate-pulse"
            >
              <div className="h-8 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-12 bg-slate-200 rounded w-24 mb-6"></div>
              <div className="space-y-3 mb-8">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* FAQ skeleton */}
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
