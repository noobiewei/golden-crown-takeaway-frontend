import { useEffect } from 'react';

// Sets the document title and meta description for the current page. Plain
// SPAs serve the same index.html for every route, so without this every
// page would show the same generic title/description in search results.
export function useSeo(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? '';
    meta?.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      meta?.setAttribute('content', previousDescription);
    };
  }, [title, description]);
}
