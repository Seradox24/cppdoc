import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Braces,
  Check,
  Clock3,
  Code2,
  Compass,
  FlaskConical,
  Layers3,
  MousePointer2,
  Sparkles,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { CompleteLesson } from './learning-shell';
import { ScaleLab } from './scale-lab';

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
            Tu primer paso en C++ para Unreal Engine.
            <br className="desktop-break" /> Una guía visual para aprender,
            experimentar y entender
            <br className="desktop-break" /> qué pasa detrás de cada línea.
          </p>
          <div className="hero-actions">
            <Link
              href="/introduccion"
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
      <section id="ruta" className="content-section route-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              EL CAMINO, PASO A PASO
            </div>
            <h2>Tu ruta de aprendizaje</h2>
            <p>Primero las bases. Después, las posibilidades.</p>
          </div>
          <span className="muted route-count">2 lecciones disponibles</span>
        </div>
        <div className="route-cards">
          <Link href="/" className="route-card current">
            <div className="route-card-top">
              <span className="route-icon">
                <Compass size={20} />
              </span>
              <span className="small-pill">Estás aquí</span>
            </div>
            <span className="route-number">01 / EL PUNTO DE PARTIDA</span>
            <h3>Bienvenida</h3>
            <p>Conoce la guía y descubre una nueva forma de aprender.</p>
            <div className="route-card-bottom">
              <span>
                <Clock3 size={12} /> 4 min
              </span>
              <ArrowRight size={17} />
            </div>
          </Link>
          <Link href="/introduccion" className="route-card">
            <div className="route-card-top">
              <span className="route-icon blue">
                <Braces size={20} />
              </span>
              <span className="small-pill neutral">Disponible</span>
            </div>
            <span className="route-number">02 / ENTENDER EL LENGUAJE</span>
            <h3>Introducción a C++</h3>
            <p>Qué es C++ y cómo se conecta con el mundo de Unreal.</p>
            <div className="route-card-bottom">
              <span>
                <Clock3 size={12} /> 8 min
              </span>
              <ArrowRight size={17} />
            </div>
          </Link>
          <div className="route-card future-card">
            <div className="route-card-top">
              <span className="route-icon">
                <Layers3 size={20} />
              </span>
              <span className="small-pill neutral">Próximamente</span>
            </div>
            <span className="route-number">03 / CONSTRUIR LAS BASES</span>
            <h3>Fundamentos de C++</h3>
            <p>Variables, decisiones y funciones. Las piezas de tu juego.</p>
            <div className="route-card-bottom">
              <span>El siguiente capítulo</span>
              <span className="future-dot" />
            </div>
          </div>
        </div>
      </section>
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
        <Link href="/introduccion" className="next-lesson">
          <span>
            <small>SIGUIENTE LECCIÓN</small>Introducción a C++
          </span>
          <ArrowUpRight size={22} />
        </Link>
      </div>
    </>
  );
}
