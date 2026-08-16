import { useEffect } from 'react';

const SITE_URL = 'https://aymaseguros.com.ar';

/**
 * Actualiza title, meta description y canonical del documento en cada ruta.
 * Necesario porque la app es una SPA sin SSR/prerender: el index.html trae
 * valores por defecto para "/", y cada página debe pisarlos con los propios
 * para que canonical/title/description sean únicos por URL.
 */
export function useSEO({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;
    const previousTitle = document.title;

    if (title) document.title = title;

    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
        if (selector.includes('rel="canonical"')) el.setAttribute('rel', 'canonical');
        if (selector.includes('name="description"')) el.setAttribute('name', 'description');
        if (selector.includes('property="og:title"')) el.setAttribute('property', 'og:title');
        if (selector.includes('property="og:description"')) el.setAttribute('property', 'og:description');
        if (selector.includes('property="og:url"')) el.setAttribute('property', 'og:url');
        if (selector.includes('name="robots"')) el.setAttribute('name', 'robots');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }
    if (title) setMeta('meta[property="og:title"]', 'content', title);
    setMeta('link[rel="canonical"]', 'href', canonicalUrl);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, path, noindex]);
}
