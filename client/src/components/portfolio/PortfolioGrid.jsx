import { motion } from 'framer-motion';
import PortfolioCard from './PortfolioCard';
import { SkeletonGrid } from '../ui/Skeleton';

export default function PortfolioGrid({ projects, loading = false, columns = 3, className = '' }) {
  if (loading) return <SkeletonGrid count={6} className={className} />;
  if (!projects || projects.length === 0) return null;

  const colClass = columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className={`grid gap-6 sm:gap-8 ${colClass} ${className}`}
    >
      {projects.map((project) => (
        <motion.div
          key={project._id}
          variants={{
            hidden: { opacity: 0, y: 28 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <PortfolioCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
