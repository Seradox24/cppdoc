'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CppCodeEditor } from './cpp-code-editor';
import { CompleteLesson, LearningShell } from './learning-shell';
import { getGroupLessons } from '@/lib/lessons';
import './cpp-foundations.css';

const lessonId = 'cpp-formato-de-variables';

const compactCode = [
  'bool bisjumping=true; float runspeed=600.0f; int lives=3;',
] as const;
const readableCode = [
  'bool bIsJumping = true;',
  'float RunSpeed = 600.0f;',
  'int RemainingLives = 3;',
] as const;

function ReadabilityLab() {
  const [readable, setReadable] = useState(true);
  return (
    <div className="foundation-lab">
      <div className="foundation-toolbar">
        <span>CharacterState.cpp</span>
        <div className="foundation-switch" aria-label="Presentación del código">
          <button
            type="button"
            aria-pressed={!readable}
            onClick={() => setReadable(false)}
          >
            Apelmazado
          </button>
          <button
            type="button"
            aria-pressed={readable}
            onClick={() => setReadable(true)}
          >
            Legible
          </button>
        </div>
      </div>
      <div className="foundation-lab-grid">
        <CppCodeEditor
          filename="CharacterState.cpp"
          lines={readable ? readableCode : compactCode}
        />
        <div className="foundation-explanation" aria-live="polite">
          <span>{readable ? 'FORMATO RECOMENDADO' : 'CUESTA RECORRERLO'}</span>
          <h3>
            {readable
              ? 'La vista permite encontrar cada dato'
              : 'El compilador puede entenderlo, pero nosotros tardamos más'}
          </h3>
          <p>
            {readable
              ? 'Una declaración por línea, espacios consistentes y nombres descriptivos forman un patrón fácil de revisar.'
              : 'Juntar instrucciones y recortar nombres es válido en algunos casos, pero oculta la intención y dificulta los cambios.'}
          </p>
        </div>
      </div>
    </div>
  );
}

const namingStyles = {
  general: {
    label: 'C++ frecuente',
    lines: [
      'bool isJumping = true;',
      'float runSpeed = 600.0f;',
      'int remainingLives = 3;',
    ],
    text: 'Muchos equipos usan camelCase para variables. Es una decisión del proyecto, no una regla de C++.',
  },
  unreal: {
    label: 'Epic / Unreal',
    lines: [
      'bool bIsJumping = true;',
      'float RunSpeed = 600.0f;',
      'int RemainingLives = 3;',
    ],
    text: 'Epic usa PascalCase y reserva el prefijo b para los booleanos. También pide nombres en inglés.',
  },
} as const;
type NamingStyle = keyof typeof namingStyles;

function NamingConventionLab() {
  const [style, setStyle] = useState<NamingStyle>('unreal');
  const current = namingStyles[style];
  return (
    <div className="foundation-lab">
      <div className="foundation-toolbar">
        <span>El significado no cambia; la convención sí</span>
        <div className="foundation-switch" aria-label="Convención de nombres">
          {Object.entries(namingStyles).map(([id, item]) => (
            <button
              type="button"
              key={id}
              aria-pressed={style === id}
              onClick={() => setStyle(id as NamingStyle)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="foundation-lab-grid">
        <CppCodeEditor filename="NamingStyle.cpp" lines={current.lines} />
        <div className="foundation-explanation" aria-live="polite">
          <span>CONVENCIÓN ACTIVA</span>
          <h3>{current.label}</h3>
          <p>{current.text}</p>
          <p className="foundation-small-note">
            Sigue la convención del proyecto que estés leyendo. La consistencia
            permite reconocer nombres sin detenerse en cada línea.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormattingChecklist() {
  const [names, setNames] = useState(true);
  const [spaces, setSpaces] = useState(true);
  const [lines, setLines] = useState(true);
  const declarations = [
    `bool ${names ? 'bIsMenuOpen' : 'b'}${spaces ? ' = ' : '='}false;`,
    `float ${names ? 'MusicVolume' : 'v'}${spaces ? ' = ' : '='}0.8f;`,
    `int ${names ? 'SelectedSlot' : 'n'}${spaces ? ' = ' : '='}2;`,
  ];
  return (
    <div className="foundation-builder">
      <div className="foundation-checks">
        <label>
          <input
            type="checkbox"
            aria-label="Activar nombres descriptivos"
            checked={names}
            onChange={(event) => setNames(event.target.checked)}
          />
          <span>
            <strong>Nombres descriptivos</strong>
            <small>Explican el dato sin buscar más contexto.</small>
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            aria-label="Activar espacios consistentes"
            checked={spaces}
            onChange={(event) => setSpaces(event.target.checked)}
          />
          <span>
            <strong>Espacios consistentes</strong>
            <small>Separan visualmente las partes de la instrucción.</small>
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            aria-label="Mostrar una declaración por línea"
            checked={lines}
            onChange={(event) => setLines(event.target.checked)}
          />
          <span>
            <strong>Una declaración por línea</strong>
            <small>Hace más sencilla la lectura y la revisión.</small>
          </span>
        </label>
      </div>
      <CppCodeEditor
        filename="InterfaceState.cpp"
        lines={lines ? declarations : [declarations.join(' ')]}
      />
    </div>
  );
}

const formatQuestions = [
  {
    prompt: '¿Qué nombre explica mejor su propósito?',
    choices: ['S', 'PlayerScore', 'Number1'],
    answer: 1,
    explanation:
      'PlayerScore cuenta qué representa el valor sin depender de otra explicación.',
  },
  {
    prompt: '¿Qué booleano sigue la convención de Epic?',
    choices: ['isMenuOpen', 'IsMenuOpen', 'bIsMenuOpen'],
    answer: 2,
    explanation: 'Epic usa PascalCase y el prefijo b para variables bool.',
  },
  {
    prompt: '¿Qué cambio mejora la lectura sin cambiar el resultado?',
    choices: [
      'Una declaración por línea.',
      'Quitar todos los espacios.',
      'Acortar todos los nombres.',
    ],
    answer: 0,
    explanation:
      'Separar las declaraciones permite localizarlas y modificarlas con menos esfuerzo.',
  },
] as const;

function FormatQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    formatQuestions.map(() => null),
  );
  const correct = formatQuestions.filter(
    (question, index) => answers[index] === question.answer,
  ).length;
  return (
    <div className="foundation-quiz">
      <div className="foundation-toolbar">
        <span>
          <CircleHelp size={17} /> Comprueba el criterio
        </span>
        <span>
          {correct} / {formatQuestions.length}
        </span>
      </div>
      <div className="foundation-question-list">
        {formatQuestions.map((question, questionIndex) => (
          <fieldset key={question.prompt}>
            <legend>
              <span>{String(questionIndex + 1).padStart(2, '0')}</span>
              {question.prompt}
            </legend>
            <div>
              {question.choices.map((choice, choiceIndex) => {
                const selected = answers[questionIndex] === choiceIndex;
                const isCorrect = choiceIndex === question.answer;
                return (
                  <label
                    key={choice}
                    className={
                      selected ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                    }
                  >
                    <input
                      type="radio"
                      name={`format-question-${questionIndex}`}
                      checked={selected}
                      onChange={() =>
                        setAnswers((previous) =>
                          previous.map((answer, index) =>
                            index === questionIndex ? choiceIndex : answer,
                          ),
                        )
                      }
                    />
                    <span>{choice}</span>
                    {selected &&
                      (isCorrect ? <Check size={15} /> : <X size={15} />)}
                  </label>
                );
              })}
            </div>
            {answers[questionIndex] !== null && (
              <p
                className={
                  answers[questionIndex] === question.answer
                    ? 'is-correct'
                    : 'is-wrong'
                }
              >
                {answers[questionIndex] === question.answer
                  ? 'Correcto. '
                  : 'Revisa la idea. '}
                {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="foundation-quiz-footer">
        <span>Esta actividad evalúa formato, no tipos ni operadores.</span>
        <Button
          variant="ghost"
          onClick={() => setAnswers(formatQuestions.map(() => null))}
        >
          <RotateCcw size={15} /> Reiniciar
        </Button>
      </div>
    </div>
  );
}

export function VariableFormatLesson() {
  const activities = getGroupLessons('cpp');
  const index = activities.findIndex((lesson) => lesson.id === lessonId);
  return (
    <LearningShell lesson={lessonId}>
      <article className="foundation-lesson format-topic">
        <div className="foundation-page-meta">
          <Link href="/cpp">
            <ArrowLeft size={14} /> C++ sin Unreal Engine
          </Link>
          <span>
            Actividad {String(index + 1).padStart(2, '0')} · 10–15 min
          </span>
        </div>
        <header className="foundation-hero">
          <span className="foundation-kicker">CÓDIGO FÁCIL DE RECORRER</span>
          <h1>
            Formato de variables<span>.</span>
          </h1>
          <p>
            Aquí no volvemos a estudiar los tipos ni cómo cambia un valor.
            Practicamos cómo presentar y nombrar variables para que el código se
            entienda con rapidez.
          </p>
        </header>
        <nav className="foundation-page-nav" aria-label="En esta lección">
          <a href="#legibilidad">01 · Legibilidad</a>
          <a href="#convenciones">02 · Convenciones</a>
          <a href="#criterio">03 · Criterio</a>
          <a href="#practicar">04 · Practicar</a>
        </nav>

        <section id="legibilidad" className="foundation-section">
          <div className="foundation-section-heading">
            <span>01</span>
            <div>
              <h2>El formato organiza lo que ya sabes</h2>
              <p>
                Compara las dos presentaciones. El contenido representa los
                mismos datos; cambia el esfuerzo necesario para leerlos.
              </p>
            </div>
          </div>
          <ReadabilityLab />
          <div className="foundation-rule-grid">
            <article>
              <span>01</span>
              <strong>Una instrucción por línea</strong>
              <p>Permite localizar cada cambio.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Espacios consistentes</strong>
              <p>Separan las partes sin añadir ruido.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Patrones repetibles</strong>
              <p>Ayudan a anticipar dónde mirar.</p>
            </article>
          </div>
        </section>

        <section id="convenciones" className="foundation-section">
          <div className="foundation-section-heading">
            <span>02</span>
            <div>
              <h2>Una convención mantiene el código consistente</h2>
              <p>
                C++ acepta distintas formas de nombrar. El proyecto elige una y
                todas las personas la siguen.
              </p>
            </div>
          </div>
          <NamingConventionLab />
        </section>

        <section id="criterio" className="foundation-section">
          <div className="foundation-section-heading">
            <span>03</span>
            <div>
              <h2>Aplica una regla cada vez</h2>
              <p>
                Activa y desactiva cada decisión para observar qué aporta al
                ejemplo. Ninguna opción intenta validar o compilar el código.
              </p>
            </div>
          </div>
          <FormattingChecklist />
        </section>

        <section id="practicar" className="foundation-section">
          <div className="foundation-section-heading">
            <span>04</span>
            <div>
              <h2>Elige la opción más legible</h2>
              <p>Concéntrate en nombres, espacios y distribución visual.</p>
            </div>
          </div>
          <FormatQuiz />
        </section>

        <div className="foundation-takeaway">
          <span className="foundation-kicker">QUÉDATE CON ESTA IDEA</span>
          <p>
            El formato no cambia el dato guardado. Reduce el tiempo que una
            persona necesita para comprender y modificar el código.
          </p>
        </div>
        <details className="foundation-references">
          <summary>Fuente y alcance de la actividad</summary>
          <p>
            Esta página conserva del material compartido solo las decisiones de
            legibilidad y nomenclatura. Las declaraciones se estudian en “Tipos
            de datos y variables”; las funciones y los operadores tienen sus
            propias actividades.
          </p>
          <a
            href="https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine"
            target="_blank"
            rel="noreferrer"
          >
            Epic: estándar de programación C++ para Unreal Engine
          </a>
        </details>
        <div className="foundation-complete">
          <div>
            <CheckCircle2 size={20} />
            <span>Ya puedes reconocer y aplicar un formato consistente.</span>
          </div>
          <CompleteLesson id={lessonId} />
        </div>
        <nav className="activity-pagination" aria-label="Actividades del grupo">
          <Link href={activities[index - 1].href}>
            <ArrowLeft size={18} />
            <span>
              <small>ACTIVIDAD ANTERIOR</small>
              <strong>{activities[index - 1].title}</strong>
            </span>
          </Link>
          <Link className="next-activity" href={activities[index + 1].href}>
            <span>
              <small>SIGUIENTE ACTIVIDAD</small>
              <strong>{activities[index + 1].title}</strong>
            </span>
            <ArrowRight size={18} />
          </Link>
        </nav>
      </article>
    </LearningShell>
  );
}
