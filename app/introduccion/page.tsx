import { redirect } from 'next/navigation';

// Conserva el enlace de la primera versión y lleva al nuevo grupo.
export default function IntroductionRedirect() {
  redirect('/cpp/introduccion');
}
