'use client';

import { useState } from 'react';
import {
  Box,
  Check,
  Copy,
  Maximize2,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function ScaleLab() {
  const [scale, setScale] = useState(1);
  const [copyStatus, setCopyStatus] = useState('');
  const value = scale.toFixed(1);
  const snippet = `// Fragmento dentro de un método de tu Actor\nfloat Scale = ${value}f;\nSetActorScale3D(FVector(Scale));`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyStatus('Copiado');
    } catch {
      setCopyStatus('Selecciona el código para copiarlo');
    }
  };

  // Geometría funcional: proyección isométrica de un cubo con origen en su centro.
  const point = (x: number, y: number, z: number) =>
    `${210 + (x - y) * 27 * scale},${139 + (x + y) * 13.5 * scale - z * 31 * scale}`;
  const face = (vertices: number[][]) =>
    vertices.map(([x, y, z]) => point(x, y, z)).join(' ');

  return (
    <div className="scale-lab">
      <div className="lab-heading">
        <span>
          <span className="live-dot" /> LABORATORIO 01{' '}
          <span className="lab-divider">/</span> La escala de un Actor
        </span>
        <span className="interactive-badge">Interactivo</span>
      </div>
      <div className="lab-body">
        <div className="lab-code">
          <div className="code-file">
            <span>
              <span className="cpp-file">C++</span> MiActor.cpp
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copiar código del laboratorio"
              onClick={copy}
            >
              {copyStatus === 'Copiado' ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </Button>
          </div>
          <pre aria-label="Código C++ de la escala">
            <code>
              <span className="code-line">
                <i>1</i>
                <span className="syntax-comment">
                  {'// Un valor. Un cambio en tu mundo.'}
                </span>
              </span>
              <span className="code-line">
                <i>2</i>
                <span>
                  <b className="syntax-purple">float</b> Scale ={' '}
                  <b className="syntax-orange">{value}f</b>;
                </span>
              </span>
              <span className="code-line">
                <i>3</i>
                <span />
              </span>
              <span className="code-line">
                <i>4</i>
                <span className="syntax-comment">
                  {'// Aplica la escala en X, Y y Z'}
                </span>
              </span>
              <span className="code-line">
                <i>5</i>
                <span>
                  <b className="syntax-green">SetActorScale3D</b>(
                  <b className="syntax-blue">FVector</b>(Scale));
                </span>
              </span>
            </code>
          </pre>
          <output className="copy-status">{copyStatus}</output>
          <div className="lab-controls">
            <div className="slider-label">
              <span id="scale-label">
                <SlidersHorizontal size={14} /> Escala del Actor
              </span>
              <output htmlFor="actor-scale">
                {value}
                <span>×</span>
              </output>
            </div>
            <Slider
              id="actor-scale"
              aria-labelledby="scale-label"
              thumbLabel="Escala uniforme del Actor"
              value={[scale]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(next) => {
                setScale(Array.isArray(next) ? next[0] : next);
                setCopyStatus('');
              }}
            />
            <div className="slider-marks">
              <span>0.5×</span>
              <span>1.0×</span>
              <span>1.5×</span>
              <span>2.0×</span>
            </div>
            <div className="slider-hint">
              <span>
                Arrastra y observa el resultado{' '}
                <span aria-hidden="true">→</span>
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setScale(1);
                  setCopyStatus('');
                }}
              >
                <RotateCcw size={12} /> Restablecer
              </Button>
            </div>
          </div>
        </div>
        <div className="lab-preview">
          <div className="viewport-bar">
            <span>
              <Box size={13} /> Vista del Actor
            </span>
            <span className="view-type">PERSPECTIVA</span>
          </div>
          {/* SVG needs an explicit image role to announce the live geometry label. */}
          <svg
            viewBox="0 0 420 280"
            className="actor-viewport"
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- SVG needs image semantics for its accessible name.
            role="img"
            aria-label={`Cubo con escala uniforme ${value}, equivalente al ${Math.round(scale * 100)} por ciento de su tamaño original`}
          >
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 28 0 L 0 0 0 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
              <linearGradient id="cube-front" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#75d9af" stopOpacity=".2" />
                <stop offset="1" stopColor="#75d9af" stopOpacity=".05" />
              </linearGradient>
            </defs>
            <rect width="420" height="280" fill="url(#grid)" opacity=".25" />
            <path
              d="M210 215 L325 157 M210 215 L95 157 M210 215 L210 75"
              fill="none"
              stroke="#456256"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <polygon
              points={face([
                [-1, -1, 1],
                [1, -1, 1],
                [1, 1, 1],
                [-1, 1, 1],
              ])}
              fill="#315f4d"
              stroke="#86dcb4"
              strokeWidth="1.5"
            />
            <polygon
              points={face([
                [-1, 1, 1],
                [1, 1, 1],
                [1, 1, -1],
                [-1, 1, -1],
              ])}
              fill="url(#cube-front)"
              stroke="#86dcb4"
              strokeWidth="1.5"
            />
            <polygon
              points={face([
                [1, -1, 1],
                [1, 1, 1],
                [1, 1, -1],
                [1, -1, -1],
              ])}
              fill="#19372b"
              stroke="#86dcb4"
              strokeWidth="1.5"
            />
            <circle cx="210" cy="139" r="3" fill="#a5e9c5" />
            <g
              transform="translate(35 238)"
              fontSize="9"
              fontFamily="monospace"
            >
              <path d="M0 0 L20 -10" stroke="#da897f" />
              <text x="25" y="-10" fill="#da897f">
                X
              </text>
              <path d="M0 0 L-16 -10" stroke="#88b99d" />
              <text x="-24" y="-11" fill="#88b99d">
                Y
              </text>
              <path d="M0 0 L0 -24" stroke="#84a7d3" />
              <text x="-3" y="-29" fill="#84a7d3">
                Z
              </text>
            </g>
          </svg>
          <div className="viewport-bottom">
            <span>
              <span className="live-dot" /> Actualización en vivo
            </span>
            <span>
              X <b>{value}</b> <i>/</i> Y <b>{value}</b> <i>/</i> Z{' '}
              <b>{value}</b>
            </span>
          </div>
        </div>
      </div>
      <div className="lab-footnote">
        <Maximize2 size={13} />
        <span>
          Simulación educativa en el navegador. El fragmento se ejecutaría
          dentro de un método de un Actor en Unreal.
        </span>
      </div>
    </div>
  );
}
