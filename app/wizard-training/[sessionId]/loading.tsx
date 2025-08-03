export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Training wordt geladen...</h2>
        <p className="text-gray-600 mt-2">Even geduld alsjeblieft</p>
      </div>
    </div>
  )
}
