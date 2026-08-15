import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Image from '../ui/Image';

export default function PortfolioCard({ project, className = '' }) {
  const img = project.coverImage || project.galleryImages?.[0]?.url || '';
  return (
    <Link
      to={`/our-work/${project.slug}`}
      className={`group relative block overflow-hidden rounded-4xl bg-surface shadow-soft transition-shadow duration-500 hover:shadow-lift ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={project.coverImageAlt || project.title}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-deep">
            View Project <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      <div className="p-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mutedGold">
          {project.categoryName || project.category?.name || 'Upholstery Work'}
        </span>
        <h3 className="mt-1.5 font-display text-xl leading-snug text-navy transition-colors group-hover:text-mutedGold">
          {project.title}
        </h3>
        {project.location && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/45">
            <MapPin size={12} /> {project.location}
          </p>
        )}
      </div>
    </Link>
  );
}
