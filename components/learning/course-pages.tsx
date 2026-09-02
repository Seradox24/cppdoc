import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Braces,
  CircleDashed,
  Layers3,
} from 'lucide-react';
import { LearningShell } from './learning-shell';
import {
  getGroupLessons,
  learningGroups,
  type GroupId,
  type Lesson,
} from '@/lib/lessons';

export function CourseOverview({ groupId }: { groupId: GroupId }) {
  const group = learningGroups.find((item) => item.id === groupId)!;
  const activities = getGroupLessons(groupId);
  const available = activities.filter(
    (activity) => activity.status === 'ready',
  ).length;
  return (
    <LearningShell group={groupId}>
      <div className="lesson-meta">
        <span className="eyebrow">
          <span className="active-dot" /> GRUPO{' '}
          {groupId === 'cpp' ? '01' : '02'}
        </span>
        <span>Ruta de aprendizaje</span>
      </div>
      <section className="intro-hero course-hero">
        <div className="welcome-label">
          {groupId === 'cpp'
            ? 'Primero, las bases del lenguaje'
            : 'Después, el motor'}
        </div>
        <h1>{group.title}</h1>
        <p>{group.description}</p>
        <div className="course-overview-meta">
          <span className="small-pill neutral">
            {activities.length
              ? `${activities.length} actividades`
              : 'Temario por definir'}
          </span>
          <span>
            {available > 0
              ? `${available} disponible${available === 1 ? '' : 's'} · Seguimos construyendo el recorrido`
              : 'Contenido pendiente · Lo construiremos paso a paso'}
          </span>
        </div>
      </section>
      {activities.length > 0 ? (
        <section aria-labelledby="curriculum-heading">
          <div className="section-heading">
            <div>
              <div className="eyebrow section-eyebrow">
                UNA ACTIVIDAD A LA VEZ
              </div>
              <h2 id="curriculum-heading">Temario del grupo</h2>
              <p>
                Las páginas están listas. Iremos añadiendo explicaciones,
                ejemplos y actividades cuando toque cada tema.
              </p>
            </div>
          </div>
          <ol className="curriculum-list">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <Link href={activity.href} className="curriculum-row">
                  <span className="curriculum-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="curriculum-copy">
                    <strong>
                      {activity.title}
                      {activity.suggested && (
                        <span className="suggested-tag">Sugerida</span>
                      )}
                    </strong>
                    <small>{activity.description}</small>
                  </span>
                  <span
                    className={`curriculum-status ${activity.status === 'ready' ? 'is-ready' : ''}`}
                  >
                    {activity.status === 'ready'
                      ? 'Disponible'
                      : 'Por desarrollar'}
                  </span>
                  <ArrowRight size={16} />
                </Link>
              </li>
            ))}
          </ol>
          <p className="curriculum-legend">
            <span className="suggested-tag">Sugerida</span> Actividad añadida
            para conectar mejor los temas del recorrido.
          </p>
        </section>
      ) : (
        <section className="empty-course">
          <Layers3 size={32} strokeWidth={1.3} />
          <h2>Este grupo crecerá cuando lleguemos aquí.</h2>
          <p>
            El espacio de C++ en Unreal Engine ya está preparado. Definiremos
            sus actividades después de trabajar las bases del lenguaje.
          </p>
          <Link href="/cpp" className="text-link">
            Explorar primero C++ <ArrowRight size={14} />
          </Link>
        </section>
      )}
      <div className="lesson-bottom">
        <Link href="/" className="text-link">
          <ArrowLeft size={14} /> Volver a bienvenida
        </Link>
        <Link
          href={groupId === 'cpp' ? '/unreal-engine' : '/cpp'}
          className="text-link"
        >
          {groupId === 'cpp' ? 'C++ en Unreal Engine' : 'C++ sin Unreal Engine'}{' '}
          <ArrowRight size={14} />
        </Link>
      </div>
    </LearningShell>
  );
}

export function PendingLesson({ lesson }: { lesson: Lesson }) {
  const group = learningGroups.find((item) => item.id === lesson.group)!;
  const activities = getGroupLessons(group.id);
  const index = activities.findIndex((item) => item.id === lesson.id);
  const previous = activities[index - 1];
  const next = activities[index + 1];
  return (
    <LearningShell lesson={lesson.id}>
      <div className="lesson-meta">
        <span className="eyebrow">
          <span className="active-dot" /> ACTIVIDAD{' '}
          {String(index + 1).padStart(2, '0')} / {activities.length}
        </span>
        <span className="pending-page-status">
          <CircleDashed size={13} /> Contenido pendiente
        </span>
      </div>
      <section className="intro-hero course-hero">
        <Link href={group.href} className="welcome-label group-back-link">
          <ArrowLeft size={12} /> {group.title}
        </Link>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        {lesson.suggested && (
          <span className="suggested-tag standalone-tag">
            Actividad sugerida para completar las bases
          </span>
        )}
      </section>
      <section className="pending-content" aria-labelledby="pending-heading">
        <span className="pending-content-icon">
          <BookOpen size={28} strokeWidth={1.4} />
        </span>
        <span className="eyebrow">UN ESPACIO PARA LA PRÓXIMA IDEA</span>
        <h2 id="pending-heading">Esta actividad la construiremos juntos.</h2>
        <p>
          Por ahora, la página está preparada. Aquí iremos incorporando la
          explicación, los ejemplos visuales y los ejercicios de este tema.
        </p>
        <div className="pending-slots">
          <span>
            <BookOpen size={15} /> Explicación
          </span>
          <span>
            <Braces size={15} /> Ejemplos
          </span>
          <span>
            <Layers3 size={15} /> Actividad visual
          </span>
        </div>
        <small>
          Los contenidos se añadirán más adelante. Esta página todavía no cuenta
          para el progreso.
        </small>
      </section>
      <nav className="activity-pagination" aria-label="Actividades del grupo">
        <Link href={previous?.href ?? group.href}>
          <ArrowLeft size={18} />
          <span>
            <small>{previous ? 'ACTIVIDAD ANTERIOR' : 'VOLVER AL GRUPO'}</small>
            <strong>{previous?.title ?? 'Ver temario completo'}</strong>
          </span>
        </Link>
        <Link href={next?.href ?? '/unreal-engine'} className="next-activity">
          <span>
            <small>{next ? 'SIGUIENTE ACTIVIDAD' : 'SIGUIENTE GRUPO'}</small>
            <strong>{next?.title ?? 'C++ en Unreal Engine'}</strong>
          </span>
          <ArrowRight size={18} />
        </Link>
      </nav>
    </LearningShell>
  );
}
