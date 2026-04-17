export default function SkeletonToolPage() {
  return (
    <div className='page-wrap tool-page-wrap'>
      <div className='skeleton skeleton-back-link' style={{ width: 140, height: 20, borderRadius: 8, marginBottom: '1.5rem' }} />

      <div className='tool-layout'>
        <div className='tool-main-column'>
          <div className='tool-main-panel sk-tool-panel'>
            <div className='tool-page-hero'>
              <div className='skeleton sk-tool-icon' />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className='skeleton sk-badge-row' />
                <div className='skeleton sk-title' />
                <div className='skeleton sk-desc' />
                <div className='skeleton sk-desc short' />
                <div className='sk-chip-row'>
                  {[60, 80, 70, 90, 65, 75].map((w, i) => (
                    <div key={i} className='skeleton sk-chip' style={{ width: w }} />
                  ))}
                </div>
              </div>
            </div>

            <div className='sk-upload-area'>
              <div className='skeleton sk-upload-label' />
              <div className='skeleton sk-dropzone' />
            </div>

            <div className='sk-field-grid'>
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className='skeleton sk-field-label' />
                  <div className='skeleton sk-field-input' />
                </div>
              ))}
            </div>

            <div className='skeleton sk-run-btn' />
          </div>
        </div>

        <div className='tool-sidebar'>
          <div className='skeleton sk-sidebar-block' />
          <div className='skeleton sk-sidebar-block short' />
          <div className='sk-related-list'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='skeleton sk-related-item' />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
