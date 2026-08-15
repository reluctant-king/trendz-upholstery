import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import PortfolioFilter from '../portfolio/PortfolioFilter';
import PortfolioGrid from '../portfolio/PortfolioGrid';
import { useSite } from '../../context/SiteContext';

export default function HomePortfolio() {
  const { projects, categories, settings } = useSite();
  const [active, setActive] = useState('All');

  const filterList = categories.map((c) => c.name);
  const filtered = active === 'All' ? projects : projects.filter((p) => p.categoryName === active);
  const shown = filtered.slice(0, 6);

  return (
    <section className="bg-warmWhite py-20 md:py-28" id="work">
      <div className="container-px">
        <SectionHeading
          eyebrow="Portfolio"
          title={settings.featuredWorkTitle || 'Our Work'}
          subtitle="A collection of spaces, furniture and custom pieces brought back to life."
          align="center"
        />

        <PortfolioFilter
          categories={filterList}
          active={active}
          onChange={setActive}
          className="mt-10 justify-center"
        />

        <PortfolioGrid projects={shown} className="mt-10" />

        <div className="mt-12 flex justify-center">
          <Link to="/our-work" className="btn-dark px-8 py-4">
            View All Projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
