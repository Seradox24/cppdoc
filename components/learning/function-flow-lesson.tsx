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

const lessonId = 'cpp-funciones-y-flujo-de-ejecucion';

const functionParts = {
  returnType: {
    label: 'int',
    title: 'Tipo de retorno',
    text: 'Indica qué tipo de resultado entregará la función. void significa que no entrega un valor.',
  },
  name: {
    label: 'SayHello',
    title: 'Nombre',
    text: 'Permite llamar a la función desde otra parte del programa.',
  },
  parameters: {
    label: '()',
    title: 'Parámetros',
    text: 'Entre paréntesis aparecen los datos de entrada. Aquí están vacíos, así que la función no recibe ninguno.',
  },
  body: {
    label: '{ ... }',
    title: 'Cuerpo',
    text: 'Las llaves contienen las instrucciones que se ejecutan cuando llamamos a la función.',
  },
} as const;
type FunctionPart = keyof typeof functionParts;

function FunctionAnatomy() {
  const [active, setActive] = useState<FunctionPart>('returnType');
  const current = functionParts[active];
  return (
    <div className="foundation-anatomy-lab">
      <div className="function-signature" aria-label="Partes de una función">
        {Object.entries(functionParts).map(([id, part]) => (
          <button
            type="button"
            key={id}
            aria-pressed={active === id}
            onClick={() => setActive(id as FunctionPart)}
          >
            <code>{part.label}</code>
            <span>{part.title}</span>
          </button>
        ))}
      </div>
      <div className="foundation-explanation" aria-live="polite">
        <span>PARTE SELECCIONADA</span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
      </div>
    </div>
  );
}

const flowCode = [
  '#include <iostream>',
  '',
  'int SayHello();',
  '',
  'int main()',
  '{',
  '    return SayHello();',
  '}',
  '',
  'int SayHello()',
  '{',
  '    std::cout << "Hello World!\\n";',
  '    return 0;',
  '}',
] as const;

const flowSteps = [
  {
    line: 5,
    label: 'El programa entra en main',
    text: 'main es el punto de entrada de este programa de consola. La declaración de SayHello de la línea 3 no se ejecuta; solo anuncia que esa función existe.',
    stack: ['main'],
  },
  {
    line: 7,
    label: 'main llama a SayHello',
    text: 'Para resolver SayHello(), la ejecución pausa main y salta al cuerpo de esa función.',
    stack: ['main', 'SayHello'],
  },
  {
    line: 12,
    label: 'SayHello ejecuta su cuerpo',
    text: 'Las instrucciones se recorren de arriba hacia abajo. En esta línea se escribe el mensaje.',
    stack: ['main', 'SayHello'],
  },
  {
    line: 13,
    label: 'return entrega 0',
    text: 'return termina SayHello y entrega el entero 0 al lugar desde el que fue llamada.',
    stack: ['main', 'SayHello'],
  },
  {
    line: 7,
    label: 'main recibe el resultado y termina',
    text: 'La llamada queda resuelta como 0. El return de main entrega ese código y finaliza el programa.',
    stack: ['main'],
  },
] as const;

function FlowStepper() {
  const [step, setStep] = useState(0);
  const current = flowSteps[step];
  return (
    <div className="foundation-lab">
      <div className="foundation-step-controls" aria-label="Pasos de ejecución">
        {flowSteps.map((item, index) => (
          <button
            type="button"
            key={`${item.label}-${index}`}
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span> Paso {index + 1}
          </button>
        ))}
      </div>
      <div className="foundation-lab-grid is-wide-code">
        <CppCodeEditor
          filename="FunctionFlow.cpp"
          lines={flowCode}
          activeLine={current.line}
        />
        <div className="foundation-explanation flow-state" aria-live="polite">
          <span>
            PASO {step + 1} · LÍNEA {current.line}
          </span>
          <h3>{current.label}</h3>
          <p>{current.text}</p>
          <strong>Pila de llamadas</strong>
          <div className="call-stack">
            {current.stack.map((item, index) => (
              <code key={`${item}-${index}`}>{item}()</code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const functionQuestions = [
  {
    prompt: '¿Qué hace int SayHello(); antes de main?',
    choices: [
      'Ejecuta la función.',
      'Declara que la función existe.',
      'Imprime el mensaje.',
    ],
    answer: 1,
    explanation:
      'Esa línea es un prototipo: comunica el nombre, el retorno y los parámetros sin ejecutar el cuerpo.',
  },
  {
    prompt: '¿Dónde comienza este programa de consola?',
    choices: [
      'En la primera función escrita.',
      'En main.',
      'En el primer return.',
    ],
    answer: 1,
    explanation:
      'main es el punto de entrada del ejemplo. Las demás funciones se ejecutan cuando son llamadas.',
  },
  {
    prompt: '¿Qué sucede al ejecutar return 0;?',
    choices: [
      'La función continúa.',
      'La función termina y entrega 0.',
      'Se vuelve a la primera línea.',
    ],
    answer: 1,
    explanation:
      'return corta el recorrido de la función y devuelve el valor al código que la llamó.',
  },
] as const;

function FunctionQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    functionQuestions.map(() => null),
  );
  const correct = functionQuestions.filter(
    (question, index) => answers[index] === question.answer,
  ).length;
  return (
    <div className="foundation-quiz">
      <div className="foundation-toolbar">
        <span>
          <CircleHelp size={17} /> Sigue el recorrido
        </span>
        <span>
          {correct} / {functionQuestions.length}
        </span>
      </div>
      <div className="foundation-question-list">
        {functionQuestions.map((question, questionIndex) => (
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
                      name={`function-question-${questionIndex}`}
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
                  : 'Revisa el recorrido. '}
                {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="foundation-quiz-footer">
        <span>
          Vuelve al recorrido si necesitas seguir las líneas otra vez.
        </span>
        <Button
          variant="ghost"
          onClick={() => setAnswers(functionQuestions.map(() => null))}
        >
          <RotateCcw size={15} /> Reiniciar
        </Button>
      </div>
    </div>
  );
}

export function FunctionFlowLesson() {
  const activities = getGroupLessons('cpp');
  const index = activities.findIndex((lesson) => lesson.id === lessonId);
  return (
    <LearningShell lesson={lessonId}>
      <article className="foundation-lesson function-topic">
        <div className="foundation-page-meta">
          <Link href="/cpp">
            <ArrowLeft size={14} /> C++ sin Unreal Engine
          </Link>
          <span>
            Actividad {String(index + 1).padStart(2, '0')} · 20–25 min
          </span>
        </div>
        <header className="foundation-hero">
          <span className="foundation-kicker">
            DEL PUNTO DE ENTRADA AL RETORNO
          </span>
          <h1>
            Funciones y flujo de ejecución<span>.</span>
          </h1>
          <p>
            Aprende qué partes forman una función y sigue el salto desde main
            hasta una llamada y su regreso, línea por línea.
          </p>
        </header>
        <nav className="foundation-page-nav" aria-label="En esta lección">
          <a href="#anatomia">01 · Anatomía</a>
          <a href="#declarar-definir">02 · Declarar y definir</a>
          <a href="#flujo">03 · Flujo</a>
          <a href="#retorno">04 · Retorno</a>
          <a href="#practicar">05 · Practicar</a>
        </nav>

        <section id="anatomia" className="foundation-section">
          <div className="foundation-section-heading">
            <span>01</span>
            <div>
              <h2>Una función agrupa instrucciones</h2>
              <p>
                Selecciona cada parte de <code>int SayHello() {'{ ... }'}</code>{' '}
                para entender su responsabilidad.
              </p>
            </div>
          </div>
          <FunctionAnatomy />
        </section>

        <section id="declarar-definir" className="foundation-section">
          <div className="foundation-section-heading">
            <span>02</span>
            <div>
              <h2>Declarar anuncia; definir contiene el código</h2>
              <p>
                El compilador necesita conocer una función antes de encontrar
                una llamada.
              </p>
            </div>
          </div>
          <div className="foundation-compare-grid">
            <article>
              <span>DECLARACIÓN · PROTOTIPO</span>
              <CppCodeEditor
                filename="Prototype.cpp"
                lines={['int SayHello();']}
              />
              <p>
                Termina en <code>;</code> y no tiene cuerpo. Comunica la firma.
              </p>
            </article>
            <article>
              <span>DEFINICIÓN</span>
              <CppCodeEditor
                filename="Definition.cpp"
                lines={['int SayHello()', '{', '    return 0;', '}']}
              />
              <p>Incluye las llaves y las instrucciones que se ejecutarán.</p>
            </article>
          </div>
          <p className="foundation-inline-note">
            Si la definición completa aparece antes de la llamada, el prototipo
            separado no es necesario en este archivo.
          </p>
        </section>

        <section id="flujo" className="foundation-section">
          <div className="foundation-section-heading">
            <span>03</span>
            <div>
              <h2>Una llamada pausa una función y entra en otra</h2>
              <p>
                Avanza por los pasos. La línea resaltada muestra dónde está la
                ejecución y la pila indica qué llamadas siguen abiertas.
              </p>
            </div>
          </div>
          <FlowStepper />
        </section>

        <section id="retorno" className="foundation-section">
          <div className="foundation-section-heading">
            <span>04</span>
            <div>
              <h2>return termina la función</h2>
              <p>
                El tipo escrito al principio determina si debe regresar un
                valor.
              </p>
            </div>
          </div>
          <div className="foundation-rule-grid return-grid">
            <article>
              <span>VOID</span>
              <strong>
                <code>void ShowMessage()</code>
              </strong>
              <p>
                Puede usar <code>return;</code> para terminar, pero no entrega
                un valor.
              </p>
            </article>
            <article>
              <span>INT</span>
              <strong>
                <code>int GetExitCode()</code>
              </strong>
              <p>
                Debe entregar un entero, por ejemplo <code>return 0;</code>.
              </p>
            </article>
            <article>
              <span>ORDEN</span>
              <strong>Lo posterior no se ejecuta</strong>
              <p>
                Una instrucción colocada después del <code>return</code> queda
                fuera del recorrido.
              </p>
            </article>
          </div>
        </section>

        <section id="practicar" className="foundation-section">
          <div className="foundation-section-heading">
            <span>05</span>
            <div>
              <h2>Comprueba el flujo</h2>
              <p>Distingue el prototipo, el punto de entrada y el retorno.</p>
            </div>
          </div>
          <FunctionQuiz />
        </section>

        <div className="foundation-takeaway">
          <span className="foundation-kicker">QUÉDATE CON ESTA IDEA</span>
          <p>
            <code>main</code> inicia el recorrido. Una llamada entra en otra
            función y <code>return</code> devuelve el control al punto de
            llamada.
          </p>
        </div>
        <details className="foundation-references">
          <summary>Fuente y alcance de la actividad</summary>
          <p>
            Esta actividad reúne del material compartido únicamente la
            declaración, definición, llamada y retorno de funciones. La
            asignación de valores y los operadores continúan en la siguiente
            actividad.
          </p>
        </details>
        <div className="foundation-complete">
          <div>
            <CheckCircle2 size={20} />
            <span>
              Ya puedes seguir una llamada desde main hasta su retorno.
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
