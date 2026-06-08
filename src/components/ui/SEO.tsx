import { useEffect } from 'react';
import { BRAND } from '../../lib/constants';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
}

export default function SEO({ title, description, canonical, ogImage, keywords, structuredData, noIndex = false }: SEOProps) {
  const fullTitle = title.includes(BRAND.name) ? title : `${title} | ${BRAND.name}`;
  const ogImg = ogImage ?? 'https://washmate.in/og-image.jpg';
  const url = canonical ?? window.location.href;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    if (keywords) setMeta('meta[name="keywords"]', 'content', keywords);
    if (noIndex) setMeta('meta[name="robots"]', 'content', 'noindex,nofollow');

    // OG
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:image"]', 'content', ogImg);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', BRAND.name);

    // Twitter
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImg);

    // Canonical
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Structured data
    if (structuredData) {
      const existingScript = document.getElementById('structured-data');
      if (existingScript) existingScript.remove();
      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, ogImg, url, keywords, noIndex, structuredData, canonical]);

  return null;
}
