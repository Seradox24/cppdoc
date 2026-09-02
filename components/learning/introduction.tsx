'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Braces,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  GitBranch,
  Lightbulb,
  MousePointer2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompleteLesson } from './learning-shell';
import { sources } from '@/lib/lessons';

const steps = [
  {
    name: 'C++',
    subtitle: 'Defines las reglas',
    icon: Code2,
    label: '01 / LA BASE',
    title: 'Escribe los datos y el comportamiento.',
    description:
      'Una clase C++ puede definir la escala de un Actor y la función que la aplica. Compilas ese código para que forme parte de tu proyecto.',
    example: 'float Scale = 1.0f;',
    detail:
      'C++ también se usa fuera de Unreal. El motor añade sus propias clases, funciones y herramientas.',
  },
  {
    name: 'Blueprint',
    subtitle: 'Configuras y combinas',
    icon: GitBranch,
    label: '02 / LA CONEXIÓN',
    title: 'Construye sobre esa base desde el editor.',
    description:
      'Puedes crear un Blueprint que herede de tu clase C++. Si expones Scale con UPROPERTY y los especificadores adecuados, podrás configurarla en el editor y acceder a ella desde Blueprint.',
    example: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
    detail:
      'C++ y Blueprint pueden trabajar juntos. Este es un flujo habitual; Blueprint es opcional en este ejemplo.',
  },
  {
    name: 'Actor',
    subtitle: 'Lo ves en el nivel',
    icon: Box,
    label: '03 / EL RESULTADO',
    title: 'Coloca una instancia en tu mundo.',
    description:
      'Un Actor es un objeto que puede colocarse en un nivel. Al comenzar el juego, nuestro ejemplo aplica la escala a esa instancia; una malla visible permite observar el cambio.',
    example: 'SetActorScale3D(FVector(Scale));',
    detail:
      'La clase define cómo funciona. La instancia es el objeto concreto que colocas en el nivel.',
  },
];

const tokens = [
  {
    text: 'float',
    color: 'syntax-purple',
    title: 'El tipo de dato',
    explanation:
      'float guarda un número con decimales. Sirve para magnitudes como una escala o una velocidad. Sus valores son aproximados, no de precisión infinita.',
  },
  {
    text: 'Scale',
    color: '',
    title: 'El nombre de la variable',
    explanation:
      'Scale es el nombre que elegimos para este dato. Una variable nos permite guardar un valor y usarlo después. C++ distingue entre mayúsculas y minúsculas.',
  },
  {
    text: '=',
    color: '',
    title: 'La inicialización',
    explanation:
      'En esta declaración, el signo = da su valor inicial a Scale. Más adelante, el mismo signo puede asignar otro valor a una variable existente.',
  },
  {
    text: '1.0f',
    color: 'syntax-orange',
    title: 'El valor inicial',
    explanation:
      '1.0 representa la escala original. La f indica que este número decimal es un literal de tipo float. Con 2.0f, cada eje tendría el doble de longitud.',
  },
  {
    text: ';',
    color: '',
    title: 'El final de la declaración',
    explanation:
      'El punto y coma termina esta declaración. Es parte de la sintaxis que el compilador espera para entender correctamente el código.',
  },
];

const codeExamples = {
  header:
    '// Fragmento dentro de la clase AMiActor, en public:\nUPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Aprendizaje")\nfloat Scale = 1.0f;',
  source:
    '// Método de AMiActor; declarado en MiActor.h\nvoid AMiActor::BeginPlay()\n{\n    Super::BeginPlay();\n    SetActorScale3D(FVector(Scale));\n}',
};

export function Introduction() {
  const [step, setStep] = useState(0);
  const [token, setToken] = useState(0);
  const [file, setFile] = useState<'header' | 'source'>('header');
  const [copied, setCopied] = useState('');
  const [answer, setAnswer] = useState<number | null>(null);
  const current = steps[step];
  const StepIcon = current.icon;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[file]);
      setCopied('Código copiado');
    } catch {
      setCopied('Selecciona el código para copiarlo');
    }
  };

  return (
    <>
      <div className="lesson-meta">
        <span className="eyebrow">
          <span className="active-dot" /> LECCIÓN 02
        </span>
        <span>
          <Clock3 size={13} /> 8 min de lectura{' '}
          <span className="meta-dot">·</span> Nivel inicial
        </span>
      </div>
      <section className="intro-hero">
        <div className="welcome-label">Introducción a C++</div>
        <h1>
          De una línea de código
          <br />
          <span>a un mundo que responde.</span>
        </h1>
        <p>
          Antes de aprender la sintaxis, entendamos el mapa: qué es C++, qué
          aporta Unreal y cómo una idea se convierte en algo que puedes ver.
        </p>
        <div className="objectives">
          <span>
            <Check size={13} /> Entender el lenguaje
          </span>
          <span>
            <Check size={13} /> Conectarlo con Unreal
          </span>
          <span>
            <Check size={13} /> Leer tu primera variable
          </span>
        </div>
      </section>
      <nav className="article-index" aria-label="En esta lección">
        <span>EN ESTA LECCIÓN</span>
        <a href="#lenguaje">01. El lenguaje</a>
        <a href="#conexion">02. La conexión</a>
        <a href="#primera-linea">03. Tu primera línea</a>
        <a href="#comprueba">04. Comprueba</a>
      </nav>
      <section id="lenguaje" className="content-section lesson-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              01 / ENTENDER ANTES DE ESCRIBIR
            </div>
            <h2>¿Qué es C++?</h2>
          </div>
          <Braces className="section-symbol" size={25} />
        </div>
        <p className="article-copy">
          C++ es un lenguaje de programación: una forma de expresar datos y dar
          instrucciones a una computadora. Escribes código, un compilador lo
          transforma y el programa ejecuta esas instrucciones.
        </p>
        <div className="concept-pair">
          <div>
            <span className="concept-label">
              <Braces size={17} /> EL LENGUAJE
            </span>
            <h3>C++ pone las piezas</h3>
            <p>
              Variables para guardar datos, funciones para describir acciones y
              clases para organizar objetos.
            </p>
            <code>float Scale = 1.0f;</code>
          </div>
          <div>
            <span className="concept-label">
              <Box size={17} /> EL MOTOR
            </span>
            <h3>Unreal les da un mundo</h3>
            <p>
              El motor aporta herramientas y clases para trabajar con niveles,
              personajes, componentes y mucho más.
            </p>
            <code>SetActorScale3D(FVector(Scale));</code>
          </div>
        </div>
        <aside className="inline-note">
          <Lightbulb size={17} />
          <p>
            <strong>Una distinción útil:</strong> <code>float</code> pertenece a
            C++. <code>FVector</code> y <code>SetActorScale3D</code> pertenecen
            a la API de Unreal. Aprenderás a reconocer ambas capas.
          </p>
        </aside>
      </section>
      <section id="conexion" className="content-section lesson-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              02 / CONECTAR LAS PIEZAS
            </div>
            <h2>Del código a tu nivel</h2>
            <p>Selecciona cada paso para entender qué aporta.</p>
          </div>
          <span className="outline-badge">
            <MousePointer2 size={13} /> Explora el diagrama
          </span>
        </div>
        <div className="flow-diagram">
          <fieldset
            className="flow-steps"
            aria-label="Pasos del código al nivel"
          >
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div className="flow-step-wrap" key={item.name}>
                  <Button
                    variant="ghost"
                    className={`flow-step ${step === index ? 'selected' : ''}`}
                    aria-pressed={step === index}
                    aria-controls="step-explanation"
                    onClick={() => setStep(index)}
                  >
                    <Icon size={22} />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                    <span className="step-index">0{index + 1}</span>
                  </Button>
                  {index < 2 && (
                    <ChevronRight size={19} className="flow-arrow" />
                  )}
                </div>
              );
            })}
          </fieldset>
          <div id="step-explanation" className="flow-detail" aria-live="polite">
            <div className="flow-detail-title">
              <span className="route-icon">
                <StepIcon size={20} />
              </span>
              <span>
                <small>{current.label}</small>
                <h3>{current.title}</h3>
              </span>
            </div>
            <p>{current.description}</p>
            <code>{current.example}</code>
            <p className="detail-footnote">{current.detail}</p>
          </div>
        </div>
        <a
          className="source-link"
          href={sources.blueprint}
          target="_blank"
          rel="noreferrer"
        >
          Profundiza: C++ y Blueprint en la documentación de Epic Games{' '}
          <ArrowUpRight size={12} />
        </a>
      </section>
      <section id="primera-linea" className="content-section lesson-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              03 / LEER UNA IDEA PEQUEÑA
            </div>
            <h2>Tu primera línea, pieza por pieza</h2>
            <p>Elige una parte del código. Cada símbolo tiene un propósito.</p>
          </div>
        </div>
        <div className="token-explorer">
          <fieldset
            className="token-line"
            aria-label="Partes de una declaración C++"
          >
            {tokens.map((item, index) => (
              <Button
                key={item.text}
                variant="ghost"
                className={`code-token ${item.color} ${token === index ? 'selected' : ''}`}
                aria-pressed={token === index}
                aria-controls="token-explanation"
                onClick={() => setToken(index)}
              >
                {item.text}
              </Button>
            ))}
          </fieldset>
          <div
            className="token-detail"
            id="token-explanation"
            aria-live="polite"
          >
            <strong>{tokens[token].title}</strong>
            <p>{tokens[token].explanation}</p>
          </div>
        </div>
        <div className="subsection-heading">
          <h3>¿Y dónde va ese código en Unreal?</h3>
          <p>
            En una clase Actor creada desde Unreal, el archivo <code>.h</code>{' '}
            declara sus miembros y el <code>.cpp</code> implementa sus
            funciones.
          </p>
        </div>
        <div className="file-explorer">
          <fieldset className="file-tabs" aria-label="Archivo de ejemplo">
            <Button
              variant="ghost"
              aria-pressed={file === 'header'}
              className={file === 'header' ? 'selected' : ''}
              onClick={() => {
                setFile('header');
                setCopied('');
              }}
            >
              <Code2 size={13} /> MiActor.h
            </Button>
            <Button
              variant="ghost"
              aria-pressed={file === 'source'}
              className={file === 'source' ? 'selected' : ''}
              onClick={() => {
                setFile('source');
                setCopied('');
              }}
            >
              <Code2 size={13} /> MiActor.cpp
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="file-copy"
              aria-label="Copiar fragmento C++"
              onClick={copy}
            >
              {copied === 'Código copiado' ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </Button>
          </fieldset>
          <pre>
            <code>{codeExamples[file]}</code>
          </pre>
          <div className="file-explanation">
            <BookOpen size={14} />
            <p>
              {file === 'header'
                ? 'UPROPERTY es una macro de Unreal. EditAnywhere permite editar la propiedad; BlueprintReadWrite permite leerla y cambiarla desde Blueprint.'
                : 'BeginPlay se llama cuando este Actor empieza a jugar. Super::BeginPlay() conserva el comportamiento de su clase base. Después aplicamos Scale de manera uniforme.'}
            </p>
          </div>
          <div className="file-caption">
            <span>
              Fragmentos didácticos: requieren una clase AMiActor con BeginPlay
              declarado y una malla para ver el resultado. Cambiar Scale después
              de BeginPlay requiere volver a aplicarla.
            </span>
            <output>{copied}</output>
          </div>
        </div>
        <Link href="/#experimento" className="return-lab">
          Vuelve al laboratorio y conecta el código con el resultado{' '}
          <ArrowRight size={14} />
        </Link>
      </section>
      <section id="comprueba" className="content-section lesson-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              04 / UNA PAUSA PARA PENSAR
            </div>
            <h2>¿Qué pasaría si…?</h2>
            <p>
              Cambias <code>Scale</code> de <code>1.0f</code> a{' '}
              <code>2.0f</code> y vuelves a aplicar <code>SetActorScale3D</code>
              .
            </p>
          </div>
        </div>
        <div className="quiz">
          <h3>¿Qué cambia en el cubo?</h3>
          <fieldset
            className="quiz-options"
            aria-label="Respuestas a la pregunta sobre escala"
          >
            {[
              'Se mueve dos unidades hacia arriba.',
              'Cada eje tiene el doble de longitud.',
              'Gira dos grados sobre su eje.',
            ].map((option, index) => (
              <Button
                key={option}
                variant="ghost"
                className={`quiz-option ${answer === index ? 'chosen' : ''} ${answer === index && index === 1 ? 'correct' : ''}`}
                aria-pressed={answer === index}
                onClick={() => setAnswer(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
                {answer === index && index === 1 && <Check size={15} />}
              </Button>
            ))}
          </fieldset>
          {answer !== null && (
            <output
              className={`quiz-feedback ${answer === 1 ? 'success' : ''}`}
            >
              <strong>
                {answer === 1
                  ? '¡Exacto! Estás cambiando su tamaño.'
                  : 'Casi. Piensa en lo que hacía el slider.'}
              </strong>
              <p>
                {answer === 1
                  ? 'FVector(2.0f) usa 2 en X, Y y Z. Cada longitud se duplica. Como cambian tres dimensiones, el volumen es ocho veces el original.'
                  : 'La escala controla el tamaño. La posición y la rotación son propiedades diferentes. Puedes elegir otra respuesta o volver al laboratorio.'}
              </p>
            </output>
          )}
        </div>
      </section>
      <aside className="friendly-note">
        <span className="note-icon">
          <Lightbulb size={20} />
        </span>
        <div>
          <strong>Ya tienes tu primer mapa mental.</strong>
          <p>
            Un dato guarda un valor. Una función hace algo con él. Unreal
            permite que ese cambio se vea en tu mundo. A partir de aquí, iremos
            aprendiendo cada pieza con calma.
          </p>
        </div>
      </aside>
      <div className="further-reading">
        <span>PARA SEGUIR EXPLORANDO</span>
        <a href={sources.quickStart} target="_blank" rel="noreferrer">
          Primeros pasos con C++ · Epic Games <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="lesson-bottom">
        <Link href="/" className="text-link">
          <ArrowLeft size={14} /> Volver a bienvenida
        </Link>
        <CompleteLesson id="introduccion" />
      </div>
      <div className="next-topic">
        <span>DESPUÉS APRENDEREMOS</span>
        <strong>
          Variables y tipos{' '}
          <span className="small-pill neutral">Próximamente</span>
        </strong>
        <p>La base está lista. Este será el próximo capítulo del cuaderno.</p>
      </div>
    </>
  );
}
