import { notFound } from 'next/navigation';
import { PendingLesson } from '@/components/learning/course-pages';
import { cppActivities, lessons } from '@/lib/lessons';
import { learningMetadata } from '@/lib/page-metadata';

type Props = { params: Promise<{ slug: string }> };

function findLesson(slug: string) {
  return lessons.find(
    (lesson) => lesson.group === 'cpp' && lesson.href === `/cpp/${slug}`,
  );
}

export function generateStaticParams() {
  return cppActivities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: Props) {
  const lesson = findLesson((await params).slug);
  if (!lesson) notFound();
  return learningMetadata(
    lesson.title,
    `${lesson.description} Actividad pendiente del grupo de C++ sin Unreal Engine.`,
  );
}

export default async function CppActivityPage({ params }: Props) {
  const lesson = findLesson((await params).slug);
  if (!lesson) notFound();
  return <PendingLesson lesson={lesson} />;
}
