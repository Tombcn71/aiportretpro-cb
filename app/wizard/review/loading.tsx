export default function ReviewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center mb-8">
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse mr-4"></div>
          <div>
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>

              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plan Skeleton */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <div className="w-80 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
              <div className="w-96 h-6 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>

            {/* Trust Indicators Skeleton */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>

            {/* Plan Card Skeleton */}
            <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-sm border-2">
              <div className="text-center">
                <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="w-24 h-12 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>

                <div className="space-y-4 mb-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                <div className="w-full h-12 bg-gray-200 rounded animate-pulse mb-4"></div>

                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-48 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial Skeleton */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex mb-2 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="space-y-2 mb-2">
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
