import { Welcome } from '@/components/learning/welcome';
import { LearningShell } from '@/components/learning/learning-shell';

export default function Home() {
  return (
    <LearningShell lesson="bienvenida">
      <Welcome />
    </LearningShell>
  );
}
