import { useSite } from '../../context/SiteContext';
import UpholsteryImageRevealHero from './UpholsteryImageRevealHero';

export default function Hero() {
  const { projects, settings } = useSite();
  const demo = projects.find((p) => p.beforeImage && p.afterImage) || projects[0];

  return (
    <UpholsteryImageRevealHero
      baseImage={settings.heroBaseImage || demo?.beforeImage}
      revealImage={settings.heroRevealImage || demo?.afterImage}
      baseAlt="Upholstery project"
      revealAlt="Same project, fully restored"
      title={settings.heroHeading || 'Furniture That Feels Like Home.'}
      description={
        settings.heroDescription ||
        'Premium sofas, custom upholstery, curtains and furniture solutions crafted around your style.'
      }
      primaryButton={{ label: settings.heroButtonText || 'View Our Work', to: '/our-work' }}
    />
  );
}
