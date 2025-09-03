export default function BookCardSkeleton() {
  return (
    <div className="w-100 h-50 p-4 rounded-lg bg-gray-100 shadow animate-pulse">
      <div className="w-full h-full bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  )
}
