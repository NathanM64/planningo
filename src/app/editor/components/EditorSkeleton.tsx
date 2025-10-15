// src/app/editor/components/EditorSkeleton.tsx
export default function EditorSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Toolbar skeleton - correspond à EditorToolbar */}
      <div className="container mx-auto px-4 max-w-7xl pt-6 pb-4">
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Titre skeleton */}
            <div className="h-8 bg-gray-200 rounded w-48" />

            {/* Boutons skeleton */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="h-9 flex-1 sm:flex-none sm:w-28 bg-gray-200 rounded" />
              <div className="h-9 flex-1 sm:flex-none sm:w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 container mx-auto px-2 sm:px-4 pb-6 max-w-7xl">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4 lg:gap-6">
          {/* Sidebar skeleton */}
          <aside className="w-full">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded-lg"
                  />
                ))}
              </div>
              <div className="mt-4 h-10 bg-gray-200 rounded" />
            </div>
          </aside>

          {/* Grid skeleton */}
          <main className="w-full min-w-0">
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 border-b-2 border-gray-200 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="h-6 bg-gray-200 rounded w-48" />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="h-8 flex-1 sm:flex-initial sm:w-24 bg-gray-200 rounded" />
                    <div className="h-8 flex-1 sm:flex-initial sm:w-32 bg-gray-200 rounded" />
                    <div className="h-8 flex-1 sm:flex-initial sm:w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>

              {/* Table skeleton */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 sm:p-3 border-r-2 border-gray-200 min-w-[100px] sm:min-w-[150px]">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </th>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <th
                          key={day}
                          className="p-2 sm:p-3 border-r border-gray-200 text-center min-w-[100px] sm:min-w-[120px]"
                        >
                          <div className="h-4 bg-gray-200 rounded w-12 mx-auto mb-1" />
                          <div className="h-6 bg-gray-200 rounded w-8 mx-auto" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((row) => (
                      <tr key={row} className="border-b-2 border-gray-200">
                        <td className="p-2 sm:p-3 border-r-2 border-gray-200 bg-gray-50">
                          <div className="h-4 bg-gray-200 rounded w-24" />
                        </td>
                        {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                          <td
                            key={cell}
                            className="border-r border-gray-200 p-1.5 sm:p-2"
                            style={{ minHeight: '80px' }}
                          >
                            <div className="space-y-1">
                              {cell % 2 === 0 && (
                                <div className="h-16 bg-gray-200 rounded" />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
