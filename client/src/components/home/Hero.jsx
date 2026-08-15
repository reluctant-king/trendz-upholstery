import { useSite } from '../../context/SiteContext';
import UpholsteryImageRevealHero from './UpholsteryImageRevealHero';

export default function Hero() {
  const { projects } = useSite();
  const demo = projects.find((p) => p.beforeImage && p.afterImage) || projects[0];

  return (
    <UpholsteryImageRevealHero
      baseImage={demo?.beforeImage}
      revealImage={demo?.afterImage}
      baseAlt="Sofa before upholstery"
      revealAlt="Same sofa after restoration"
    />
  );
}
