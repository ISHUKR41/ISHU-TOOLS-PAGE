/**
 * SkeletonCard — Reusable shimmer skeleton for tool/category cards.
 * Used during loading states to provide visual feedback.
 */
export default function SkeletonCard({ count = 6 }: { count?: number }) {
  return (
    <div className='skeleton-card-grid'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='skeleton-card'>
          <div className='skeleton-shimmer skeleton-icon' />
          <div className='skeleton-shimmer skeleton-title' />
          <div className='skeleton-shimmer skeleton-desc' />
          <div className='skeleton-shimmer skeleton-desc skeleton-desc-short' />
        </div>
      ))}
    </div>
  )
}
