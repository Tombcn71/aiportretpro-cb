export default function Loading() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-blue-800">Debug wordt geladen...</h2>
        <p className="text-blue-600">Even geduld terwijl we de API controleren</p>
      </div>
    </div>
  )
}
