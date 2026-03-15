export default function VehiclesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-72 bg-gray-200 rounded-md mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Search bar + count skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full max-w-md bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
      </div>

      {/* Desktop table skeleton */}
      <div className="hidden md:block rounded-xl bg-white shadow-sm overflow-hidden border border-gray-100">
        <div className="h-12 bg-gray-50/60 border-b border-gray-100 w-full flex items-center px-5 gap-10">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 flex items-center px-5 gap-10 border-b border-gray-50 last:border-0">
              <div className="h-5 w-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="h-4 w-32 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="h-8 w-28 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="h-4 w-24 bg-gray-200 rounded flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards skeleton */}
      <div className="md:hidden grid gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-6 w-28 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
