/**
 * SkeletonToolPage — Professional shimmer skeleton for the tool page.
 * Shown while tool data is loading. Matches the real layout closely.
 */
export default function SkeletonToolPage() {
  return (
    <div className='skeleton-tool-page'>
      {/* Breadcrumb skeleton */}
      <div className='skeleton-breadcrumb'>
        <div className='skeleton-shimmer skeleton-breadcrumb-item' />
        <div className='skeleton-shimmer skeleton-breadcrumb-item skeleton-breadcrumb-item-short' />
      </div>

      {/* Hero section */}
      <div className='skeleton-tool-hero'>
        <div className='skeleton-shimmer skeleton-hero-icon' />
        <div className='skeleton-hero-text'>
          <div className='skeleton-shimmer skeleton-hero-title' />
          <div className='skeleton-shimmer skeleton-hero-desc' />
          <div className='skeleton-shimmer skeleton-hero-desc skeleton-hero-desc-short' />
        </div>
      </div>

      {/* Content area */}
      <div className='skeleton-tool-content'>
        <div className='skeleton-tool-main'>
          {/* Upload area skeleton */}
          <div className='skeleton-shimmer skeleton-upload-area' />

          {/* Fields skeleton */}
          <div className='skeleton-fields'>
            <div className='skeleton-shimmer skeleton-field' />
            <div className='skeleton-shimmer skeleton-field' />
          </div>

          {/* Button skeleton */}
          <div className='skeleton-shimmer skeleton-button' />
        </div>

        {/* Sidebar skeleton */}
        <div className='skeleton-tool-sidebar'>
          <div className='skeleton-shimmer skeleton-sidebar-title' />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='skeleton-sidebar-item'>
              <div className='skeleton-shimmer skeleton-sidebar-icon' />
              <div className='skeleton-shimmer skeleton-sidebar-text' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
