import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  categoryApi,
  collectionApi,
  galleryApi,
  materialApi,
  projectApi,
  serviceApi,
  settingsApi,
  testimonialApi,
} from '../lib/api';
import {
  placeholderCategories,
  placeholderCollections,
  placeholderGallery,
  placeholderMaterials,
  placeholderProjects,
  placeholderServices,
  placeholderSettings,
  placeholderTestimonials,
} from '../lib/placeholderData';

const SiteContext = createContext(null);

const withFallback = (loader, fallback) => async () => {
  try {
    return { data: await loader(), source: 'api' };
  } catch {
    return { data: fallback, source: 'placeholder' };
  }
};

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(placeholderSettings);
  const [categories, setCategories] = useState(placeholderCategories);
  const [services, setServices] = useState(placeholderServices);
  const [projects, setProjects] = useState(placeholderProjects);
  const [testimonials, setTestimonials] = useState(placeholderTestimonials);
  const [collections, setCollections] = useState(placeholderCollections);
  const [materials, setMaterials] = useState(placeholderMaterials);
  const [galleryImages, setGalleryImages] = useState(placeholderGallery);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('placeholder');

  const refresh = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      withFallback(() => settingsApi.get().then((r) => r.settings), placeholderSettings)(),
      withFallback(() => categoryApi.list().then((r) => r.categories), placeholderCategories)(),
      withFallback(() => serviceApi.list().then((r) => r.services), placeholderServices)(),
      withFallback(() => projectApi.list({ published: true }).then((r) => r.projects), placeholderProjects)(),
      withFallback(() => testimonialApi.list({ published: true }).then((r) => r.testimonials), placeholderTestimonials)(),
      withFallback(() => collectionApi.list({ published: true }).then((r) => r.collections), placeholderCollections)(),
      withFallback(() => materialApi.list({ published: true }).then((r) => r.materials), placeholderMaterials)(),
      withFallback(() => galleryApi.list().then((r) => r.images), placeholderGallery)(),
    ]);

    const [s, c, sv, pr, te, co, ma, ga] = results.map((r) => (r.status === 'fulfilled' ? r.value : { data: undefined, source: 'placeholder' }));

    if (s.data) setSettings(s.data);
    if (c.data) setCategories(c.data);
    if (sv.data) setServices(sv.data);
    if (pr.data) setProjects(pr.data);
    if (te.data) setTestimonials(te.data);
    if (co.data) setCollections(co.data);
    if (ma.data) setMaterials(ma.data);
    if (ga.data) setGalleryImages(ga.data);

    const sources = [s, c, sv, pr, te, co, ma, ga].map((x) => x.source);
    setSource(sources.includes('api') ? 'api' : 'placeholder');
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      settings,
      categories,
      services,
      projects,
      testimonials,
      collections,
      materials,
      galleryImages,
      loading,
      source,
      refresh,
    }),
    [settings, categories, services, projects, testimonials, collections, materials, galleryImages, loading, source, refresh]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
};
