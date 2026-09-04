'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  CircleHelp,
  Code2,
  ListEnd,
  RotateCcw,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompleteLesson, LearningShell } from './learning-shell';
import {
  buildDeclaration,
  formatTypes,
  suggestVariableName,
  type FormatType,
  type NamingStyle,
} from '@/lib/variable-format';
import { getGroupLessons } from '@/lib/lessons';
import './variable-format-lesson.css';

const lessonId = 'cpp-formato-de-variables';

function DeclarationLab() {
  const [selected, setSelected] = useState<FormatType>('bool');
  const [style, setStyle] = useState<NamingStyle>('unreal');
  const [concepts, setConcepts] = useState<Record<FormatType, string>>(
    Object.fromEntries(
      formatTypes.map((item) => [item.id, item.concept]),
    ) as Record<FormatType, string>,
  );
  const [initialize, setInitialize] = useState(true);
  const type = formatTypes.find((item) => item.id === selected)!;
  const concept = concepts[selected];
  const name = suggestVariableName(concept, selected, style);
  const declaration = buildDeclaration({ type: selected, name, initialize });

  return (
    <div className="fmt-lab">
      <div className="fmt-lab-title">
        <span>
          <Braces size={18} /> Constructor de declaraciones
        </span>
        <span className="fmt-live">Actualización en vivo</span>
      </div>
      <div className="fmt-lab-grid">
        <div className="fmt-controls">
          <fieldset className="fmt-choice-group">
            <legend>1. Elige el tipo</legend>
            <div>
              {formatTypes.map((item) => (
                <label
                  key={item.id}
                  aria-label={`Tipo ${item.label}`}
                  className={selected === item.id ? 'is-selected' : ''}
                >
                  <input
                    type="radio"
                    name="format-type"
                    value={item.id}
                    checked={selected === item.id}
                    onChange={() => setSelected(item.id)}
                  />
                  <code>{item.label}</code>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="fmt-field" htmlFor="fmt-concept">
            <span>
              2. Describe el dato{' '}
              <small>Usa palabras sencillas en inglés</small>
            </span>
            <Input
              id="fmt-concept"
              value={concept}
              maxLength={36}
              onChange={(event) =>
                setConcepts((previous) => ({
                  ...previous,
                  [selected]: event.target.value,
                }))
              }
            />
          </label>
          <fieldset className="fmt-style">
            <legend>3. Elige una convención</legend>
            <button
              type="button"
              aria-pressed={style === 'general'}
              onClick={() => setStyle('general')}
            >
              <strong>C++ frecuente</strong>
              <code>camelCase</code>
            </button>
            <button
              type="button"
              aria-pressed={style === 'unreal'}
              onClick={() => setStyle('unreal')}
            >
              <strong>Epic / Unreal</strong>
              <code>PascalCase · bBool</code>
            </button>
          </fieldset>
          <label className="fmt-initialize" aria-label="Dar un valor inicial">
            <input
              type="checkbox"
              checked={initialize}
              onChange={(event) => setInitialize(event.target.checked)}
            />
            <span>
              <strong>Dar un valor inicial</strong>
              <small>
                {initialize
                  ? `Comienza con ${type.literal}`
                  : 'Solo escribe la declaración'}
              </small>
            </span>
          </label>
        </div>
        <div className="fmt-result">
          <span className="fmt-kicker">RESULTADO</span>
          <pre>
            <code>{declaration}</code>
          </pre>
          <div className="fmt-memory-card">
            <div>
              <span>TIPO</span>
              <code>{type.label}</code>
            </div>
            <div>
              <span>NOMBRE</span>
              <code>{name}</code>
            </div>
            <div
              className={
                initialize || selected === 'string' ? 'is-safe' : 'is-warning'
              }
            >
              <span>ESTADO INICIAL</span>
              <strong>
                {initialize
                  ? type.literal
                  : selected === 'string'
                    ? 'cadena vacía'
                    : 'sin valor seguro'}
              </strong>
            </div>
          </div>
          {!initialize && selected !== 'string' && (
            <p className="fmt-warning">
              <TriangleAlert size={17} /> Una variable local de este tipo no
              empieza automáticamente en cero. Asígnale un valor antes de
              leerla.
            </p>
          )}
          {!initialize && selected === 'string' && (
            <p className="fmt-safe">
              <CheckCircle2 size={17} /> <code>std::string</code> construye una
              cadena vacía incluso sin escribir un valor explícito.
            </p>
          )}
          <p className="fmt-result-note">
            La convención cambia el nombre para las personas; la sintaxis es lo
            que entiende el compilador.
          </p>
        </div>
      </div>
      <div className="fmt-anatomy" aria-label="Partes de la declaración">
        <div>
          <code>{type.label}</code>
          <span>Tipo</span>
        </div>
        <b>+</b>
        <div>
          <code>{name}</code>
          <span>Nombre</span>
        </div>
        {initialize && (
          <>
            <b>+</b>
            <div>
              <code>= {type.literal}</code>
              <span>Inicializador</span>
            </div>
          </>
        )}
        <b>+</b>
        <div>
          <code>;</code>
          <span>Fin</span>
        </div>
      </div>
    </div>
  );
}

const tokenPattern =
  /(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:std::string|bool|int|float|double|char)\b|\b(?:true|false|\d+(?:\.\d+)?f?)\b|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*(?:=|;)))/g;

function highlightCode(line: string) {
  return line.split(tokenPattern).map((token, index) => {
    let className = 'fmt-token-plain';
    if (token.startsWith('//')) className = 'fmt-token-comment';
    else if (/^(std::string|bool|int|float|double|char)$/.test(token))
      className = 'fmt-token-type';
    else if (/^(true|false|\d|"|')/.test(token)) className = 'fmt-token-value';
    else if (/^[A-Za-z_]/.test(token)) className = 'fmt-token-name';
    return (
      <span className={className} key={`${token}-${index}`}>
        {token}
      </span>
    );
  });
}

function CodeEditor({
  filename,
  lines,
  activeLine,
}: {
  filename: string;
  lines: readonly string[];
  activeLine?: number;
}) {
  return (
    <div className="fmt-editor">
      <div className="fmt-editor-bar">
        <span className="fmt-editor-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>{filename}</code>
      </div>
      <ol aria-label={`Código de ${filename}`}>
        {lines.map((line, index) => (
          <li
            className={activeLine === index + 1 ? 'is-active' : ''}
            key={`${line}-${index}`}
          >
            <span className="fmt-line-number" aria-hidden="true">
              {index + 1}
            </span>
            <code>{line ? highlightCode(line) : '\u00a0'}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}

const namingLines = [
  '// 1. Tipo + nombre descriptivo + valor inicial',
  'int PlayerScore = 0;',
  'float MaxWalkSpeed = 600.0f;',
  '',
  '// 2. Un bool responde sí/no y usa el prefijo b',
  'bool bCanJump = true;',
  '',
  '// 3. Una variable por línea',
  "char DifficultyRank = 'A';",
  'std::string PlayerName = "Ada";',
] as const;

function NamingGuide() {
  return (
    <div className="fmt-code-lesson">
      <CodeEditor filename="NamingExamples.cpp" lines={namingLines} />
      <ol className="fmt-code-order">
        <li>
          <span>01</span>
          <div>
            <strong>Cuenta qué guarda</strong>
            <p>
              <code>PlayerScore</code> explica mejor el dato que{' '}
              <code>Number</code> o <code>Value1</code>.
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>Formula los booleanos como una respuesta</strong>
            <p>
              <code>bCanJump</code> se lee como “¿puede saltar?” y su valor solo
              puede ser <code>true</code> o <code>false</code>.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <strong>Deja una declaración por línea</strong>
            <p>
              Así puedes localizar el tipo, el nombre y el valor inicial sin
              recorrer una línea larga.
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}

const exampleGroups = {
  character: {
    label: 'Personaje',
    filename: 'CharacterState.cpp',
    title: 'Estado de un personaje',
    text: 'Tres preguntas distintas: cuánta salud tiene, cuánto modifica su daño y si puede recibir daño.',
    lines: [
      'int MaxHealth = 100;',
      'float DamageMultiplier = 1.25f;',
      'bool bIsInvincible = false;',
    ],
  },
  inventory: {
    label: 'Inventario',
    filename: 'InventoryState.cpp',
    title: 'Datos de un inventario',
    text: 'El tipo cambia según lo que representa el dato: cantidad, peso con decimales o una ranura identificada por una letra.',
    lines: [
      'int SmallPotionCount = 3;',
      'double TotalWeight = 14.75;',
      "char SelectedSlot = 'B';",
    ],
  },
  interface: {
    label: 'Interfaz',
    filename: 'InterfaceState.cpp',
    title: 'Estado de la interfaz',
    text: 'También puedes describir texto, decisiones de encendido o apagado y valores decimales como el volumen.',
    lines: [
      'std::string PlayerTitle = "Explorer";',
      'bool bIsMenuOpen = true;',
      'float MusicVolume = 0.8f;',
    ],
  },
} as const;
type ExampleGroup = keyof typeof exampleGroups;

function ExampleGallery() {
  const [active, setActive] = useState<ExampleGroup>('character');
  const example = exampleGroups[active];
  return (
    <div className="fmt-examples">
      <div className="fmt-example-tabs" aria-label="Grupos de ejemplos">
        {Object.entries(exampleGroups).map(([id, item]) => (
          <button
            key={id}
            type="button"
            aria-pressed={active === id}
            onClick={() => setActive(id as ExampleGroup)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="fmt-example-grid">
        <CodeEditor filename={example.filename} lines={example.lines} />
        <div className="fmt-example-note" aria-live="polite">
          <span>EJEMPLO ACTIVO</span>
          <h3>{example.title}</h3>
          <p>{example.text}</p>
          <div className="fmt-code-legend" aria-label="Colores del código">
            <span>
              <i className="is-type" /> Tipo
            </span>
            <span>
              <i className="is-name" /> Nombre
            </span>
            <span>
              <i className="is-value" /> Valor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const scopeLines = [
  'int main()',
  '{',
  '    int PlayerScore = 10;',
  '    {',
  '        bool bHasBonus = true;',
  '    } // bHasBonus termina aquí',
  '    std::cout << PlayerScore;',
  '} // PlayerScore termina aquí',
] as const;

const scopeSteps = [
  {
    line: 3,
    label: 'Entramos en main',
    text: 'PlayerScore nace al ejecutar su declaración y puede usarse desde aquí hasta la llave que cierra main.',
    variables: ['PlayerScore'],
  },
  {
    line: 5,
    label: 'Entramos en el bloque interior',
    text: 'bHasBonus nace dentro de este bloque. Aquí puedes usarla junto con PlayerScore, que viene del bloque exterior.',
    variables: ['PlayerScore', 'bHasBonus'],
  },
  {
    line: 6,
    label: 'Salimos del bloque interior',
    text: 'La llave cierra el alcance de bHasBonus. PlayerScore sigue disponible porque main aún no ha terminado.',
    variables: ['PlayerScore'],
  },
  {
    line: 8,
    label: 'Salimos de main',
    text: 'La última llave cierra el alcance de PlayerScore. Fuera de la función ya no existe ninguna de las dos variables locales.',
    variables: [],
  },
] as const;

function ScopeLab() {
  const [step, setStep] = useState(0);
  const current = scopeSteps[step];
  return (
    <div className="fmt-scope-lab">
      <div className="fmt-scope-controls" aria-label="Pasos del alcance">
        {scopeSteps.map((item, index) => (
          <button
            type="button"
            key={item.label}
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            Paso {index + 1}
          </button>
        ))}
      </div>
      <div className="fmt-scope-grid">
        <CodeEditor
          filename="Scope.cpp"
          lines={scopeLines}
          activeLine={current.line}
        />
        <div className="fmt-scope-state" aria-live="polite">
          <span>
            PASO {step + 1} · LÍNEA {current.line}
          </span>
          <h3>{current.label}</h3>
          <p>{current.text}</p>
          <strong>Variables disponibles ahora</strong>
          <div>
            {current.variables.length > 0 ? (
              current.variables.map((variable) => (
                <code key={variable}>{variable}</code>
              ))
            ) : (
              <em>Ninguna variable local</em>
            )}
          </div>
        </div>
      </div>
      <p className="fmt-scope-caption">
        Una variable del bloque exterior puede usarse dentro del bloque
        interior. Una variable creada dentro no puede escapar de sus llaves.
        Este ejemplo muestra su <strong>alcance</strong> y su tiempo de vida de
        forma simplificada.
      </p>
    </div>
  );
}

function SemicolonLab() {
  const [multiline, setMultiline] = useState(true);
  const code = multiline
    ? 'int FirstBillValue = 5;\nint SecondBillValue = 10;\nbool bHasCash = true;'
    : 'int FirstBillValue = 5; int SecondBillValue = 10; bool bHasCash = true;';
  return (
    <div className="fmt-semicolon">
      <div>
        <span className="fmt-kicker">MISMAS INSTRUCCIONES</span>
        <h3>
          Las líneas ayudan a las personas; <code>;</code> separa las
          instrucciones
        </h3>
        <p>
          Para el compilador, estas dos presentaciones expresan lo mismo.
          Separar una variable por línea permite leerla, comentarla y
          modificarla con menos errores.
        </p>
        <div>
          <Button
            variant={multiline ? 'default' : 'outline'}
            onClick={() => setMultiline(true)}
          >
            Una por línea
          </Button>
          <Button
            variant={!multiline ? 'default' : 'outline'}
            onClick={() => setMultiline(false)}
          >
            Todo seguido
          </Button>
        </div>
      </div>
      <pre aria-live="polite">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const questions = [
  {
    prompt: '¿Cuál es una declaración válida y clara para un entero?',
    choices: ['int Bills2 = 10;', 'int 2Bills = 10;', 'int Bills-2 = 10;'],
    answer: 0,
    explanation:
      'Bills2 empieza con letra y el número aparece después. El guion se interpreta como una resta y un identificador no puede empezar con un número.',
  },
  {
    prompt:
      'Dentro de main aparece int Coins; y se lee inmediatamente. ¿Qué sabemos de su valor?',
    choices: [
      'Siempre es 0.',
      'No tiene un valor inicial seguro.',
      'Siempre es 1.',
    ],
    answer: 1,
    explanation:
      'Un int local sin inicializador no empieza automáticamente en cero. Inicialízalo, por ejemplo con int Coins = 0;, antes de leerlo.',
  },
  {
    prompt: '¿Qué nombre sigue la convención de Epic para una variable bool?',
    choices: ['IsEnoughMoney', 'is_enough_money', 'bIsEnoughMoney'],
    answer: 2,
    explanation:
      'Epic usa PascalCase para los nombres y exige el prefijo b para las variables booleanas.',
  },
  {
    prompt:
      '¿Qué marca el final de una declaración simple como float Cost = 0.0f;?',
    choices: ['El salto de línea.', 'El punto y coma.', 'La letra f.'],
    answer: 1,
    explanation:
      'El punto y coma termina la declaración. La letra f indica que 0.0f es un literal float; el salto de línea solo mejora la lectura.',
  },
] as const;

function FormatQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions.map(() => null),
  );
  const correct = questions.filter(
    (question, index) => answers[index] === question.answer,
  ).length;
  return (
    <div className="fmt-quiz">
      <div className="fmt-lab-title">
        <span>
          <CircleHelp size={18} /> Comprueba lo aprendido
        </span>
        <span>
          {correct} / {questions.length} correctas
        </span>
      </div>
      <div className="fmt-question-list">
        {questions.map((question, questionIndex) => (
          <fieldset key={question.prompt}>
            <legend>
              <span>{String(questionIndex + 1).padStart(2, '0')}</span>
              {question.prompt}
            </legend>
            <div>
              {question.choices.map((choice, choiceIndex) => {
                const chosen = answers[questionIndex] === choiceIndex;
                const isCorrect = choiceIndex === question.answer;
                return (
                  <label
                    key={choice}
                    className={
                      chosen ? (isCorrect ? 'is-correct' : 'is-wrong') : ''
                    }
                  >
                    <input
                      type="radio"
                      name={`format-question-${questionIndex}`}
                      checked={chosen}
                      onChange={() =>
                        setAnswers((previous) =>
                          previous.map((value, index) =>
                            index === questionIndex ? choiceIndex : value,
                          ),
                        )
                      }
                    />
                    <code>{choice}</code>
                    {chosen &&
                      (isCorrect ? <Check size={16} /> : <X size={16} />)}
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
                aria-live="polite"
              >
                <strong>
                  {answers[questionIndex] === question.answer
                    ? 'Correcto.'
                    : 'Prueba otra vez.'}
                </strong>{' '}
                {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="fmt-quiz-footer">
        <span>
          {correct === questions.length
            ? 'Has resuelto las cuatro.'
            : 'Puedes cambiar cualquier respuesta.'}
        </span>
        <Button
          variant="ghost"
          onClick={() => setAnswers(questions.map(() => null))}
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
      <article className="format-lesson">
        <div className="fmt-page-meta">
          <Link href="/cpp">
            <ArrowLeft size={14} /> C++ sin Unreal Engine
          </Link>
          <span>
            Actividad {String(index + 1).padStart(2, '0')} · 20–25 min
          </span>
        </div>
        <header className="fmt-hero">
          <span className="fmt-kicker">CÓDIGO QUE SE PUEDE LEER</span>
          <h1>
            Formato de variables<span>.</span>
          </h1>
          <p>
            Aprende a declarar una variable, elegir un nombre claro y distinguir
            las reglas de C++ de las convenciones que encontrarás en Unreal
            Engine.
          </p>
        </header>
        <nav className="fmt-page-nav" aria-label="En esta lección">
          <a href="#declaracion">01 · Declaración</a>
          <a href="#nombres">02 · Nombres</a>
          <a href="#ejemplos">03 · Ejemplos</a>
          <a href="#alcance">04 · Alcance</a>
          <a href="#practicar">05 · Practicar</a>
        </nav>
        <section
          id="declaracion"
          className="fmt-section"
          aria-labelledby="fmt-declaration-title"
        >
          <div className="fmt-section-heading">
            <span>01</span>
            <div>
              <h2 id="fmt-declaration-title">Construye una declaración</h2>
              <p>
                El compilador necesita un <strong>tipo</strong>, un{' '}
                <strong>nombre</strong> válido y un{' '}
                <strong>punto y coma</strong>. Dar un valor inicial evita
                estados desconocidos y deja clara tu intención.
              </p>
            </div>
          </div>
          <DeclarationLab />
          <div className="fmt-technical-note">
            <Code2 size={20} />
            <div>
              <strong>Una precisión útil</strong>
              <p>
                En una conversación inicial solemos decir “declarar” para{' '}
                <code>int Coins;</code>. Técnicamente, esa línea declara y
                también define la variable local: crea el objeto.{' '}
                <code>int Coins = 0;</code> además lo inicializa. Una
                declaración sin definición sería, por ejemplo,{' '}
                <code>extern int Coins;</code>; la veremos más adelante.
              </p>
            </div>
          </div>
          <div className="fmt-subsection" aria-labelledby="fmt-semicolon-title">
            <div className="fmt-subsection-heading">
              <ListEnd size={20} />
              <div>
                <h3 id="fmt-semicolon-title">
                  El punto y coma termina la instrucción
                </h3>
                <p>
                  El salto de línea organiza el código para nosotros. Comprueba
                  cómo cambia la presentación sin cambiar las declaraciones.
                </p>
              </div>
            </div>
            <SemicolonLab />
          </div>
        </section>
        <section
          id="nombres"
          className="fmt-section"
          aria-labelledby="fmt-names-title"
        >
          <div className="fmt-section-heading">
            <span>02</span>
            <div>
              <h2 id="fmt-names-title">Nombres que explican el dato</h2>
              <p>
                Lee los ejemplos en orden. El nombre describe el propósito; la
                forma de escribirlo sigue una convención acordada por el equipo.
              </p>
            </div>
          </div>
          <NamingGuide />
          <div className="fmt-convention-grid">
            <div>
              <span>C++ · EJEMPLO FRECUENTE</span>
              <code>bool hasEnoughMoney = false;</code>
              <p>
                <strong>camelCase</strong>: primera palabra en minúscula. Es una
                convención habitual, no una regla del lenguaje.
              </p>
            </div>
            <div>
              <span>EPIC / UNREAL ENGINE</span>
              <code>bool bHasEnoughMoney = false;</code>
              <p>
                <strong>PascalCase</strong> y prefijo <code>b</code> en los
                booleanos. Epic también pide nombres y comentarios en inglés
                estadounidense.
              </p>
            </div>
          </div>
        </section>
        <section
          id="ejemplos"
          className="fmt-section"
          aria-labelledby="fmt-examples-title"
        >
          <div className="fmt-section-heading">
            <span>03</span>
            <div>
              <h2 id="fmt-examples-title">El mismo formato en otros datos</h2>
              <p>
                Cambia de contexto y observa cómo cada declaración conserva el
                orden: tipo, nombre descriptivo, valor inicial y punto y coma.
              </p>
            </div>
          </div>
          <ExampleGallery />
        </section>
        <section
          id="alcance"
          className="fmt-section"
          aria-labelledby="fmt-scope-title"
        >
          <div className="fmt-section-heading">
            <span>04</span>
            <div>
              <h2 id="fmt-scope-title">¿Dónde existen estas variables?</h2>
              <p>
                Las llaves crean bloques. Recorre el código para ver qué
                variables están disponibles en cada punto y cuándo dejan de
                existir.
              </p>
            </div>
          </div>
          <ScopeLab />
        </section>
        <section
          id="practicar"
          className="fmt-section"
          aria-labelledby="fmt-practice-title"
        >
          <div className="fmt-section-heading">
            <span>05</span>
            <div>
              <h2 id="fmt-practice-title">
                Practica las decisiones de formato
              </h2>
              <p>
                Comprueba qué pertenece a la sintaxis, qué pertenece a una
                convención y qué riesgos aparecen al omitir el valor inicial.
              </p>
            </div>
          </div>
          <FormatQuiz />
        </section>
        <div className="fmt-takeaway">
          <span className="fmt-kicker">QUÉDATE CON ESTA IDEA</span>
          <p>
            <strong>El compilador exige sintaxis válida.</strong> Las
            convenciones hacen que otras personas entiendan el propósito. Un
            buen nombre y un valor inicial convierten una declaración correcta
            en código más fácil de mantener.
          </p>
        </div>
        <details className="fmt-references">
          <summary>Fuente, correcciones y referencias</summary>
          <p>
            Actividad adaptada del texto compartido. La preparación de Visual
            Studio pertenece a “Entorno y compilación”; la declaración,
            definición, llamada y retorno de funciones se desarrollarán en
            “Funciones y flujo de ejecución”.
          </p>
          <ul>
            <li>
              <a
                href="https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine"
                target="_blank"
                rel="noreferrer"
              >
                Epic: estándar de programación C++ para Unreal Engine
              </a>
            </li>
            <li>
              <a
                href="https://eel.is/c++draft/basic.def"
                target="_blank"
                rel="noreferrer"
              >
                Borrador del estándar C++: declaraciones
              </a>
            </li>
          </ul>
        </details>
        <div className="fmt-complete">
          <div>
            <CheckCircle2 size={20} />
            <span>
              Ya puedes declarar, inicializar y nombrar variables con una
              convención consciente.
            </span>
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
              <small>SIGUIENTE ACTIVIDAD · PENDIENTE</small>
              <strong>{activities[index + 1].title}</strong>
            </span>
            <ArrowRight size={18} />
          </Link>
        </nav>
      </article>
    </LearningShell>
  );
}
