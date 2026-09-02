import { CourseOverview } from '@/components/learning/course-pages';
import { learningGroups } from '@/lib/lessons';
import { learningMetadata } from '@/lib/page-metadata';

export const metadata = learningMetadata(
  learningGroups[1].title,
  learningGroups[1].description,
);

export default function UnrealCoursePage() {
  return <CourseOverview groupId="unreal-engine" />;
}
