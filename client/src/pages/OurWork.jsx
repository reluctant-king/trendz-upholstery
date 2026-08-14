import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import PageHeader from '../components/layout/PageHeader';
import PortfolioFilter from '../components/portfolio/PortfolioFilter';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import QuoteCTA from '../components/home/QuoteCTA';
import { useSite } from '../context/SiteContext';

const PAGE_SIZE = 9;

export default function OurWork() {
  useSeo({
    title: 'Our Work',
    description:
      'Browse our upholstery portfolio — sofa sets, upholstery, curtains, seat covers, custom furniture and more, crafted and delivered for real homes.',
  });

  const { projects, categories } = useSite();
  const [active, setActive] = useState('All');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filterList = categories.map((c) => c.name);

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.categoryName === active)),
    [projects, active]
  );

  const shown = filtered.slice(0, visible);

  const resetPage = (cat) => {
    setActive(cat);
    setVisible(PAGE_SIZE);
  };

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Our Work"
        subtitle="A collection of spaces, furniture and custom pieces brought back to life — made to fit real homes."
        image={projects[0]?.coverImage}
        crumb={[{ label: 'Our Work' }]}
      />

      <section className="bg-warmWhite py-14 md:py-20">
        <div className="container-px">
          <PortfolioFilter categories={filterList} active={active} onChange={resetPage} />

          <div className="mt-10">
            <PortfolioGrid projects={shown} className="mt-0" />
          </div>

          {visible < filtered.length && (
            <div className="mt-12 flex justify-center">
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-outline px-8 py-4">
                <Loader2 size={15} className="mr-2" /> Load More Projects
              </button>
            </div>
          )}
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
