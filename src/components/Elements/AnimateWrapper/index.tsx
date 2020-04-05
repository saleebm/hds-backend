import { motion, useReducedMotion, Variants } from 'framer-motion'
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    translateX: -300,
    transition: { duration: 0.25, ease: [0.48, 0.15, 0.25, 0.96] },
  },
  enter: {
    opacity: 1,
    translateX: 0,
    transition: { duration: 0.05, ease: [0.48, 0.15, 0.25, 0.96] },
  },
  exit: {
    opacity: 0,
    translateX: -200,
    transition: { duration: 0.25, ease: [0.48, 0.15, 0.25, 0.96] },
  },
}
type AnimationWrapperProps = Omit<ReturnType<typeof motion.div>, 'key'>

export const AnimationWrapper: FC<AnimationWrapperProps> = ({
  children,
  ...rest
}) => {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    console.log(router.pathname, router.query)
  }, [router.pathname, router.query])
  return (
    <motion.div
      key={`${router.pathname}${router.query}`}
      initial={shouldReduceMotion ? undefined : 'initial'}
      animate={shouldReduceMotion ? undefined : 'enter'}
      exit="exit"
      variants={{ exit: { transition: { staggerChildren: 0.1 } } }}
      {...rest}
    >
      <motion.div variants={pageVariants}>{children}</motion.div>
    </motion.div>
  )
}
