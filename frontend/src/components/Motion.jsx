import { motion, useAnimation, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import React from 'react';

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export const slideUp = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 15 } },
};

export const flipIn = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { opacity: 1, rotateY: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export const springy = {
  whileHover: { scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 15 } },
  whileTap: { scale: 0.96, transition: { duration: 0.1 } },
};

export const magnetic = {
  whileHover: { 
    scale: 1.08, 
    boxShadow: '0 20px 60px rgba(34, 211, 238, 0.4)',
    transition: { type: 'spring', stiffness: 250, damping: 20 }
  },
  whileTap: { scale: 0.95 },
};

export function FadeUp({ children, delay = 0, className, ...props }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6, delay }} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, delay = 0, className, ...props }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ transitionDelay: delay }} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, className, ...props }) {
  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay }} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function SlideLeft({ children, delay = 0, className, ...props }) {
  return (
    <motion.div variants={slideLeft} initial="hidden" animate="visible" transition={{ duration: 0.6, delay }} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className, ...props }) {
  return (
    <motion.div variants={scaleIn} initial="hidden" animate="visible" transition={{ duration: 0.5, delay }} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function CardMotion({ children, index = 0, className, ...props }) {
  return (
    <motion.div 
      variants={slideUp} 
      initial="hidden" 
      animate="visible" 
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: index * 0.08 }} 
      className={className} 
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({ children, className, asChild = false, ...props }) {
  const Child = asChild ? 'button' : 'button';
  const Comp = asChild ? motion.button : motion.button;
  
  // For asChild pattern with Link, we need to render the child directly with motion props
  if (asChild && React.isValidElement(children)) {
    return (
      <motion.button
        className={className}
        whileHover={{ 
          scale: 1.06, 
          boxShadow: '0 20px 60px rgba(34, 211, 238, 0.4)',
          transition: { type: 'spring', stiffness: 250, damping: 20 }
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
  
  return (
    <motion.button
      className={className}
      whileHover={{ 
        scale: 1.06, 
        boxShadow: '0 20px 60px rgba(34, 211, 238, 0.4)',
        transition: { type: 'spring', stiffness: 250, damping: 20 }
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function useParallax(strength = 100) {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 1000], [0, strength]);
}

export function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) controls.start('visible');
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls, threshold]);
  
  return ref;
}

export function ScrollReveal({ children, threshold = 0.2, className, ...props }) {
  const ref = useScrollReveal(threshold);
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate="visible"
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FloatingBall({ delay = 0, size = 2, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.4, 0.6, 0],
        y: [0, -150 - Math.random() * 100, -300 - Math.random() * 200, -450 - Math.random() * 150, -600],
        x: [0, -50, 50, -30, 0],
        scale: [0, 1, 1.2, 0.8, 0],
        rotate: [0, 720, 1440],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        delay,
        ease: 'easeInOut',
      }}
      style={{ 
        fontSize: `${size}rem`,
        pointerEvents: 'none',
        position: 'absolute',
        bottom: '10%',
        left: `${10 + Math.random() * 80}%`,
      }}
    >
      ⚽
    </motion.div>
  );
}

export function BicycleKick({ className }) {
  return (
    <motion.svg 
      className={className} 
      viewBox="0 0 200 200" 
      style={{ width: '300px', height: '300px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Player body - torso */}
      <motion.path
        d="M100 80 Q90 100 100 130 Q110 100 100 80"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="4"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
      />
      
      {/* Head */}
      <motion.circle
        cx="100" cy="60" r="18"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="3"
        filter="url(#glow)"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
      />
      
      {/* Kicking leg - animated bicycle kick */}
      <motion.g initial={{ rotate: 0, transformOrigin: '100 130' }}>
        <motion.path
          d="M100 130 Q140 140 170 130 Q185 125 180 110"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            rotate: [0, -90, -180, -90, 0],
            transformOrigin: '100 130'
          }}
          transition={{ 
            pathLength: { duration: 0.8 },
            rotate: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
        
        {/* Foot */}
        <motion.ellipse
          cx="180" cy="110" rx="12" ry="8"
          fill="#f59e0b"
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 30, -30, 0],
            transformOrigin: '180 110'
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
      
      {/* Other leg */}
      <motion.path
        d="M100 130 Q70 150 50 170"
        fill="none"
        stroke="#a855f7"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      
      {/* Arms - dynamic */}
      <motion.path
        d="M100 90 Q130 70 150 80"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="3"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: 1,
          d: [
            'M100 90 Q130 70 150 80',
            'M100 90 Q140 50 160 60',
            'M100 90 Q130 70 150 80'
          ]
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.path
        d="M100 90 Q70 70 50 80"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="3"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* Ball */}
      <motion.circle
        cx="175" cy="105" r="10"
        fill="white"
        filter="url(#glow)"
        initial={{ scale: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          cx: [175, 160, 140, 120, 100, 80, 60, 40, 20],
          cy: [105, 90, 70, 50, 40, 50, 70, 90, 110],
          fill: ['white', '#f59e0b', 'white', '#22d3ee', 'white', '#a855f7', 'white', '#f59e0b', 'white']
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 0.6
        }}
      />
      
      {/* Motion trails */}
      <motion.g 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
      >
        <path d="M175 105 Q155 90 135 75" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M175 105 Q155 95 135 85" stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M175 105 Q155 100 135 95" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.3" />
      </motion.g>
      
      {/* Impact particles */}
      <motion.g initial={{ opacity: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx="175" cy="105" r="4"
            fill={['#22d3ee', '#f59e0b', '#a855f7', '#10b981'][i % 4]}
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              r: [4, 12, 0],
              cx: [175, 175 + Math.cos(i * 0.785) * 80],
              cy: [105, 105 + Math.sin(i * 0.785) * 80]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.1 + 0.8,
              ease: 'easeOut'
            }}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}

export function ParticleBurst({ x = 0, y = 0, color = '#22d3ee', count = 12, className }) {
  return (
    <motion.div className={className} style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [1, 0],
            x: Math.cos(i * (360 / count) * Math.PI / 180) * (50 + Math.random() * 50),
            y: Math.sin(i * (360 / count) * Math.PI / 180) * (50 + Math.random() * 50),
          }}
          transition={{ 
            duration: 0.8 + Math.random() * 0.4,
            delay: Math.random() * 0.2,
            ease: 'easeOut'
          }}
        />
      ))}
    </motion.div>
  );
}

export function Confetti({ className }) {
  const colors = ['#22d3ee', '#f59e0b', '#a855f7', '#10b981', '#ef4444', '#ec4899'];
  
  return (
    <motion.div className={className} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            background: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
            boxShadow: '0 0 10px currentColor',
          }}
          initial={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
          animate={{ 
            y: `${window.innerHeight + 100}px`,
            rotate: `${360 + Math.random() * 720}deg`,
            opacity: [1, 1, 0],
            scale: [1, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeIn',
          }}
        />
      ))}
    </motion.div>
  );
}

export function PageTransition({ children }) {
  return (
    <motion.div
      {...pageTransition}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}