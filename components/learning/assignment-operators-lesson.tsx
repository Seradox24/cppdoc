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
import { evaluatePrecedence, evaluateWallet } from '@/lib/assignment-lab';
import { getGroupLessons } from '@/lib/lessons';
import { CppCodeEditor } from './cpp-code-editor';
import { CompleteLesson, LearningShell } from './learning-shell';
import './cpp-foundations.css';

const lessonId = 'cpp-asignacion-y-operadores';

const assignmentLines = [
  'bool bHasEnoughMoney = false;',
  'bHasEnoughMoney = true;',
  'bool bCanBuyItem = bHasEnoughMoney;',
  'bHasEnoughMoney = false;',
] as const;

const assignmentSteps = [
  {
    line: 1,
    title: 'Declaramos e inicializamos',
    text: 'La variable nace con false. El tipo aparece porque estamos creando la variable.',
    money: 'false',
    buy: 'todavía no existe',
  },
  {
    line: 2,
    title: 'Reasignamos un valor',
    text: 'La variable ya existe: usamos su nombre, un solo = y el nuevo valor. Ahora contiene true.',
    money: 'true',
    buy: 'todavía no existe',
  },
  {
    line: 3,
    title: 'Leemos el valor',
    text: 'A la derecha de =, bHasEnoughMoney se lee. Su true se copia en la nueva variable bCanBuyItem.',
    money: 'true',
    buy: 'true',
  },
  {
    line: 4,
    title: 'El orden cambia el estado',
    text: 'bHasEnoughMoney pasa a false. bCanBuyItem conserva el true que recibió antes: no quedaron conectadas.',
    money: 'false',
    buy: 'true',
  },
] as const;

function AssignmentTimeline() {
  const [step, setStep] = useState(0);
  const current = assignmentSteps[step];
  return (
    <div className="foundation-lab">
      <div
        className="foundation-step-controls four-steps"
        aria-label="Orden de asignaciones"
      >
        {assignmentSteps.map((item, index) => (
          <button
            type="button"
            key={item.title}
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span> Línea {item.line}
          </button>
        ))}
      </div>
      <div className="foundation-lab-grid is-wide-code">
        <CppCodeEditor
          filename="Assignments.cpp"
          lines={assignmentLines}
          activeLine={current.line}
        />
        <div className="foundation-explanation" aria-live="polite">
          <span>PASO {step + 1}</span>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <div className="variable-state">
            <div>
              <code>bHasEnoughMoney</code>
              <strong>{current.money}</strong>
            </div>
            <div>
              <code>bCanBuyItem</code>
              <strong>{current.buy}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const operatorGroups = [
  {
    title: 'Aritméticos',
    symbols: ['+', '−', '*', '/', '%'],
    text: 'Construyen un número nuevo. % obtiene el resto de una división entera.',
  },
  {
    title: 'Comparación',
    symbols: ['<', '>', '<=', '>=', '==', '!='],
    text: 'Comparan dos resultados y producen true o false.',
  },
  {
    title: 'Lógicos',
    symbols: ['&&', '||', '!'],
    text: 'Combinan o niegan valores booleanos. Los usaremos más en condicionales.',
  },
] as const;

function OperatorMap() {
  const [active, setActive] = useState(1);
  const current = operatorGroups[active];
  return (
    <div className="operator-map">
      <div className="operator-tabs" aria-label="Familias de operadores">
        {operatorGroups.map((group, index) => (
          <button
            type="button"
            key={group.title}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            {group.title}
          </button>
        ))}
      </div>
      <div className="operator-display" aria-live="polite">
        <div>
          {current.symbols.map((symbol) => (
            <code key={symbol}>{symbol}</code>
          ))}
        </div>
        <p>{current.text}</p>
      </div>
      <div className="equals-warning">
        <div>
          <code>=</code>
          <span>
            <strong>Asignación</strong>Guarda un valor.
          </span>
        </div>
        <div>
          <code>==</code>
          <span>
            <strong>Comparación</strong>Pregunta si dos valores son iguales.
          </span>
        </div>
      </div>
    </div>
  );
}

function floatLiteral(value: number) {
  const formatted = Number.isInteger(value) ? value.toFixed(1) : String(value);
  return `${formatted}f`;
}

function WalletLab() {
  const [cost, setCost] = useState(10);
  const [coins, setCoins] = useState(2.5);
  const [firstBill, setFirstBill] = useState(5);
  const [secondBill, setSecondBill] = useState(0);
  const result = evaluateWallet({ cost, coins, firstBill, secondBill });
  const code = [
    `float Cost = ${floatLiteral(cost)};`,
    `float Coins = ${floatLiteral(coins)};`,
    `int FirstBill = ${firstBill};`,
    `int SecondBill = ${secondBill};`,
    '',
    'bool bHasEnoughMoney =',
    '    Coins + FirstBill + SecondBill >= Cost;',
  ];
  const controls = [
    { label: 'Coste', value: cost, set: setCost, min: 0, max: 30, step: 0.5 },
    {
      label: 'Monedas',
      value: coins,
      set: setCoins,
      min: 0,
      max: 10,
      step: 0.25,
    },
    {
      label: 'Primer billete',
      value: firstBill,
      set: setFirstBill,
      min: 0,
      max: 20,
      step: 5,
    },
    {
      label: 'Segundo billete',
      value: secondBill,
      set: setSecondBill,
      min: 0,
      max: 20,
      step: 5,
    },
  ];
  return (
    <div className="wallet-lab">
      <div className="wallet-controls">
        {controls.map((control) => (
          <label key={control.label}>
            <span>
              {control.label}
              <output>{control.value.toFixed(control.step < 1 ? 2 : 0)}</output>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              onChange={(event) => control.set(Number(event.target.value))}
            />
          </label>
        ))}
      </div>
      <div className="wallet-content">
        <CppCodeEditor filename="Wallet.cpp" lines={code} />
        <div
          className={`wallet-result ${result.enough ? 'is-enough' : 'is-short'}`}
          aria-live="polite"
        >
          <span>EXPRESIÓN RESUELTA</span>
          <div className="wallet-equation">
            <code>
              {coins} + {firstBill} + {secondBill}
            </code>
            <b>=</b>
            <strong>{result.available.toFixed(2)}</strong>
            <code>&gt;= {cost}</code>
          </div>
          <h3>
            {result.enough
              ? 'true · puedes pagar'
              : 'false · todavía no alcanza'}
          </h3>
          <p>
            {result.enough
              ? `Sobran ${result.difference.toFixed(2)} después de cubrir el coste.`
              : `Faltan ${Math.abs(result.difference).toFixed(2)} para llegar al coste.`}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrecedenceLab() {
  const [parentheses, setParentheses] = useState(false);
  const result = evaluatePrecedence({
    first: 2,
    second: 3,
    third: 6,
    parentheses,
  });
  return (
    <div className="precedence-lab">
      <div className="foundation-switch" aria-label="Orden de la expresión">
        <button
          type="button"
          aria-pressed={!parentheses}
          onClick={() => setParentheses(false)}
        >
          Sin paréntesis
        </button>
        <button
          type="button"
          aria-pressed={parentheses}
          onClick={() => setParentheses(true)}
        >
          Con paréntesis
        </button>
      </div>
      <div className="precedence-expression" aria-live="polite">
        <code>{parentheses ? '2 * (3 + 6)' : '2 * 3 + 6'}</code>
        <span>=</span>
        <strong>{result}</strong>
      </div>
      <ol>
        {parentheses ? (
          <>
            <li>
              <span>1</span>El paréntesis resuelve <code>3 + 6 = 9</code>.
            </li>
            <li>
              <span>2</span>Después calcula <code>2 * 9 = 18</code>.
            </li>
          </>
        ) : (
          <>
            <li>
              <span>1</span>La multiplicación resuelve <code>2 * 3 = 6</code>.
            </li>
            <li>
              <span>2</span>Después calcula <code>6 + 6 = 12</code>.
            </li>
          </>
        )}
      </ol>
    </div>
  );
}

const operatorQuestions = [
  {
    prompt: '¿Qué línea reasigna una variable que ya existe?',
    choices: ['int Coins = 2;', 'Coins = 5;', 'int = Coins 5;'],
    answer: 1,
    explanation:
      'Al reasignar usamos el nombre, =, el nuevo valor y ;. El tipo no se repite.',
  },
  {
    prompt: '¿Qué operador pregunta si dos valores son iguales?',
    choices: ['=', '==', '!='],
    answer: 1,
    explanation: '== compara. Un solo = asigna y != pregunta si son distintos.',
  },
  {
    prompt: '¿Qué produce 2 + 5 >= 10?',
    choices: ['true', 'false', '7'],
    answer: 1,
    explanation: 'Primero 2 + 5 produce 7; después 7 >= 10 produce false.',
  },
  {
    prompt: '¿Qué se resuelve primero en 2 * 3 + 6?',
    choices: ['3 + 6', '2 * 3', 'Todo a la vez'],
    answer: 1,
    explanation: 'La multiplicación tiene mayor precedencia que la suma.',
  },
] as const;

function OperatorQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    operatorQuestions.map(() => null),
  );
  const correct = operatorQuestions.filter(
    (question, index) => answers[index] === question.answer,
  ).length;
  return (
    <div className="foundation-quiz">
      <div className="foundation-toolbar">
        <span>
          <CircleHelp size={17} /> Comprueba la expresión
        </span>
        <span>
          {correct} / {operatorQuestions.length}
        </span>
      </div>
      <div className="foundation-question-list two-columns">
        {operatorQuestions.map((question, questionIndex) => (
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
                      name={`operator-question-${questionIndex}`}
                      checked={selected}
                      onChange={() =>
                        setAnswers((previous) =>
                          previous.map((answer, index) =>
                            index === questionIndex ? choiceIndex : answer,
                          ),
                        )
                      }
                    />
                    <code>{choice}</code>
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
                  : 'Prueba otra vez. '}
                {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="foundation-quiz-footer">
        <span>Modifica cualquier respuesta cuando quieras.</span>
        <Button
          variant="ghost"
          onClick={() => setAnswers(operatorQuestions.map(() => null))}
        >
          <RotateCcw size={15} /> Reiniciar
        </Button>
      </div>
    </div>
  );
}

export function AssignmentOperatorsLesson() {
  const activities = getGroupLessons('cpp');
  const index = activities.findIndex((lesson) => lesson.id === lessonId);
  return (
    <LearningShell lesson={lessonId}>
      <article className="foundation-lesson operator-topic">
        <div className="foundation-page-meta">
          <Link href="/cpp">
            <ArrowLeft size={14} /> C++ sin Unreal Engine
          </Link>
          <span>
            Actividad {String(index + 1).padStart(2, '0')} · 25–30 min
          </span>
        </div>
        <header className="foundation-hero">
          <span className="foundation-kicker">
            LOS VALORES CAMBIAN EN ORDEN
          </span>
          <h1>
            Asignación y operadores<span>.</span>
          </h1>
          <p>
            Guarda valores nuevos, lee el estado actual de una variable y
            construye expresiones aritméticas, comparaciones y decisiones
            booleanas.
          </p>
        </header>
        <nav className="foundation-page-nav" aria-label="En esta lección">
          <a href="#asignar">01 · Asignar</a>
          <a href="#operadores">02 · Operadores</a>
          <a href="#cartera">03 · Laboratorio</a>
          <a href="#precedencia">04 · Precedencia</a>
          <a href="#practicar">05 · Practicar</a>
        </nav>

        <section id="asignar" className="foundation-section">
          <div className="foundation-section-heading">
            <span>01</span>
            <div>
              <h2>Asignar cambia el valor desde esa línea</h2>
              <p>
                Avanza en orden. El estado inferior muestra qué contiene cada
                variable después de ejecutar la línea resaltada.
              </p>
            </div>
          </div>
          <AssignmentTimeline />
          <div className="foundation-inline-note">
            <strong>Inicializar</strong> da el primer valor al crear la
            variable. <strong>Reasignar</strong> cambia después el valor usando
            su nombre y <code>=</code>.
          </div>
        </section>

        <section id="operadores" className="foundation-section">
          <div className="foundation-section-heading">
            <span>02</span>
            <div>
              <h2>Los operadores transforman o comparan valores</h2>
              <p>
                Selecciona una familia. Una expresión puede combinar varias
                operaciones y producir un valor nuevo.
              </p>
            </div>
          </div>
          <OperatorMap />
        </section>

        <section id="cartera" className="foundation-section">
          <div className="foundation-section-heading">
            <span>03</span>
            <div>
              <h2>¿Alcanza para pagar?</h2>
              <p>
                Mueve los controles. C++ suma el dinero disponible y después
                compara el total con el coste.
              </p>
            </div>
          </div>
          <WalletLab />
        </section>

        <section id="precedencia" className="foundation-section">
          <div className="foundation-section-heading">
            <span>04</span>
            <div>
              <h2>El orden de los operadores cambia el resultado</h2>
              <p>
                La multiplicación se resuelve antes que la suma. Los paréntesis
                permiten pedir otro orden de forma explícita.
              </p>
            </div>
          </div>
          <PrecedenceLab />
          <p className="foundation-inline-note">
            En la expresión de la cartera, las sumas se resuelven antes de{' '}
            <code>&gt;=</code>. La comparación recibe los dos resultados y
            produce <code>true</code> o <code>false</code>.
          </p>
        </section>

        <section id="practicar" className="foundation-section">
          <div className="foundation-section-heading">
            <span>05</span>
            <div>
              <h2>Resuelve paso a paso</h2>
              <p>Distingue asignación, comparación y precedencia.</p>
            </div>
          </div>
          <OperatorQuiz />
        </section>

        <div className="foundation-takeaway">
          <span className="foundation-kicker">QUÉDATE CON ESTA IDEA</span>
          <p>
            <code>=</code> guarda un valor. Los operadores calculan resultados,
            y el orden de las instrucciones determina qué valor leerá el código
            siguiente.
          </p>
        </div>
        <details className="foundation-references">
          <summary>Fuente y alcance de la actividad</summary>
          <p>
            La actividad adapta el nuevo texto compartido y conserva aquí
            únicamente asignaciones, lectura de valores, operadores y
            precedencia. Los parámetros y retornos pertenecen a la actividad
            anterior; las ramas de ejecución se desarrollarán en
            “Condicionales”.
          </p>
        </details>
        <div className="foundation-complete">
          <div>
            <CheckCircle2 size={20} />
            <span>
              Ya puedes cambiar valores y seguir cómo se resuelve una expresión.
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
