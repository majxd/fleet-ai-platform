export default function VehicleDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 h-4 w-24 bg-gray-200 rounded-md"></div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
            <div className="mt-2 h-5 w-64 bg-gray-200 rounded-md"></div>
            <div className="mt-3 h-6 w-20 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-32 w-32 bg-gray-200 rounded-full flex-shrink-0"></div>
        </div>
      </div>

      {/* OBD Metrics Skeleton */}
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg p-4 bg-gray-50 h-28">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-3 w-12 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Health History Chart Skeleton */}
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-[200px] sm:h-[300px] w-full bg-gray-100 rounded-md"></div>
      </div>

      {/* DTC Codes Skeleton */}
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
        </div>
        <div className="hidden sm:block">
          <div className="h-10 bg-gray-50 mb-3 rounded-md"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-50/50 mb-2 rounded-md"></div>
          ))}
        </div>
        <div className="sm:hidden space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-4 h-24 bg-gray-50/50"></div>
          ))}
        </div>
      </div>

      {/* Maintenance Timeline Skeleton */}
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="h-6 w-32 bg-gray-200 rounded-md mb-5"></div>
        <div className="space-y-6 ms-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-5 w-40 bg-gray-200 rounded-md mb-2"></div>
                <div className="flex gap-3 mb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-4 w-full max-w-md bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
