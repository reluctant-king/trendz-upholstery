import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import RequireAuth from './components/admin/RequireAuth';
import PageLoader from './components/ui/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const OurWork = lazy(() => import('./pages/OurWork'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Services = lazy(() => import('./pages/Services'));
const Collections = lazy(() => import('./pages/Collections'));
const Materials = lazy(() => import('./pages/Materials'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Quote = lazy(() => import('./pages/Quote'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const OurWorkManage = lazy(() => import('./pages/admin/OurWorkManage'));
const ProjectFormPage = lazy(() => import('./pages/admin/ProjectFormPage'));
const ServicesManage = lazy(() => import('./pages/admin/ServicesManage'));
const TestimonialsManage = lazy(() => import('./pages/admin/TestimonialsManage'));
const EnquiriesManage = lazy(() => import('./pages/admin/EnquiriesManage'));
const EnquiryDetail = lazy(() => import('./pages/admin/EnquiryDetail'));
const GalleryManage = lazy(() => import('./pages/admin/GalleryManage'));
const SiteContentManage = lazy(() => import('./pages/admin/SiteContentManage'));
const SettingsManage = lazy(() => import('./pages/admin/SettingsManage'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/our-work/:slug" element={<ProjectDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="our-work" element={<OurWorkManage />} />
          <Route path="our-work/new" element={<ProjectFormPage />} />
          <Route path="our-work/:id/edit" element={<ProjectFormPage />} />
          <Route path="services" element={<ServicesManage />} />
          <Route path="testimonials" element={<TestimonialsManage />} />
          <Route path="enquiries" element={<EnquiriesManage />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
          <Route path="gallery" element={<GalleryManage />} />
          <Route path="site-content" element={<SiteContentManage />} />
          <Route path="settings" element={<SettingsManage />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatedRoutes />
    </Suspense>
  );
}
