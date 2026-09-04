'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  CircleHelp,
  Code2,
  Eye,
  ImageIcon,
  Lightbulb,
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
  inspectVariableName,
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

function NameInspector() {
  const [type, setType] = useState<FormatType>('bool');
  const [style, setStyle] = useState<NamingStyle>('unreal');
  const [name, setName] = useState('bIsEnoughMoney');
  const check = inspectVariableName(name, type, style);
  const suggestion = suggestVariableName(name, type, style);
  const rows = [
    {
      pass: check.portable,
      text: 'Empieza con letra o _ y solo usa letras, números o _.',
    },
    { pass: !check.isKeyword, text: 'No es una palabra reservada de C++.' },
    {
      pass: check.styleMatches,
      text:
        style === 'unreal'
          ? type === 'bool'
            ? 'Sigue la forma bHasEnoughMoney de Unreal.'
            : 'Sigue PascalCase, la convención de Unreal.'
          : 'Sigue camelCase, la convención elegida para este ejemplo.',
    },
  ];
  return (
    <div className="fmt-name-lab">
      <div className="fmt-name-inputs">
        <label htmlFor="fmt-exact-name">
          Prueba un nombre exacto
          <Input
            id="fmt-exact-name"
            value={name}
            maxLength={40}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label htmlFor="fmt-name-type">
          Tipo
          <select
            id="fmt-name-type"
            value={type}
            onChange={(event) => setType(event.target.value as FormatType)}
          >
            {formatTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="fmt-name-style">
          Convención
          <select
            id="fmt-name-style"
            value={style}
            onChange={(event) => setStyle(event.target.value as NamingStyle)}
          >
            <option value="general">C++ frecuente</option>
            <option value="unreal">Epic / Unreal</option>
          </select>
        </label>
      </div>
      <div
        className={`fmt-name-result ${check.compiles ? 'is-valid' : 'is-invalid'}`}
      >
        <span>
          {check.compiles ? <CheckCircle2 size={18} /> : <X size={18} />}
          {check.compiles
            ? 'Identificador válido'
            : 'El compilador rechazará este nombre'}
        </span>
        <code>
          {formatTypes.find((item) => item.id === type)!.label} {name || '…'};
        </code>
      </div>
      <ul>
        {rows.map((row) => (
          <li key={row.text} className={row.pass ? 'is-pass' : 'is-fail'}>
            {row.pass ? <Check size={15} /> : <X size={15} />}
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
      {check.compiles && !check.styleMatches && (
        <button
          type="button"
          className="fmt-suggestion"
          onClick={() => setName(suggestion)}
        >
          <Lightbulb size={15} /> Usar sugerencia: <code>{suggestion}</code>
        </button>
      )}
    </div>
  );
}

const reviewPoints = {
  variables: {
    label: 'Líneas 13–17',
    title: 'Las variables no tienen valor inicial',
    text: 'Las cinco declaraciones son válidas, pero bool, float e int locales no reciben automáticamente cero o false. Inicializarlas permite razonar sobre su primer estado.',
  },
  names: {
    label: 'Nombres',
    title: 'La convención de Unreal está presente',
    text: 'bIsEnoughMoney usa el prefijo b para bool. Cost, Coins, Bills1 y Bills2 empiezan en mayúscula. Los números son válidos al final, aunque nombres como FirstBillValue explican mejor el propósito.',
  },
  functions: {
    label: 'Líneas 3–9',
    title: 'Declaración y definición coinciden',
    text: 'int SayHello(); anuncia la función. La definición repite int SayHello() y añade el cuerpo. Como la definición aparece justo después, el anuncio separado no era necesario en este archivo, pero es válido.',
  },
  return: {
    label: 'Líneas 19–21',
    title: 'return termina main',
    text: 'return SayHello(); llama a la función, recibe 1 y termina main con ese código. Por convención, 0 señala éxito y un valor distinto de 0 comunica un problema. La instrucción std::cout posterior nunca puede ejecutarse.',
  },
} as const;
type ReviewPoint = keyof typeof reviewPoints;

function ScreenshotReview() {
  const [active, setActive] = useState<ReviewPoint>('variables');
  const point = reviewPoints[active];
  return (
    <div className="fmt-review">
      <div className="fmt-review-visual">
        <figure>
          <Image
            src="/course/format-variables-reference.png"
            width="311"
            height="355"
            alt="Captura de Visual Studio con SayHello y cinco variables declaradas dentro de main"
          />
          <figcaption>Captura compartida para esta actividad</figcaption>
        </figure>
        <div className="fmt-review-buttons" aria-label="Puntos para revisar">
          {Object.entries(reviewPoints).map(([id, item]) => (
            <button
              type="button"
              key={id}
              aria-pressed={active === id}
              onClick={() => setActive(id as ReviewPoint)}
            >
              <span>{item.label}</span>
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div className="fmt-review-explanation" aria-live="polite">
        <span>
          <Eye size={17} /> {point.label}
        </span>
        <h3>{point.title}</h3>
        <p>{point.text}</p>
        {active === 'variables' && (
          <pre>
            <code>
              {
                'bool bIsEnoughMoney = false;\nfloat Cost = 0.0f;\nfloat Coins = 0.0f;\nint FirstBillValue = 0;\nint SecondBillValue = 0;'
              }
            </code>
          </pre>
        )}
        {active === 'return' && (
          <Link href="/cpp/funciones-y-flujo-de-ejecucion">
            Continuar después con funciones <ArrowRight size={14} />
          </Link>
        )}
      </div>
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
          <a href="#captura">03 · Revisar la captura</a>
          <a href="#practicar">04 · Practicar</a>
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
        </section>
        <section
          id="nombres"
          className="fmt-section"
          aria-labelledby="fmt-names-title"
        >
          <div className="fmt-section-heading">
            <span>02</span>
            <div>
              <h2 id="fmt-names-title">Un nombre debe compilar y explicar</h2>
              <p>
                C++ decide qué identificadores son válidos. Tu equipo decide
                cómo escribirlos. Esta guía usa una convención frecuente de C++
                para comparar con la convención oficial de Epic.
              </p>
            </div>
          </div>
          <NameInspector />
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
        <section className="fmt-section" aria-labelledby="fmt-semicolon-title">
          <div className="fmt-section-heading">
            <span>
              <ListEnd size={22} />
            </span>
            <div>
              <h2 id="fmt-semicolon-title">
                El punto y coma termina la instrucción
              </h2>
              <p>
                El salto de línea organiza el código para nosotros. Comprueba
                cómo cambia la presentación sin cambiar las declaraciones.
              </p>
            </div>
          </div>
          <SemicolonLab />
        </section>
        <section
          id="captura"
          className="fmt-section"
          aria-labelledby="fmt-review-title"
        >
          <div className="fmt-section-heading">
            <span>03</span>
            <div>
              <h2 id="fmt-review-title">
                Leamos la captura como una revisión de código
              </h2>
              <p>
                Selecciona cada observación. Conservamos aquí lo relacionado con
                variables y dejamos el desarrollo completo de funciones para su
                propia actividad.
              </p>
            </div>
          </div>
          <ScreenshotReview />
        </section>
        <section className="fmt-section" aria-labelledby="fmt-scope-title">
          <div className="fmt-section-heading">
            <span>
              <ImageIcon size={21} />
            </span>
            <div>
              <h2 id="fmt-scope-title">¿Dónde existen estas variables?</h2>
              <p>
                En la captura están entre las llaves de <code>main</code>. Por
                eso son variables locales: solo pueden usarse dentro de esa
                función y su vida termina al salir de ella.
              </p>
            </div>
          </div>
          <div className="fmt-scope-diagram">
            <div className="fmt-file-room">
              <span>archivo CursoCPlusPlus.cpp</span>
              <div className="fmt-function-room">
                <span>función main()</span>
                <div className="fmt-local-room">
                  <code>bIsEnoughMoney</code>
                  <code>Cost</code>
                  <code>Coins</code>
                  <code>FirstBillValue</code>
                  <strong>Variables locales</strong>
                </div>
              </div>
            </div>
            <p>
              Esta es una vista conceptual del <strong>alcance</strong>, no un
              mapa real de memoria. Lo estudiaremos en detalle en “Alcance y
              tiempo de vida”.
            </p>
          </div>
        </section>
        <section
          id="practicar"
          className="fmt-section"
          aria-labelledby="fmt-practice-title"
        >
          <div className="fmt-section-heading">
            <span>04</span>
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
            Actividad adaptada del texto y de la captura compartidos. La
            preparación de Visual Studio pertenece a “Entorno y compilación”; la
            declaración, definición, llamada y retorno de funciones se
            desarrollarán en “Funciones y flujo de ejecución”.
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
