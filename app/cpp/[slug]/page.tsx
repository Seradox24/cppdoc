import { notFound } from 'next/navigation';
import { AssignmentOperatorsLesson } from '@/components/learning/assignment-operators-lesson';
import { PendingLesson } from '@/components/learning/course-pages';
import { FunctionFlowLesson } from '@/components/learning/function-flow-lesson';
import { VariablesLesson } from '@/components/learning/variables-lesson';
import { VariableFormatLesson } from '@/components/learning/variable-format-lesson';
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
    `${lesson.description} ${lesson.status === 'ready' ? 'Explora ejemplos y experimentos interactivos.' : 'Actividad pendiente del grupo de C++ sin Unreal Engine.'}`,
  );
}

export default async function CppActivityPage({ params }: Props) {
  const lesson = findLesson((await params).slug);
  if (!lesson) notFound();
  if (lesson.id === 'cpp-tipos-de-datos-y-variables') {
    return <VariablesLesson />;
  }
  if (lesson.id === 'cpp-formato-de-variables') {
    return <VariableFormatLesson />;
  }
  if (lesson.id === 'cpp-funciones-y-flujo-de-ejecucion') {
    return <FunctionFlowLesson />;
  }
  if (lesson.id === 'cpp-asignacion-y-operadores') {
    return <AssignmentOperatorsLesson />;
  }
  return <PendingLesson lesson={lesson} />;
}
