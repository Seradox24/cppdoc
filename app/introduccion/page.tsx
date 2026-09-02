import type { Metadata } from 'next';
import { LearningShell } from '@/components/learning/learning-shell';
import { Introduction } from '@/components/learning/introduction';

export const metadata: Metadata = {
  title: 'Introducción a C++',
  description:
    'Entiende cómo C++, Blueprint y los Actors se conectan en Unreal Engine con un diagrama interactivo y ejemplos explicados.',
  openGraph: {
    title: 'Introducción a C++ · C++ visual',
    description: 'Del lenguaje a los objetos de tu juego.',
    images: [],
  },
  twitter: {
    title: 'Introducción a C++ · C++ visual',
    description: 'Del lenguaje a los objetos de tu juego.',
    images: [],
  },
};

export default function IntroductionPage() {
  return (
    <LearningShell lesson="introduccion">
      <Introduction />
    </LearningShell>
  );
}
