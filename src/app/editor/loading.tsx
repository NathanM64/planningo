// src/app/editor/loading.tsx
export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 bg-slate-200 rounded w-64"></div>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-slate-200 rounded"></div>
              <div className="h-10 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Members section skeleton */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-slate-200 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Week grid skeleton */}
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="grid grid-cols-8 gap-2">
            {/* Time column */}
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded"></div>
              ))}
            </div>
            {/* Days columns */}
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="space-y-2">
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
