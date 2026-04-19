export default function AnimatedBackdrop() {
  return (
    <div className='bg-layer' aria-hidden>
      <div className='bg-orb bg-orb-a' />
      <div className='bg-orb bg-orb-b' />
      <div className='bg-grid' />
    </div>
  )
}
