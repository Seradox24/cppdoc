'use client';

import Link from 'next/link';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Command,
  Compass,
  FileCode2,
  Flag,
  Menu,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  lessons,
  learningGroups,
  publishedLessons,
  getGroupLessons,
  sources,
  type LessonId,
  type GroupId,
} from '@/lib/lessons';
import { useLearningProgress } from '@/lib/learning-progress';

const ProgressContext = createContext<{
  completed: LessonId[];
  toggle: (id: LessonId) => void;
}>({ completed: [], toggle: () => {} });

export function CompleteLesson({ id }: { id: LessonId }) {
  const { completed, toggle } = useContext(ProgressContext);
  const done = completed.includes(id);
  if (!publishedLessons.some((item) => item.id === id)) return null;
  return (
    <Button
      className="complete-button"
      variant={done ? 'secondary' : 'outline'}
      aria-pressed={done}
      onClick={() => toggle(id)}
    >
      <Check size={15} />
      {done ? 'Lección completada' : 'Marcar como completada'}
    </Button>
  );
}

export function LearningShell({
  lesson,
  group,
  children,
}: {
  lesson?: LessonId;
  group?: GroupId;
  children: ReactNode;
}) {
  const { completed, storageAvailable, toggle } = useLearningProgress();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const current = lessons.find((item) => item.id === lesson);
  const activeGroup = learningGroups.find(
    (item) => item.id === (current?.group ?? group),
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const searchItems = [
    ...lessons.map((item) => ({
      ...item,
      context: item.group
        ? learningGroups.find((g) => g.id === item.group)!.shortTitle
        : 'Inicio',
    })),
    ...learningGroups.map((item) => ({
      ...item,
      keywords: item.title,
      status: 'group',
      context: 'Grupo de aprendizaje',
    })),
  ];
  const results = searchItems.filter((item) =>
    normalize(`${item.title} ${item.description} ${item.keywords}`).includes(
      normalize(query),
    ),
  );

  const navigation = (
    <>
      <Link
        href="/"
        className="brand"
        onClick={() => setMenuOpen(false)}
        aria-label="C++ visual, inicio"
      >
        <span className="brand-icon">
          <Code2 size={24} />
        </span>
        <span>
          C++ <strong>visual</strong>
          <small>DE LA IDEA AL JUEGO</small>
        </span>
      </Link>
      <div className="workspace-tag">
        <Code2 size={15} />
        <span>C++ → Unreal Engine</span>
        <span className="version-tag">RUTA</span>
      </div>
      <nav aria-label="Ruta de aprendizaje" className="lesson-nav">
        <div className="nav-label">TU PUNTO DE PARTIDA</div>
        {lessons
          .filter((item) => item.group === null)
          .map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-item ${lesson === item.id ? 'active' : ''}`}
              aria-current={lesson === item.id ? 'page' : undefined}
            >
              <Compass size={17} />
              <span>{item.title}</span>
              {completed.includes(item.id) ? (
                <Check className="nav-check" size={14} />
              ) : lesson === item.id ? (
                <span className="active-dot" />
              ) : null}
            </Link>
          ))}
        {learningGroups.map((item, index) => (
          <details
            className={`nav-group course-nav-group ${activeGroup?.id === item.id ? 'current-group' : ''}`}
            key={item.id}
            open
          >
            <summary>
              <span className="group-number">0{index + 1}</span>
              <span>{item.title}</span>
              <ChevronRight size={13} />
            </summary>
            <Link
              href={item.href}
              className={`nav-item group-overview-link ${!lesson && activeGroup?.id === item.id ? 'active' : ''}`}
              aria-current={
                !lesson && activeGroup?.id === item.id ? 'page' : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              <BookOpen size={14} />
              <span>{item.id === 'cpp' ? 'Ver temario' : 'Próxima etapa'}</span>
            </Link>
            {getGroupLessons(item.id).map((activity, activityIndex) => (
              <Link
                key={activity.id}
                href={activity.href}
                className={`nav-item activity-nav ${lesson === activity.id ? 'active' : ''}`}
                aria-current={lesson === activity.id ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-index">
                  {String(activityIndex + 1).padStart(2, '0')}
                </span>
                <span>{activity.title}</span>
                {completed.includes(activity.id) ? (
                  <Check size={12} className="nav-check" />
                ) : (
                  <span
                    className={
                      activity.status === 'ready'
                        ? 'ready-indicator'
                        : 'pending-indicator'
                    }
                    title={
                      activity.status === 'ready'
                        ? 'Disponible'
                        : 'Contenido pendiente'
                    }
                    aria-label={
                      activity.status === 'ready'
                        ? 'Disponible'
                        : 'Contenido pendiente'
                    }
                  />
                )}
              </Link>
            ))}
            {getGroupLessons(item.id).length === 0 && (
              <p className="nav-empty-note">Actividades por definir</p>
            )}
          </details>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="progress-heading">
          <span>
            <Flag size={14} /> Tu progreso
          </span>
          <span>
            {completed.length} / {publishedLessons.length}
          </span>
        </div>
        <Progress
          value={
            publishedLessons.length
              ? (completed.length / publishedLessons.length) * 100
              : 0
          }
          aria-label="Progreso de las lecciones disponibles"
        />
        <p>
          {storageAvailable
            ? 'Solo contenido publicado · Guardado aquí'
            : 'Disponible solo durante esta sesión'}
        </p>
        <div className="build-note">
          <span className="active-dot" /> Un cuaderno en construcción{' '}
          <span>v0.2</span>
        </div>
      </div>
    </>
  );

  return (
    <ProgressContext.Provider value={{ completed, toggle }}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="app-shell">
        <aside className="sidebar">{navigation}</aside>
        <div className="main-shell">
          <header className="topbar">
            <div className="breadcrumbs">
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu"
                aria-label="Abrir navegación"
                onClick={() => setMenuOpen(true)}
              >
                <Menu />
              </Button>
              <BookOpen size={15} />
              <span title={activeGroup?.title}>
                {activeGroup?.shortTitle ?? 'Inicio'}
              </span>
              <ChevronRight size={13} />
              <strong>{current?.title ?? 'Temario'}</strong>
            </div>
            <div className="topbar-actions">
              <Button
                variant="ghost"
                className="search-trigger"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={15} />
                <span>Buscar en la guía...</span>
                <kbd>
                  <Command size={10} /> K
                </kbd>
              </Button>
              {activeGroup?.id !== 'cpp' && (
                <a
                  className="docs-link"
                  href={sources.quickStart}
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs de Unreal <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </header>
          <main id="contenido" className="content" tabIndex={-1}>
            {children}
            <footer className="page-footer">
              <span>
                <Code2 size={14} /> Hecho para aprender, una idea a la vez.
              </span>
              <span>Una guía independiente · C++ & Unreal Engine</span>
            </footer>
          </main>
        </div>
      </div>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="search-dialog">
          <DialogTitle>¿Qué quieres entender hoy?</DialogTitle>
          <DialogDescription>
            Busca grupos y actividades, incluidas las páginas pendientes.
          </DialogDescription>
          <Input
            aria-label="Buscar lecciones"
            placeholder="Prueba con «variables», «bucles» o «Unreal»"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="search-results">
            {results.length ? (
              results.map((item) => (
                <Link
                  href={item.href}
                  key={item.id}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery('');
                  }}
                >
                  <FileCode2 size={19} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                    <small className="search-result-context">
                      {item.context} ·{' '}
                      {item.status === 'planned'
                        ? 'Contenido pendiente'
                        : item.status === 'group'
                          ? 'Temario'
                          : 'Disponible'}
                    </small>
                  </span>
                  <ChevronRight size={16} />
                </Link>
              ))
            ) : (
              <p>
                No hay resultados. Prueba con «variables», «bucles» o «Unreal».
              </p>
            )}
          </div>
          <small className="muted">
            {learningGroups.length} grupos ·{' '}
            {lessons.filter((item) => item.status === 'planned').length}{' '}
            actividades por desarrollar
          </small>
        </DialogContent>
      </Dialog>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="mobile-nav-dialog">
          <DialogTitle className="sr-only">
            Navegación de C++ visual
          </DialogTitle>
          <DialogDescription className="sr-only">
            Lecciones disponibles y tu progreso.
          </DialogDescription>
          {navigation}
        </DialogContent>
      </Dialog>
    </ProgressContext.Provider>
  );
}
