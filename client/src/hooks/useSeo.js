import { useEffect } from 'react';

const setMeta = (attr, key, value) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

/**
 * Lightweight SEO hook — sets title, description and Open Graph tags.
 */
export const useSeo = ({ title, description, image, url } = {}) => {
  useEffect(() => {
    const siteName = 'Trendz Upholstery';
    const fullTitle = title ? `${title} — ${siteName}` : `${siteName} — Custom Upholstery & Interiors`;
    document.title = fullTitle;
    setMeta('name', 'description', description || '');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:type', 'article');
    if (image) setMeta('property', 'og:image', image);
    if (url) setMeta('property', 'og:url', url);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (url) {
      if (!canonical) {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = url;
        document.head.appendChild(link);
      } else {
        canonical.href = url;
      }
    }
  }, [title, description, image, url]);
};
