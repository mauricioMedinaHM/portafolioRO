"use client";

import { useEffect, useState } from "react";

/** Tiempo mínimo en pantalla (aunque la página cargue antes). */
const MIN_MS = 1500;
/** Tope: si algún recurso tarda en cargar, la cortina sube igual. */
const MAX_MS = 4000;
/** Debe coincidir con la transición de `.intro-loader[data-state="leaving"]`. */
const LEAVE_MS = 950;

type LoaderState = "loading" | "leaving" | "done";

/**
 * Loader inicial: micrófono de móvil "RT" con el nombre. Se renderiza en el
 * HTML del servidor (es lo primero que se ve, antes de hidratar). Espera a
 * `window.load` + 1,5 s mínimo y después sube como una cortina.
 * Mientras está activo, las animaciones del hero quedan en pausa (globals.css)
 * para que arranquen justo cuando la cortina se levanta.
 */
export function IntroLoader({ name }: { name: string }) {
  const [state, setState] = useState<LoaderState>("loading");

  useEffect(() => {
    const start = performance.now();
    let leaveTimer: number | undefined;
    let doneTimer: number | undefined;
    let left = false;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const leave = () => {
      if (left) return;
      left = true;
      setState("leaving");
      root.style.overflow = prevOverflow;
      doneTimer = window.setTimeout(() => setState("done"), LEAVE_MS);
    };

    const onLoaded = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      leaveTimer = window.setTimeout(leave, wait);
    };

    if (document.readyState === "complete") onLoaded();
    else window.addEventListener("load", onLoaded, { once: true });
    const capTimer = window.setTimeout(leave, MAX_MS);

    return () => {
      window.removeEventListener("load", onLoaded);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(capTimer);
      root.style.overflow = prevOverflow;
    };
  }, []);

  if (state === "done") return null;

  const words = name.trim().split(/\s+/);
  const main = words.slice(0, 2).join(" ");
  const script = words.slice(2).join(" ");

  return (
    <div
      id="intro-loader"
      data-state={state}
      role="status"
      aria-live="polite"
      aria-label={`Cargando el portafolio de ${name}`}
      className="intro-loader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 overflow-hidden bg-cream px-6 text-cocoa"
    >
      {/* Sin JS no hay quien la levante: se oculta y el hero anima normal. */}
      <noscript>
        <style>{`#intro-loader{display:none!important}.pop-rise,.pop-write,.pop-burst,.pop-arch{animation-play-state:running!important}`}</style>
      </noscript>

      <div className="intro-loader-content flex flex-col items-center gap-6">
        <Microphone className="w-[min(58vw,240px)]" />

        <p className="text-center">
          <span className="font-pop block text-[40px] leading-[0.9] text-cocoa sm:text-[56px]">
            {main}
          </span>
          {script ? (
            <span className="font-script mt-1 inline-block -rotate-6 text-[34px] leading-none text-rose-ink sm:text-[44px]">
              {script}
            </span>
          ) : null}
        </p>

        <div className="flex flex-col items-center gap-3" aria-hidden>
          <span className="pop-label inline-flex items-center gap-2 text-[12px] text-cocoa-2">
            <span className="intro-loader-dot size-2 rounded-full bg-sun" />
            Saliendo al aire
          </span>
          <span className="h-1.5 w-40 overflow-hidden rounded-full bg-peach">
            <span className="intro-loader-bar block h-full w-full origin-left rounded-full bg-sun" />
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Micrófono de móvil con cubo "RT", en el estilo plano/pop de la landing:
 * contorno cocoa grueso, cubo naranja sol, brillos y rayitos de "sonido".
 */
function Microphone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 390" aria-hidden className={className}>
      <defs>
        <pattern
          id="intro-mic-mesh"
          width="11"
          height="11"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0H11M0 0V11" stroke="var(--color-cocoa-2)" strokeWidth="2.4" />
        </pattern>
        <clipPath id="intro-mic-head">
          <circle cx="150" cy="82" r="54" />
        </clipPath>
        <clipPath id="intro-mic-flag">
          <rect x="78" y="136" width="144" height="96" rx="22" />
        </clipPath>
      </defs>

      {/* Sombra en el piso: se achica cuando el mic sube. */}
      <ellipse className="intro-mic-shadow" cx="150" cy="372" rx="72" ry="9" fill="var(--color-sand)" />

      {/* Rayitos de sonido (naranja/ámbar) y trazos de movimiento (rosa). */}
      <g className="intro-mic-rays" strokeLinecap="round" fill="none">
        <path d="M46 92 L80 116" stroke="var(--color-sun)" strokeWidth="10" />
        <path d="M74 50 L92 88" stroke="var(--color-amber)" strokeWidth="10" />
        <path d="M244 176 L280 156" stroke="var(--color-amber)" strokeWidth="10" />
        <path d="M246 214 L286 212" stroke="var(--color-sun)" strokeWidth="10" />
      </g>
      <g strokeLinecap="round" fill="none" stroke="var(--color-rose)" strokeWidth="6">
        <path className="intro-mic-swoosh" d="M120 22 q-22 12 -28 40" />
        <path className="intro-mic-swoosh" d="M250 252 q-8 34 -42 52" style={{ animationDelay: "160ms" }} />
        <path className="intro-mic-swoosh" d="M228 286 q-12 16 -32 24" style={{ animationDelay: "320ms" }} />
      </g>

      <g className="intro-mic-body" strokeLinejoin="round">
        {/* Cabeza con rejilla */}
        <circle cx="150" cy="82" r="54" fill="var(--color-cocoa)" />
        <rect x="90" y="22" width="120" height="120" fill="url(#intro-mic-mesh)" clipPath="url(#intro-mic-head)" />
        <circle
          cx="150"
          cy="82"
          r="47"
          fill="none"
          stroke="var(--color-sun)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="78 400"
          transform="rotate(-48 150 82)"
          opacity="0.9"
        />
        <ellipse cx="128" cy="56" rx="16" ry="9" fill="#fff" opacity="0.18" transform="rotate(-30 128 56)" />
        <circle cx="150" cy="82" r="54" fill="none" stroke="var(--color-cocoa)" strokeWidth="6" />

        {/* Aro */}
        <rect x="98" y="120" width="104" height="22" rx="11" fill="var(--color-cocoa)" />
        <path d="M110 127 H190" stroke="var(--color-cocoa-2)" strokeWidth="3" strokeLinecap="round" />

        {/* Cubo con las iniciales */}
        <rect x="78" y="136" width="144" height="96" rx="22" fill="var(--color-sun)" />
        <rect x="78" y="208" width="144" height="24" fill="var(--color-sun-deep)" clipPath="url(#intro-mic-flag)" />
        <rect x="92" y="146" width="116" height="9" rx="4.5" fill="#fff" opacity="0.22" />
        <text
          x="153"
          y="203"
          textAnchor="middle"
          fontFamily="var(--font-pop)"
          fontWeight="800"
          fontSize="62"
          letterSpacing="-2"
          fill="var(--color-sun-deep)"
        >
          RT
        </text>
        <text
          x="150"
          y="200"
          textAnchor="middle"
          fontFamily="var(--font-pop)"
          fontWeight="800"
          fontSize="62"
          letterSpacing="-2"
          fill="var(--color-cream)"
        >
          RT
        </text>
        <rect x="78" y="136" width="144" height="96" rx="22" fill="none" stroke="var(--color-cocoa)" strokeWidth="6" />

        {/* Cuello y mango */}
        <rect x="120" y="230" width="60" height="16" rx="6" fill="var(--color-cocoa)" />
        <path
          d="M124 244 H176 L170 334 Q169 342 161 342 H139 Q131 342 130 334 Z"
          fill="var(--color-cocoa)"
          stroke="var(--color-cocoa)"
          strokeWidth="6"
        />
        <path d="M139 256 L142 326" stroke="var(--color-cocoa-2)" strokeWidth="5" strokeLinecap="round" />
        <path d="M167 256 L163 326" stroke="var(--color-sun)" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        <rect x="130" y="330" width="40" height="14" rx="7" fill="#290087" />
      </g>
    </svg>
  );
}
