import { motion } from 'framer-motion'

export default function AnimatedBackdrop() {
  return (
    <div className='bg-layer' aria-hidden>
      <motion.div
        className='bg-orb bg-orb-a'
        animate={{ x: [0, 24, -16, 0], y: [0, -16, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className='bg-orb bg-orb-b'
        animate={{ x: [0, -20, 18, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className='bg-grid' />
    </div>
  )
}
