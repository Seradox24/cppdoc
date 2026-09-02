import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  Clock3,
  Code2,
  FlaskConical,
  Layers3,
  MousePointer2,
  Sparkles,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { CompleteLesson } from './learning-shell';
import { ScaleLab } from './scale-lab';
import { RouteOverview } from './route-overview';

export function Welcome() {
  return (
    <>
      <div className="lesson-meta">
        <span className="eyebrow">
          <span className="active-dot" /> EMPIEZA AQUÍ
        </span>
        <span>
          <Clock3 size={13} /> 4 min de lectura{' '}
          <span className="meta-dot">·</span> Nivel inicial
        </span>
      </div>
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <div className="hero-copy">
          <div className="welcome-label">
            Hola, futuro game developer <span aria-hidden="true">↗</span>
          </div>
          <h1 id="welcome-title">
            Entiende el código.
            <br />
            <span>Dale vida a tus ideas.</span>
          </h1>
          <p>
            Primero entiende C++. Después, llévalo a Unreal Engine.
            <br className="desktop-break" /> Una guía visual para aprender,
            experimentar y entender
            <br className="desktop-break" /> qué pasa detrás de cada línea.
          </p>
          <div className="hero-actions">
            <Link
              href="/cpp/introduccion"
              className={`${buttonVariants()} primary-link`}
            >
              Empezar a aprender <ArrowRight size={16} />
            </Link>
            <a href="#ruta" className="text-link">
              Explorar la ruta <ArrowDown size={14} />
            </a>
          </div>
          <div className="hero-note">
            <Check size={13} /> Desde cero. A tu ritmo. Con las manos en el
            código.
          </div>
        </div>
        <div
          className="hero-diagram"
          aria-label="Del código C++ a un Actor en tu juego"
        >
          <div className="diagram-caption">
            <span className="active-dot" /> DE LA IDEA AL MUNDO
          </div>
          <div className="mini-code">
            <div>
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>Tu primera idea.cpp</span>
              <Code2 size={13} />
            </div>
            <pre>
              <span className="syntax-purple">void</span>{' '}
              <span className="syntax-green">BeginPlay</span>()
              <br />
              {'{'}
              <br />
              {'  '}
              <span className="syntax-comment">{'// Todo empieza aquí.'}</span>
              <br />
              {'  '}
              <span className="syntax-blue">CrearAlgoIncreible</span>();
              <br />
              {'}'}
            </pre>
          </div>
          <div className="diagram-connector">
            <span />
            <span>una idea toma forma</span>
            <ArrowDown size={14} />
          </div>
          <div className="actor-node">
            <span className="actor-icon">
              <Box size={28} strokeWidth={1.2} />
            </span>
            <span>
              <strong>Tu próximo juego</strong>
              <small>Empieza con un pequeño paso</small>
            </span>
            <Sparkles size={15} />
          </div>
          <small className="pseudocode-note">
            Pseudocódigo para inspirarte
          </small>
        </div>
      </section>
      <div className="learning-principles">
        <div>
          <span className="principle-icon">
            <MousePointer2 size={19} />
          </span>
          <span>
            <strong>Aprende haciendo</strong>
            <small>Mueve, prueba y descubre.</small>
          </span>
        </div>
        <div>
          <span className="principle-icon">
            <Layers3 size={19} />
          </span>
          <span>
            <strong>Una idea a la vez</strong>
            <small>Sin saltos. Sin dar nada por hecho.</small>
          </span>
        </div>
        <div>
          <span className="principle-icon">
            <Box size={19} />
          </span>
          <span>
            <strong>Con destino a Unreal</strong>
            <small>Cada concepto, dentro de un juego.</small>
          </span>
        </div>
      </div>
      <section id="experimento" className="content-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              MENOS IMAGINAR. MÁS EXPERIMENTAR.
            </div>
            <h2>Un pequeño cambio. Un resultado visible.</h2>
            <p>
              No necesitas entender todo el código todavía. Mueve el slider y
              mira qué pasa.
            </p>
          </div>
          <span className="outline-badge">
            <FlaskConical size={13} /> Tu primer experimento
          </span>
        </div>
        <ScaleLab />
      </section>
      <RouteOverview />
      <aside className="friendly-note">
        <span className="note-icon">
          <BookOpen size={20} />
        </span>
        <div>
          <strong>No tienes que memorizarlo todo.</strong>
          <p>
            Entender lleva tiempo. Vuelve a un ejemplo, cambia un valor y hazte
            preguntas. Esta guía está para acompañarte en ese proceso.
          </p>
        </div>
      </aside>
      <div className="lesson-bottom">
        <CompleteLesson id="bienvenida" />
        <Link href="/cpp" className="next-lesson">
          <span>
            <small>PRIMER GRUPO</small>C++ sin Unreal Engine
          </span>
          <ArrowUpRight size={22} />
        </Link>
      </div>
    </>
  );
}
