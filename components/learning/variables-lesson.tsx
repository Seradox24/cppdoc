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
  cppStringLiteral,
  executionLines,
  executionSteps,
} from '@/lib/variables-lab';
import { getGroupLessons } from '@/lib/lessons';
import './variables-lesson.css';

const lessonId = 'cpp-tipos-de-datos-y-variables';
const types = [
  {
    id: 'int',
    label: 'int',
    category: 'Números enteros',
    name: 'monedas',
    description:
      'Para contar unidades completas: 0, 12 o −5. No conserva la parte decimal.',
    example: 'Monedas, vidas o cantidad de objetos.',
  },
  {
    id: 'float',
    label: 'float',
    category: 'Números con decimales',
    name: 'velocidad',
    description:
      'Para representar medidas con decimales. La f de 2.5f indica que ese número es un float.',
    example: 'Una velocidad de 2.5 metros por segundo.',
  },
  {
    id: 'double',
    label: 'double',
    category: 'Más precisión habitual',
    name: 'distancia',
    description:
      'También representa decimales. Suele ofrecer más precisión que float. Un literal como 12.75, sin f, es double.',
    example: 'Una distancia que necesita más precisión.',
  },
  {
    id: 'bool',
    label: 'bool',
    category: 'Verdadero o falso',
    name: 'tieneTarjeta',
    description:
      'Solo tiene dos valores: true (verdadero) y false (falso). Sirve para guardar una respuesta de sí o no.',
    example: '¿Hay una tarjeta en la cartera?',
  },
  {
    id: 'char',
    label: 'char',
    category: 'Un carácter básico',
    name: 'inicial',
    description:
      "Para un carácter básico, como 'A' o '7'. Se escribe entre comillas simples. Un emoji no cabe necesariamente en un char.",
    example: 'La inicial de un nombre o una opción del menú.',
  },
  {
    id: 'string',
    label: 'std::string',
    category: 'Texto',
    name: 'nombre',
    description:
      'Guarda una secuencia de caracteres, como un nombre. Usa comillas dobles. Es un tipo de la biblioteca estándar; incluye <string> para usarlo.',
    example: 'El nombre de la persona: "Ada".',
  },
] as const;
type DataType = (typeof types)[number]['id'];

function TypeExplorer() {
  const [selected, setSelected] = useState<DataType>('int');
  const [coins, setCoins] = useState(12);
  const [speed, setSpeed] = useState(2.5);
  const [distance, setDistance] = useState(12.75);
  const [hasCard, setHasCard] = useState(true);
  const [initial, setInitial] = useState('A');
  const [name, setName] = useState('Ada');
  const type = types.find((item) => item.id === selected)!;
  const literals: Record<DataType, string> = {
    int: String(coins),
    float: `${speed.toFixed(1)}f`,
    double: distance.toFixed(2),
    bool: String(hasCard),
    char: `'${initial}'`,
    string: cppStringLiteral(name),
  };
  const literal = literals[selected];
  const displayed =
    selected === 'string'
      ? name || '(texto vacío)'
      : selected === 'char'
        ? initial
        : literal;

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

function ExecutionLab() {
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
            <code>{'<iostream>'}</code>. Más abajo tienes el programa completo.
          </p>
        </div>
        <div className="var-execution-state">
          <div className={`var-memory-cell ${step === 0 ? 'is-empty' : ''}`}>
            <span className="var-mini-label">ESTADO DE LA VARIABLE</span>
            <div>
              <code>int</code>
              <strong>monedas</strong>
            </div>
            <output aria-label="Valor actual de monedas">
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

const questions = [
  {
    title: 'Una respuesta de sí o no',
    prompt:
      'Quieres guardar si hay una tarjeta. ¿Qué declaración usa el tipo pensado para verdadero o falso?',
    choices: [
      'bool tieneTarjeta = true;',
      'std::string tieneTarjeta = "true";',
      "char tieneTarjeta = 'S';",
    ],
    answer: 0,
    explanation:
      'bool expresa directamente verdadero o falso. true es un valor de C++, sin comillas. "true" sería texto y \'S\' sería un carácter.',
    hint: 'Ese tipo puede guardar información, pero no es el tipo de dos valores true y false. Busca el tipo lógico.',
  },
  {
    title: 'Reemplazar no es sumar',
    prompt: 'Después de ejecutar estas dos líneas, ¿cuánto vale monedas?',
    code: 'int monedas = 12;\nmonedas = 5;',
    choices: ['17', '12', '5'],
    answer: 2,
    explanation:
      'La segunda línea reemplaza 12 por 5. La variable ya existe, así que no repetimos int. Para sumar usaríamos una expresión como monedas + 5.',
    hint: 'En la segunda línea no hay una suma: se guarda directamente el valor que está a la derecha de =.',
  },
  {
    title: 'El decimal que se pierde',
    prompt:
      'Con esta inicialización usando =, ¿qué valor se guarda? El compilador puede advertir sobre la conversión.',
    code: 'int puntos = 3.8;',
    choices: ['3.8', '3', '4'],
    answer: 1,
    explanation:
      'Se guarda 3: al convertir este decimal a int se descarta la parte fraccionaria. No se redondea. Con int puntos{3.8};, en cambio, las llaves hacen que esta conversión sea un error.',
    hint: 'int no conserva fracciones. Esta conversión descarta lo que hay después del punto; no redondea al entero más cercano.',
  },
  {
    title: 'Un dato que debe mantenerse',
    prompt: '¿Qué ocurre al intentar ejecutar este programa?',
    code: 'const int maxVidas = 3;\nmaxVidas = 5;',
    choices: [
      'maxVidas cambia a 5.',
      'Se crea otra variable.',
      'La segunda línea provoca un error de compilación.',
    ],
    answer: 2,
    explanation:
      'const indica que este dato no se puede modificar después de inicializarlo. El compilador rechaza la asignación, así que este programa no llega a ejecutarse.',
    hint: 'const protege ese valor frente a cambios posteriores. El compilador comprueba esa regla antes de ejecutar el programa.',
  },
] as const;

function VariablesQuiz() {
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
            asignación, conversión y constante.
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

const completeProgram = `#include <iostream>
#include <string>

int main() {
    std::string nombre = "Ada";
    int monedas = 12;
    monedas = monedas + 3;

    std::cout << nombre << " tiene " << monedas << " monedas.\\n";
    return 0;
}`;

function CompleteExample() {
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
        <output>Ada tiene 15 monedas.</output>
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

export function VariablesLesson() {
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
          <TypeExplorer />
          <p className="var-footnote">
            Los rangos y saltos de los controles son solo para practicar; no
            representan los límites de cada tipo.
          </p>
          <p className="var-anatomy-intro">
            Leamos una declaración de izquierda a derecha:{' '}
            <code>int monedas = 12;</code>
          </p>
          <div className="var-anatomy" aria-label="Partes de una declaración">
            <div>
              <code className="var-color-type">int</code>
              <strong>Tipo</strong>
              <p>Qué clase de dato guardamos.</p>
            </div>
            <div>
              <code className="var-color-name">monedas</code>
              <strong>Nombre</strong>
              <p>Cómo nos referimos al dato.</p>
            </div>
            <div>
              <code>=</code>
              <strong>Inicialización</strong>
              <p>Aquí usamos = para darle su primer valor.</p>
            </div>
            <div>
              <code className="var-color-value">12</code>
              <strong>Valor</strong>
              <p>El dato concreto con el que comienza.</p>
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
              <strong>El tipo se mantiene.</strong> Una variable{' '}
              <code>int</code> no se convierte en texto al cambiar su valor. En
              el laboratorio, cada tipo muestra una variable distinta. El valor
              puede cambiar; el nombre y el tipo de esa variable permanecen.
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
                <strong>algoritmo</strong>. Aquí vamos a crear un contador,
                cambiarlo y mostrarlo, una línea a la vez.
              </p>
            </div>
          </div>
          <ExecutionLab />
          <div className="var-three-ideas">
            <div>
              <span>CREAR</span>
              <code>int monedas = 10;</code>
              <p>
                Declaramos el nombre y el tipo, y lo{' '}
                <strong>inicializamos</strong> con 10.
              </p>
            </div>
            <div>
              <span>CAMBIAR</span>
              <code>monedas = 15;</code>
              <p>
                <strong>Asignamos</strong> un valor a la variable que ya existe.
              </p>
            </div>
            <div>
              <span>LEER</span>
              <code>{'std::cout << monedas;'}</code>
              <p>Consultamos su valor para mostrarlo, sin cambiarlo.</p>
            </div>
          </div>
          <aside className="var-note">
            <Lightbulb size={20} />
            <p>
              En <code>monedas = monedas + 2;</code>, primero se calcula el lado
              derecho y después se guarda el resultado a la izquierda. Aquí{' '}
              <code>=</code> significa <strong>asignar</strong>. Para comparar
              igualdad se usa <code>==</code>; lo veremos en operadores.
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
                Cuatro detalles que evitan confusiones
              </h2>
              <p>
                No necesitas memorizar todos los tipos. Empieza eligiendo qué
                representa tu dato y dándole un valor claro.
              </p>
            </div>
          </div>
          <div className="var-habits">
            <div>
              <span>01 / EMPIEZA CON UN VALOR</span>
              <h3>Inicializa antes de leer</h3>
              <pre>
                <code>{'int vidas = 3;\nint puntos{}; // empieza en 0'}</code>
              </pre>
              <p>
                Una variable local como <code>int puntos;</code>, dentro de una
                función, no empieza automáticamente en cero. No leas su valor
                sin inicializarla o asignarle uno antes.
              </p>
            </div>
            <div>
              <span>02 / PROTEGE LO QUE NO CAMBIA</span>
              <h3>
                Usa <code>const</code>
              </h3>
              <pre>
                <code>{'const int maxVidas = 3;'}</code>
              </pre>
              <p>
                Este valor se fija al inicializarlo. Intentar después{' '}
                <code>maxVidas = 5;</code> provoca un error de compilación.
              </p>
            </div>
            <div>
              <span>03 / UN TIPO TIENE LÍMITES</span>
              <h3>Cuida las conversiones</h3>
              <pre>
                <code>
                  {'int puntos = 3.8; // guarda 3\nint puntos{3.8};  // error'}
                </code>
              </pre>
              <p>
                Son dos alternativas, no líneas para usar juntas. Con{' '}
                <code>=</code> se descarta la fracción. Las llaves{' '}
                <code>{'{}'}</code> rechazan esta conversión que pierde
                información. Tampoco caben números infinitamente grandes en un{' '}
                <code>int</code>.
              </p>
            </div>
            <div>
              <span>04 / COMILLAS Y PUNTO DECIMAL</span>
              <h3>Escribe cada valor con su formato</h3>
              <pre>
                <code>
                  {
                    'char inicial = \'A\';\nstd::string nombre = "Ada";\nfloat velocidad = 2.5f;'
                  }
                </code>
              </pre>
              <p>
                Un carácter básico lleva comillas simples; el texto, dobles. En
                el código, escribe los decimales con <strong>punto</strong>.{' '}
                <code>float</code> y <code>double</code> aproximan muchos
                decimales; más precisión no significa exactitud total.
              </p>
            </div>
          </div>
          <p className="var-footnote">
            Los tamaños y rangos exactos dependen del tipo y de la
            implementación. Por ahora, piensa en el significado del dato;
            estudiaremos la memoria más adelante.
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
                Tu turno: predice antes de responder
              </h2>
              <p>
                Cuatro situaciones cortas. Cada respuesta te explica el motivo,
                y puedes repetirlas sin límite.
              </p>
            </div>
          </div>
          <VariablesQuiz />
        </section>
        <section className="var-section" aria-labelledby="var-program-title">
          <div className="var-section-heading">
            <span>
              <Terminal size={20} />
            </span>
            <div>
              <h2 id="var-program-title">Del experimento a un programa real</h2>
              <p>
                Este ejemplo es C++ estándar. Puedes copiarlo en un archivo{' '}
                <code>main.cpp</code> y compilarlo con un compilador de C++.
                Antes de ejecutarlo, intenta predecir qué dirá la consola.
              </p>
            </div>
          </div>
          <CompleteExample />
          <dl className="var-code-guide">
            <div>
              <dt>
                <code>#include</code>
              </dt>
              <dd>
                Nos permite usar las herramientas de cada cabecera:{' '}
                <code>iostream</code> para la consola y <code>string</code> para
                el texto.
              </dd>
            </div>
            <div>
              <dt>
                <code>main()</code>
              </dt>
              <dd>
                Es el punto de entrada de este programa. Las instrucciones van
                dentro de sus llaves. <code>return 0;</code> indica que terminó
                correctamente.
              </dd>
            </div>
            <div>
              <dt>
                <code>std::cout</code>
              </dt>
              <dd>
                Envía los datos a la consola. Cada <code>{'<<'}</code> añade una
                parte y <code>{'\n'}</code> produce un salto de línea.
              </dd>
            </div>
          </dl>
          <div className="var-next-concept">
            <Lightbulb size={22} />
            <div>
              <h3>¿Y las funciones del ejemplo de la cartera?</h3>
              <p>
                Una función reúne instrucciones bajo un nombre. Puede recibir
                datos, hacer una tarea y devolver un resultado. La veremos en su
                propia actividad, cuando estas variables ya te resulten
                familiares.
              </p>
              <Link href="/cpp/funciones-y-flujo-de-ejecucion">
                Funciones y flujo de ejecución <ArrowRight size={14} />
                <span>Contenido pendiente</span>
              </Link>
            </div>
          </div>
        </section>
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
