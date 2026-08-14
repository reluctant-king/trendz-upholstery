import { createContext, useContext } from 'react';
import { motion } from 'framer-motion';

const ImageRevealContext = createContext(false);

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function StaggerGroup({ children, className = '' }) {
  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      <ImageRevealContext.Provider value>{children}</ImageRevealContext.Provider>
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  const inGroup = useContext(ImageRevealContext);
  const Comp = inGroup ? motion.div : motion.div;
  return (
    <Comp
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </Comp>
  );
}
