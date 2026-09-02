import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cpp-visual-unreal.seradox30.chatgpt.site'),
  title: {
    default: 'C++ visual — Aprende para Unreal Engine',
    template: '%s · C++ visual',
  },
  description:
    'Un cuaderno interactivo para entender C++ y llevar tus primeras ideas a Unreal Engine. Aprende con ejemplos, diagramas y pequeños experimentos.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'C++ visual',
    description: 'Entiende el código. Dale vida a tus ideas.',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1536,
        height: 1024,
        alt: 'C++ visual: de la idea al juego',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C++ visual',
    description: 'Entiende el código. Dale vida a tus ideas.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
