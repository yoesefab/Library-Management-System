import type { Transition, Variants } from 'framer-motion'

export const feedbackTransition: Transition = {
  duration: 0.18,
  ease: 'easeOut',
}

export const entranceTransition: Transition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
}

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, x: '-50%', y: '-48%' },
  visible: { opacity: 1, scale: 1, x: '-50%', y: '-50%' },
  exit: { opacity: 0, scale: 0.98, x: '-50%', y: '-49%' },
}

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

export const menuVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -2 },
}

export const drawerVariants = {
  left: {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
  },
  right: {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
  },
  top: {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '-100%' },
  },
  bottom: {
    hidden: { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
  },
} satisfies Record<string, Variants>

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: entranceTransition },
}

export function getMotionState(reduceMotion: boolean | null) {
  return reduceMotion
    ? { initial: false as const, animate: 'visible', exit: undefined }
    : { initial: 'hidden', animate: 'visible', exit: 'exit' }
}
