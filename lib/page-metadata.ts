import type { Metadata } from 'next';

// Cada página del temario tiene su propio título y descripción.
export function learningMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title: `${title} · C++ visual`, description, images: [] },
    twitter: { title: `${title} · C++ visual`, description, images: [] },
  };
}
