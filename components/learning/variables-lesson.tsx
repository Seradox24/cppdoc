'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Coins,
  Copy,
  Lightbulb,
  Play,
  RotateCcw,
  Terminal,
  TriangleAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CompleteLesson, LearningShell } from './learning-shell';
import {
  createVariableExample,
  dataTypes as types,
  defaultLabValues,
  type DataType,
  type LabValues,
  type VariableExample,
} from '@/lib/variables-lab';
import { getGroupLessons } from '@/lib/lessons';
import './variables-lesson.css';

const lessonId = 'cpp-tipos-de-datos-y-variables';
type ChangeLabValue = <K extends keyof LabValues>(
  key: K,
  value: LabValues[K],
) => void;

function TypeExplorer({
  selected,
  values,
  onSelect: setSelected,
  onChange,
  example,
}: {
  selected: DataType;
  values: LabValues;
  onSelect: (type: DataType) => void;
  onChange: ChangeLabValue;
  example: VariableExample;
}) {
  const {
    int: coins,
    float: speed,
    double: distance,
    bool: hasCard,
    char: initial,
    string: name,
  } = values;
  const setCoins = (value: number) => onChange('int', value);
  const setSpeed = (value: number) => onChange('float', value);
  const setDistance = (value: number) => onChange('double', value);
  const setHasCard = (value: boolean) => onChange('bool', value);
  const setInitial = (value: string) => onChange('char', value);
  const setName = (value: string) => onChange('string', value);
  const { type, literal, displayed } = example;

  return (
    <div className="var-lab">
      <div className="var-lab-bar">
        <span>
          <Coins size={17} /> Laboratorio de variables
        </span>
        <span className="var-live-dot">En vivo</span>
      </div>
      <fieldset className="var-types">
        <legend className="sr-only">Elige un tipo de dato</legend>
        {types.map((item) => (
          <label
            key={item.id}
            className={`var-type-option ${selected === item.id ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name="data-type"
              value={item.id}
              checked={selected === item.id}
              onChange={() => setSelected(item.id)}
            />
            <code>{item.label}</code>
            <span>{item.category}</span>
          </label>
        ))}
      </fieldset>
      <div className="var-explorer-grid">
        <div className="var-control-panel">
          <div className="var-mini-label">PRUEBA UN VALOR</div>
          <h3>{type.category}</h3>
          <p>{type.description}</p>
          <div className="var-controls">
            {selected === 'int' && (
              <>
                <div className="var-control-label">
                  Cantidad de monedas <output>{coins}</output>
                </div>
                <Slider
                  value={[coins]}
                  onValueChange={(v) => setCoins(Array.isArray(v) ? v[0] : v)}
                  min={0}
                  max={24}
                  step={1}
                  thumbLabel="Cantidad de monedas"
                />
                <div className="var-range-labels">
                  <span>0 monedas</span>
                  <span>24 monedas</span>
                </div>
              </>
            )}
            {selected === 'float' && (
              <>
                <div className="var-control-label">
                  Velocidad <output>{speed.toFixed(1)} m/s</output>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={(v) => setSpeed(Array.isArray(v) ? v[0] : v)}
                  min={0}
                  max={10}
                  step={0.1}
                  thumbLabel="Velocidad en metros por segundo"
                />
                <div className="var-range-labels">
                  <span>0.0 m/s</span>
                  <span>10.0 m/s</span>
                </div>
              </>
            )}
            {selected === 'double' && (
              <>
                <div className="var-control-label">
                  Distancia <output>{distance.toFixed(2)} m</output>
                </div>
                <Slider
                  value={[distance]}
                  onValueChange={(v) =>
                    setDistance(Array.isArray(v) ? v[0] : v)
                  }
                  min={0}
                  max={25}
                  step={0.25}
                  thumbLabel="Distancia en metros"
                />
                <div className="var-range-labels">
                  <span>0.00 m</span>
                  <span>25.00 m</span>
                </div>
              </>
            )}
            {selected === 'bool' && (
              <label className="var-checkbox">
                <input
                  type="checkbox"
                  checked={hasCard}
                  onChange={(event) => setHasCard(event.target.checked)}
                />
                <span>Hay una tarjeta en la cartera</span>
              </label>
            )}
            {selected === 'char' && (
              <label className="var-input-label">
                Elige una inicial
                <select
                  value={initial}
                  onChange={(event) => setInitial(event.target.value)}
                >
                  {['A', 'B', 'C', 'M', 'Z'].map((letter) => (
                    <option key={letter}>{letter}</option>
                  ))}
                </select>
              </label>
            )}
            {selected === 'string' && (
              <label className="var-input-label" htmlFor="var-name">
                Escribe un nombre
                <Input
                  id="var-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={24}
                  placeholder="Tu nombre"
                />
              </label>
            )}
          </div>
          <p className="var-example-use">
            <Lightbulb size={16} />
            {type.example}
          </p>
        </div>
        <figure className={`var-storage var-storage-${selected}`}>
          <figcaption>Así puedes imaginar la variable</figcaption>
          <div className="var-storage-heading">
            <span>
              TIPO <code>{type.label}</code>
            </span>
            <span>
              NOMBRE <code>{type.name}</code>
            </span>
          </div>
          <div className="var-value">
            <span>VALOR ACTUAL</span>
            <output aria-live="polite">{displayed}</output>
          </div>
          {selected === 'int' && (
            <div className="var-coin-grid" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => (
                <span key={index} className={index < coins ? 'is-filled' : ''}>
                  {index < coins ? '•' : ''}
                </span>
              ))}
            </div>
          )}
          {(selected === 'float' || selected === 'double') && (
            <div className="var-measure" aria-hidden="true">
              <div
                style={{
                  width: `${selected === 'float' ? speed * 10 : distance * 4}%`,
                }}
              />
              <span>0</span>
              <span>{selected === 'float' ? '10 m/s' : '25 m'}</span>
            </div>
          )}
          {selected === 'bool' && (
            <div className="var-bool-options" aria-hidden="true">
              <span className={!hasCard ? 'is-active' : ''}>false · No</span>
              <span className={hasCard ? 'is-active' : ''}>true · Sí</span>
            </div>
          )}
          {selected === 'char' && (
            <p className="var-storage-note">
              Un carácter básico → comillas simples
            </p>
          )}
          {selected === 'string' && (
            <p className="var-storage-note">Texto → comillas dobles</p>
          )}
          <small>
            Esquema conceptual; no representa el tamaño real en memoria.
          </small>
        </figure>
      </div>
      <div className="var-declaration">
        <span>Su declaración en C++</span>
        {selected === 'string' && (
          <code className="var-include">{'#include <string>'}</code>
        )}
        <code className="var-code-expression">
          <span className="var-color-type">{type.label}</span>{' '}
          <span className="var-color-name">{type.name}</span>
          {' = '}
          <span className="var-color-value">{literal}</span>;
        </code>
      </div>
    </div>
  );
}

function ExecutionLab({ example }: { example: VariableExample }) {
  const { lines: executionLines, steps: executionSteps, type } = example;
  const [step, setStep] = useState(0);
  const current = executionSteps[step];
  return (
    <div className="var-lab var-execution">
      <div className="var-lab-bar">
        <span>
          <Play size={17} /> Sigue la ejecución
        </span>
        <span>Paso {step} de 4</span>
      </div>
      <div className="var-execution-grid">
        <div className="var-instructions">
          <span className="var-mini-label">INSTRUCCIONES DENTRO DE main()</span>
          <ol className="var-code-steps">
            {executionLines.map((line, index) => (
              <li
                key={line}
                className={
                  step === index + 1
                    ? 'is-current'
                    : step > index + 1
                      ? 'is-executed'
                      : ''
                }
                aria-current={step === index + 1 ? 'step' : undefined}
              >
                <span aria-hidden="true">{index + 1}</span>
                <code>{line}</code>
                {step === index + 1 && (
                  <ArrowLeft size={15} aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <p className="var-fragment-note">
            Fragmento de C++. Para usar <code>std::cout</code>, incluye{' '}
            <code>{'<iostream>'}</code>.
            {type.id === 'string' && (
              <>
                {' '}
                Para <code>std::string</code>, incluye también{' '}
                <code>{'<string>'}</code>.
              </>
            )}{' '}
            Más abajo tienes el programa completo.
          </p>
        </div>
        <div className="var-execution-state">
          <div className={`var-memory-cell ${step === 0 ? 'is-empty' : ''}`}>
            <span className="var-mini-label">ESTADO DE LA VARIABLE</span>
            <div>
              <code>{type.label}</code>
              <strong>{type.name}</strong>
            </div>
            <output aria-label={`Valor actual de ${type.name}`}>
              {current.value ?? '—'}
            </output>
            <span>
              {step === 0 ? 'Todavía no existe' : 'Mismo nombre · mismo tipo'}
            </span>
          </div>
          <div className="var-console">
            <span>
              <Terminal size={14} /> Consola
            </span>
            <output aria-label="Salida de la consola">
              {current.output || (
                <span className="var-no-output">Todavía no hay salida.</span>
              )}
            </output>
          </div>
        </div>
      </div>
      <div className="var-step-explanation" aria-live="polite">
        <strong>{current.title}</strong>
        <p>{current.explanation}</p>
      </div>
      <div className="var-step-controls">
        <Button
          variant="ghost"
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          <RotateCcw size={15} /> Reiniciar
        </Button>
        <div>
          <Button
            variant="outline"
            onClick={() => setStep((value) => value - 1)}
            disabled={step === 0}
          >
            <ArrowLeft size={15} /> Anterior
          </Button>
          <Button
            onClick={() => setStep((value) => value + 1)}
            disabled={step === 4}
          >
            {step === 0
              ? 'Ejecutar primera línea'
              : step === 4
                ? 'Ejecución terminada'
                : 'Siguiente línea'}
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
      <p className="var-simulation-note">
        Simulación didáctica de estas cuatro instrucciones. Los controles no
        compilan C++.
      </p>
    </div>
  );
}

function VariablesQuiz({ example }: { example: VariableExample }) {
  const { questions } = example;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions.map(() => null),
  );
  const question = questions[questionIndex];
  const selected = answers[questionIndex];
  const correct = selected === question.answer;
  const solved = questions.filter(
    (item, index) => answers[index] === item.answer,
  ).length;
  return (
    <div className="var-lab var-quiz">
      <div className="var-lab-bar">
        <span>
          <CircleHelp size={17} /> Comprueba lo que entendiste
        </span>
        <span>
          {solved} / {questions.length} resueltos
        </span>
      </div>
      <div className="var-quiz-body">
        <nav className="var-quiz-tabs" aria-label="Elegir ejercicio">
          {questions.map((item, index) => (
            <Button
              key={item.title}
              variant={questionIndex === index ? 'default' : 'outline'}
              aria-current={questionIndex === index ? 'step' : undefined}
              onClick={() => setQuestionIndex(index)}
              aria-label={`Ejercicio ${index + 1}: ${item.title}${answers[index] === item.answer ? ', resuelto' : ''}`}
            >
              {answers[index] === item.answer ? (
                <Check size={15} />
              ) : (
                String(index + 1).padStart(2, '0')
              )}
            </Button>
          ))}
        </nav>
        <h3>{question.title}</h3>
        <p id="var-quiz-prompt">{question.prompt}</p>
        {'code' in question && (
          <pre className="var-small-code">
            <code>{question.code}</code>
          </pre>
        )}
        <fieldset
          className="var-answer-list"
          aria-describedby="var-quiz-prompt"
        >
          <legend className="sr-only">Elige una respuesta</legend>
          {question.choices.map((choice, index) => (
            <label
              key={choice}
              className={`var-answer ${selected === index ? (correct ? 'is-correct' : 'is-incorrect') : ''}`}
            >
              <input
                type="radio"
                name={`question-${questionIndex}`}
                checked={selected === index}
                onChange={() =>
                  setAnswers((previous) =>
                    previous.map((value, itemIndex) =>
                      itemIndex === questionIndex ? index : value,
                    ),
                  )
                }
              />
              <span>{choice}</span>
              {selected === index &&
                (correct ? <Check size={17} /> : <RotateCcw size={16} />)}
            </label>
          ))}
        </fieldset>
        <div
          className={`var-feedback ${selected !== null ? (correct ? 'is-correct' : 'is-incorrect') : ''}`}
          aria-live="polite"
        >
          {selected === null ? (
            <p>
              Elige una respuesta para ver la explicación. Puedes volver a
              intentarlo.
            </p>
          ) : (
            <>
              <strong>{correct ? '¡Exacto!' : 'Piénsalo una vez más.'}</strong>
              <p>{correct ? question.explanation : question.hint}</p>
            </>
          )}
        </div>
        {solved === questions.length && (
          <p className="var-quiz-success">
            <Check size={18} /> ¡Los cuatro resueltos! Ya distingues tipo,
            asignación y constantes con {example.type.label}.
          </p>
        )}
        <div className="var-quiz-footer">
          <Button
            variant="ghost"
            onClick={() => {
              setAnswers(questions.map(() => null));
              setQuestionIndex(0);
            }}
          >
            <RotateCcw size={15} /> Repetir ejercicios
          </Button>
          <Button
            variant="outline"
            disabled={questionIndex === questions.length - 1}
            onClick={() => setQuestionIndex((value) => value + 1)}
          >
            Siguiente ejercicio <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CompleteExample({ example }: { example: VariableExample }) {
  const { program: completeProgram } = example;
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(completeProgram);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }
  return (
    <div className="var-full-example">
      <div className="var-code-header">
        <span>main.cpp · Programa completo</span>
        <Button variant="ghost" onClick={copyCode}>
          {copyState === 'copied' ? <Check size={15} /> : <Copy size={15} />}
          {copyState === 'copied' ? 'Copiado' : 'Copiar código'}
        </Button>
      </div>
      <pre>
        <code>{completeProgram}</code>
      </pre>
      <div className="var-console">
        <span>
          <Terminal size={14} /> Salida esperada
        </span>
        <output>{example.output}</output>
      </div>
      {copyState === 'error' && (
        <p className="var-copy-feedback" aria-live="polite">
          No se pudo copiar. Puedes seleccionar el código y copiarlo
          manualmente.
        </p>
      )}
    </div>
  );
}

function VariableExplanation({
  example,
  exampleKey,
}: {
  example: VariableExample;
  exampleKey: string;
}) {
  const { type, literal, declaration } = example;
  return (
    <>
      <section
        className="var-section var-anatomy-section"
        aria-label={`Declaración de ${type.label}`}
      >
        <p className="var-anatomy-intro">
          Leamos una declaración de izquierda a derecha:{' '}
          <code>{declaration}</code>
        </p>
        <div className="var-anatomy" aria-label="Partes de una declaración">
          <div>
            <code className="var-color-type">{type.label}</code>
            <strong>Tipo</strong>
            <p>Qué clase de dato guardamos: {type.category.toLowerCase()}.</p>
          </div>
          <div>
            <code className="var-color-name">{type.name}</code>
            <strong>Nombre</strong>
            <p>Cómo nos referimos al dato.</p>
          </div>
          <div>
            <code>=</code>
            <strong>Inicialización</strong>
            <p>Aquí usamos = para darle su primer valor.</p>
          </div>
          <div>
            <code className="var-color-value">{literal}</code>
            <strong>Valor inicial</strong>
            <p>El valor que elegiste en el laboratorio.</p>
          </div>
          <div>
            <code>;</code>
            <strong>Fin de instrucción</strong>
            <p>Cierra esta declaración.</p>
          </div>
        </div>
        <aside className="var-note">
          <CircleHelp size={20} />
          <p>
            <strong>El tipo se mantiene.</strong> La variable{' '}
            <code>{type.name}</code> sigue siendo <code>{type.label}</code>{' '}
            cuando cambia su valor. Elegir otro tipo en el selector carga un
            ejemplo diferente; no transforma el tipo de esta variable durante la
            ejecución.
          </p>
        </aside>
      </section>
      <section
        id="paso-a-paso"
        className="var-section"
        aria-labelledby="var-execution-title"
      >
        <div className="var-section-heading">
          <span>02</span>
          <div>
            <h2 id="var-execution-title">
              El valor cambia, la variable sigue ahí
            </h2>
            <p>
              Programar es dar instrucciones con un orden. A esa secuencia de
              pasos para resolver una tarea la llamamos{' '}
              <strong>algoritmo</strong>. {example.introduction}
            </p>
          </div>
        </div>
        <ExecutionLab key={exampleKey} example={example} />
        <div className="var-three-ideas">
          <div>
            <span>CREAR · {type.label}</span>
            <code>{declaration}</code>
            <p>
              Declaramos el nombre y el tipo, y lo{' '}
              <strong>inicializamos</strong> con <code>{literal}</code>.
            </p>
          </div>
          <div>
            <span>CAMBIAR · {type.label}</span>
            <code>{example.lines[1]}</code>
            <p>
              <strong>Asignamos</strong> <code>{example.assignedLiteral}</code>{' '}
              a la variable que ya existe.
            </p>
          </div>
          <div>
            <span>LEER · {type.label}</span>
            <code>{example.lines[3]}</code>
            <p>Consultamos su valor para mostrarlo, sin cambiarlo.</p>
          </div>
        </div>
        <aside className="var-note">
          <Lightbulb size={20} />
          <p>
            <code>{example.lines[2]}</code>
            <br />
            {example.operationNote} Aquí <code>=</code> significa{' '}
            <strong>asignar</strong>. Para comparar igualdad se usa{' '}
            <code>==</code>; lo veremos en operadores.
          </p>
        </aside>
      </section>
      <section className="var-section" aria-labelledby="var-habits-title">
        <div className="var-section-heading">
          <span>
            <TriangleAlert size={20} />
          </span>
          <div>
            <h2 id="var-habits-title">
              Cuatro detalles al trabajar con <code>{type.label}</code>
            </h2>
            <p>
              Las reglas de inicialización y los errores frecuentes también
              dependen del tipo de dato.
            </p>
          </div>
        </div>
        <div className="var-habits">
          {example.habits.map((habit) => (
            <div key={habit.label}>
              <span>{habit.label}</span>
              <h3>{habit.title}</h3>
              <pre>
                <code>{habit.code}</code>
              </pre>
              <p>{habit.explanation}</p>
            </div>
          ))}
        </div>
        <p className="var-footnote">
          Los tamaños y rangos exactos dependen del tipo y de la implementación.
          Por ahora, piensa en el significado del dato; estudiaremos la memoria
          más adelante.
        </p>
      </section>
      <section
        id="practicar"
        className="var-section"
        aria-labelledby="var-practice-title"
      >
        <div className="var-section-heading">
          <span>03</span>
          <div>
            <h2 id="var-practice-title">
              Tu turno: practica con <code>{type.label}</code>
            </h2>
            <p>
              Cuatro situaciones para este tipo de dato. Cada respuesta te
              explica el motivo, y puedes repetirlas sin límite.
            </p>
          </div>
        </div>
        <VariablesQuiz key={exampleKey} example={example} />
      </section>
      <section className="var-section" aria-labelledby="var-program-title">
        <div className="var-section-heading">
          <span>
            <Terminal size={20} />
          </span>
          <div>
            <h2 id="var-program-title">
              Tu ejemplo de <code>{type.label}</code>, listo para compilar
            </h2>
            <p>
              Este programa completo usa el mismo valor inicial y las mismas
              instrucciones del paso a paso. Puedes copiarlo en un archivo{' '}
              <code>main.cpp</code> y compilarlo con un compilador de C++.
            </p>
          </div>
        </div>
        <CompleteExample key={exampleKey} example={example} />
        <dl className="var-code-guide">
          <div>
            <dt>
              <code>#include</code>
            </dt>
            <dd>
              La cabecera <code>iostream</code> permite escribir en la consola.
              {type.id === 'string' && (
                <>
                  {' '}
                  También incluimos <code>string</code> para usar{' '}
                  <code>std::string</code>.
                </>
              )}
            </dd>
          </div>
          <div>
            <dt>
              <code>main()</code>
            </dt>
            <dd>
              Es el punto de entrada de este programa. Su <code>int</code> es el
              tipo de su resultado; la variable del ejemplo sigue siendo{' '}
              <code>{type.label}</code>. <code>return 0;</code> indica que
              terminó correctamente.
            </dd>
          </div>
          <div>
            <dt>
              <code>std::cout</code>
            </dt>
            <dd>
              Envía el valor de <code>{type.name}</code> a la consola.{' '}
              <code>{"'\\n'"}</code> añade un salto de línea.
              {type.id === 'bool' && (
                <>
                  {' '}
                  Usamos <code>std::boolalpha</code> para mostrar{' '}
                  <code>true</code> o <code>false</code>.
                </>
              )}
              {(type.id === 'float' || type.id === 'double') && (
                <>
                  {' '}
                  La consola puede omitir ceros finales; el tipo de la variable
                  no cambia.
                </>
              )}
            </dd>
          </div>
        </dl>
        <div className="var-next-concept">
          <Lightbulb size={22} />
          <div>
            <h3>Después: reunir estas instrucciones en una función</h3>
            <p>
              Una función reúne instrucciones bajo un nombre. Puede recibir
              datos como <code>{type.name}</code>, hacer una tarea y devolver un
              resultado. Lo veremos en su propia actividad.
            </p>
            <Link href="/cpp/funciones-y-flujo-de-ejecucion">
              Funciones y flujo de ejecución <ArrowRight size={14} />
              <span>Contenido pendiente</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function VariablesLesson() {
  const [selected, setSelected] = useState<DataType>('int');
  const [values, setValues] = useState<LabValues>(defaultLabValues);
  const example = createVariableExample(selected, values);
  const exampleKey = JSON.stringify([selected, values[selected]]);
  const changeValue: ChangeLabValue = (key, value) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const activities = getGroupLessons('cpp');
  const index = activities.findIndex((lesson) => lesson.id === lessonId);
  return (
    <LearningShell lesson={lessonId}>
      <article className="variables-lesson">
        <div className="var-page-meta">
          <Link href="/cpp">
            <ArrowLeft size={14} /> C++ sin Unreal Engine
          </Link>
          <span>
            Actividad {String(index + 1).padStart(2, '0')} · 15–20 min
          </span>
        </div>
        <header className="var-hero">
          <span className="var-mini-label">
            LOS DATOS SON EL PUNTO DE PARTIDA
          </span>
          <h1>
            Tipos de datos
            <br />y variables<span>.</span>
          </h1>
          <p>
            Una cantidad de monedas. Un nombre. Una respuesta de sí o no.
            Aprende a guardar estos datos y observa qué ocurre cuando cambian.
          </p>
        </header>
        <nav className="var-page-nav" aria-label="En esta lección">
          <a href="#explorar-tipos">01 · Explorar tipos</a>
          <a href="#paso-a-paso">02 · Seguir los cambios</a>
          <a href="#practicar">03 · Practicar</a>
        </nav>
        <section
          id="explorar-tipos"
          className="var-section"
          aria-labelledby="var-intro-title"
        >
          <div className="var-section-heading">
            <span>01</span>
            <div>
              <h2 id="var-intro-title">Un lugar con nombre para cada dato</h2>
              <p>
                Piensa en los compartimentos de una cartera: cada uno guarda
                algo. Una <strong>variable</strong> es un dato con un nombre que
                podemos usar en el programa. Su <strong>tipo</strong> determina
                qué valores puede representar.
              </p>
            </div>
          </div>
          <TypeExplorer
            selected={selected}
            values={values}
            onSelect={setSelected}
            onChange={changeValue}
            example={example}
          />
          <p className="var-footnote">
            Los rangos y saltos de los controles son solo para practicar; no
            representan los límites de cada tipo.
          </p>
        </section>
        <div className="var-linked-type">
          <label htmlFor="var-lesson-type">Tipo para toda la lección</label>
          <select
            id="var-lesson-type"
            value={selected}
            onChange={(event) => setSelected(event.target.value as DataType)}
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <code>
            {example.type.name} = {example.literal}
          </code>
          <a href="#explorar-tipos">
            Cambiar valor inicial <ArrowRight size={14} />
          </a>
        </div>
        <p className="var-linked-note">
          El tipo y el valor inicial se comparten con todos los ejemplos. Al
          cambiarlos, la ejecución y los ejercicios comienzan de nuevo.
        </p>
        <VariableExplanation example={example} exampleKey={exampleKey} />
        <div className="var-takeaway">
          <span className="var-mini-label">QUÉDATE CON ESTA IDEA</span>
          <p>
            El <strong>tipo</strong> dice qué dato puedes representar. El{' '}
            <strong>nombre</strong> te permite encontrarlo en el código. El{' '}
            <strong>valor</strong> es lo que guarda en ese momento.
          </p>
        </div>
        <details className="var-references">
          <summary>Referencias y alcance de los ejemplos</summary>
          <p>
            Lección adaptada del material compartido sobre programación y la
            cartera, ampliada con ejemplos de C++ estándar. Los laboratorios son
            simulaciones educativas; no ejecutan un compilador ni necesitan
            Unreal Engine.
          </p>
          <ul>
            <li>
              <a
                href="https://learn.microsoft.com/en-us/cpp/cpp/fundamental-types-cpp?view=msvc-170"
                target="_blank"
                rel="noreferrer"
              >
                Microsoft Learn: tipos fundamentales de C++
              </a>
            </li>
            <li>
              <a
                href="https://eel.is/c++draft/dcl.init.list"
                target="_blank"
                rel="noreferrer"
              >
                Borrador del estándar: inicialización con llaves y conversiones
              </a>
            </li>
            <li>
              <a
                href="https://eel.is/c++draft/string.classes"
                target="_blank"
                rel="noreferrer"
              >
                Borrador del estándar: cadenas de texto
              </a>
            </li>
          </ul>
        </details>
        <div className="var-complete">
          <div>
            <Check size={20} />
            <span>
              Ya puedes reconocer el tipo, el nombre y el valor de una variable.
            </span>
          </div>
          <CompleteLesson id={lessonId} />
        </div>
        <nav className="activity-pagination" aria-label="Actividades del grupo">
          <Link href={activities[index - 1].href}>
            <ArrowLeft size={18} />
            <span>
              <small>ACTIVIDAD ANTERIOR · PENDIENTE</small>
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
