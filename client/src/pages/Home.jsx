import { useSeo } from '../hooks/useSeo';
import Hero from '../components/home/Hero';
import FeaturedServices from '../components/home/FeaturedServices';
import HomePortfolio from '../components/home/HomePortfolio';
import BeforeAfterSection from '../components/home/BeforeAfterSection';
import MaterialShowcase from '../components/home/MaterialShowcase';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ProcessTimeline from '../components/home/ProcessTimeline';
import CustomerGallery from '../components/home/CustomerGallery';
import Testimonials from '../components/home/Testimonials';
import AboutPreview from '../components/home/AboutPreview';
import QuoteSection from '../components/home/QuoteSection';

export default function Home() {
  useSeo({});

  return (
    <>
      <Hero />
      <FeaturedServices />
      <HomePortfolio />
      <BeforeAfterSection />
      <MaterialShowcase />
      <WhyChooseUs />
      <ProcessTimeline />
      <CustomerGallery />
      <Testimonials />
      <AboutPreview />
      <QuoteSection />
    </>
  );
}
