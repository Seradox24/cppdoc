'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Coins,
  Lightbulb,
  RotateCcw,
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
            <Check size={18} /> ¡Los cuatro resueltos! Ya reconoces el tipo, el
            nombre y el literal de {example.type.label}.
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
            <strong>Cada ejemplo tiene su propio tipo.</strong> Elegir otra
            opción en el selector carga una variable diferente. No transforma
            una variable existente de un tipo a otro.
          </p>
        </aside>
      </section>
      <section
        id="detalles-tipo"
        className="var-section"
        aria-labelledby="var-habits-title"
      >
        <div className="var-section-heading">
          <span>02</span>
          <div>
            <h2 id="var-habits-title">
              Cómo se representa <code>{type.label}</code>
            </h2>
            <p>
              Cada tipo escribe sus valores de una forma y tiene errores
              frecuentes que conviene reconocer.
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
            Aprende qué tipos puede usar C++ para representar cada clase de
            dato.
          </p>
        </header>
        <nav className="var-page-nav" aria-label="En esta lección">
          <a href="#explorar-tipos">01 · Explorar tipos</a>
          <a href="#detalles-tipo">02 · Entender cada tipo</a>
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
          El tipo y el valor inicial se comparten con la explicación y los
          ejercicios de esta página.
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
            Unreal Engine. Los cambios posteriores del valor se estudian en
            “Asignación y operadores”.
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
