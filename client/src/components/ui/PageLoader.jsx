import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="h-10 w-10 rounded-full border-2 border-beige border-t-gold"
      />
    </div>
  );
}
