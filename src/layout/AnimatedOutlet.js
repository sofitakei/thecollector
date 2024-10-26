import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 },
}

const AnimatedLayout = () => {
  const { pathname } = useLocation()
  return (
    <motion.div
      initial='hidden'
      animate='enter'
      exit='exit'
      key={pathname}
      variants={variants}
      transition={{ duration: 0.5, type: 'easeInOut' }}
      className='relative'>
      <Outlet />
    </motion.div>
  )
}

export default AnimatedLayout
