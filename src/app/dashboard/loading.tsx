// src/app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Agendas list skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-slate-200 rounded"></div>
                  <div className="h-10 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-8 w-20 bg-slate-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
