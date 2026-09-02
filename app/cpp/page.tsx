import { CourseOverview } from '@/components/learning/course-pages';
import { learningGroups } from '@/lib/lessons';
import { learningMetadata } from '@/lib/page-metadata';

export const metadata = learningMetadata(
  learningGroups[0].title,
  learningGroups[0].description,
);

export default function CppCoursePage() {
  return <CourseOverview groupId="cpp" />;
}
