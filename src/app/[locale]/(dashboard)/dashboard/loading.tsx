export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-md mt-2"></div>
      </div>

      {/* Section 1: Stats row skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-white shadow-sm p-5 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
            </div>
            <div>
              <div className="h-8 w-16 bg-gray-200 rounded-md mt-3 mb-1"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2 + 3: Grid and Alerts skeleton */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Fleet grid skeleton — takes 2/3 */}
        <div className="xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-white shadow-sm p-5 border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-6 w-24 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts skeleton — takes 1/3 */}
        <div className="xl:col-span-1">
          <div className="h-96 rounded-xl bg-white shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between mb-6">
              <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-200 flex-shrink-0"></div>
                  <div className="w-full">
                    <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
