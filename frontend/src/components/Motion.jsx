import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const slideUp = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, className }) {
  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeLeft({ children, delay = 0, className }) {
  return (
    <motion.div variants={fadeLeft} initial="hidden" animate="visible" transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function CardMotion({ children, index = 0, className }) {
  return (
    <motion.div variants={slideUp} transition={{ duration: 0.4, delay: index * 0.08 }} className={className}>
      {children}
    </motion.div>
  );
}