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
  Box,
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
import { lessons, sources, upcomingGroups, type LessonId } from '@/lib/lessons';
import { useLearningProgress } from '@/lib/learning-progress';

const ProgressContext = createContext<{
  completed: LessonId[];
  toggle: (id: LessonId) => void;
}>({ completed: [], toggle: () => {} });

export function CompleteLesson({ id }: { id: LessonId }) {
  const { completed, toggle } = useContext(ProgressContext);
  const done = completed.includes(id);
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
  children,
}: {
  lesson: LessonId;
  children: ReactNode;
}) {
  const { completed, storageAvailable, toggle } = useLearningProgress();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const current = lessons.find((item) => item.id === lesson)!;

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
  const results = lessons.filter((item) =>
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
        <Box size={15} />
        <span>Unreal Engine</span>
        <span className="version-tag">UE 5</span>
      </div>
      <nav aria-label="Ruta de aprendizaje" className="lesson-nav">
        <div className="nav-label">
          EMPIEZA AQUÍ <span>{String(lessons.length).padStart(2, '0')}</span>
        </div>
        {lessons.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className={`nav-item ${lesson === item.id ? 'active' : ''}`}
            aria-current={lesson === item.id ? 'page' : undefined}
          >
            {index === 0 ? <Compass size={17} /> : <FileCode2 size={17} />}
            <span>{item.title}</span>
            {completed.includes(item.id) ? (
              <Check className="nav-check" size={14} />
            ) : lesson === item.id ? (
              <span className="active-dot" />
            ) : (
              <span className="nav-index">0{index + 1}</span>
            )}
          </Link>
        ))}
        {upcomingGroups.map((group) => (
          <div className="nav-group" key={group.title}>
            <div className="nav-label">{group.title}</div>
            {group.items.map((title) => (
              <div
                key={title}
                className="nav-item upcoming"
                aria-disabled="true"
                title="Próximamente"
              >
                <span className="future-dot" />
                <span>{title}</span>
                <span className="future-label">Pronto</span>
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="progress-heading">
          <span>
            <Flag size={14} /> Tu progreso
          </span>
          <span>
            {completed.length} / {lessons.length}
          </span>
        </div>
        <Progress
          value={(completed.length / lessons.length) * 100}
          aria-label="Progreso de las lecciones disponibles"
        />
        <p>
          {storageAvailable
            ? 'Guardado en este navegador'
            : 'Disponible solo durante esta sesión'}
        </p>
        <div className="build-note">
          <span className="active-dot" /> Un cuaderno en construcción{' '}
          <span>v0.1</span>
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
              <span>Empieza aquí</span>
              <ChevronRight size={13} />
              <strong>{current.title}</strong>
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
              <a
                className="docs-link"
                href={sources.quickStart}
                target="_blank"
                rel="noreferrer"
              >
                Docs de Unreal <ArrowUpRight size={14} />
              </a>
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
            Busca entre las lecciones disponibles.
          </DialogDescription>
          <Input
            aria-label="Buscar lecciones"
            placeholder="Prueba con «Actor» o «Blueprint»"
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
                  </span>
                  <ChevronRight size={16} />
                </Link>
              ))
            ) : (
              <p>
                No hay resultados. Prueba con «C++», «escala» o «Blueprint».
              </p>
            )}
          </div>
          <small className="muted">
            {lessons.length} lecciones disponibles · Más temas en preparación
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
