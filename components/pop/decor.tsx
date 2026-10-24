import type { CSSProperties, SVGProps } from "react";
import { cn } from "@/lib/utils";

/*
 * Ilustraciones de la dirección "Pop al aire". SVG propios, decorativos
 * (aria-hidden): asterisco-flor, destello, flor de pétalos, rayos de sol,
 * garabato y la insignia giratoria "Al aire · desde Salta".
 */

type DecorProps = SVGProps<SVGSVGElement> & { style?: CSSProperties };

/** Asterisco de 8 pétalos redondeados (el "starburst" de la referencia). */
export function Burst({ className, ...props }: DecorProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("fill-current", className)} {...props}>
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="44"
          y="4"
          width="12"
          height="46"
          rx="6"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
    </svg>
  );
}

/** Destello de 4 puntas. */
export function Sparkle({ className, ...props }: DecorProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("fill-current", className)} {...props}>
      <path d="M50 0C53 30 70 47 100 50C70 53 53 70 50 100C47 70 30 53 0 50C30 47 47 30 50 0Z" />
    </svg>
  );
}

/** Flor de 6 pétalos (formas orgánicas grandes de fondo). */
export function Flower({ className, ...props }: DecorProps) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={cn("fill-current", className)} {...props}>
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="52"
          rx="34"
          ry="52"
          transform={`rotate(${i * 60} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="40" />
    </svg>
  );
}

/** Rayos finos, como un estallido de luz de estudio. */
export function Rays({ className, ...props }: DecorProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      fill="none"
      className={cn("stroke-current", className)}
      strokeWidth="3"
      strokeLinecap="round"
      {...props}
    >
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const inner = i % 2 === 0 ? 46 : 60;
        const outer = i % 2 === 0 ? 96 : 84;
        return (
          <line
            key={i}
            x1={(100 + Math.cos(angle) * inner).toFixed(2)}
            y1={(100 + Math.sin(angle) * inner).toFixed(2)}
            x2={(100 + Math.cos(angle) * outer).toFixed(2)}
            y2={(100 + Math.sin(angle) * outer).toFixed(2)}
          />
        );
      })}
    </svg>
  );
}

/** Garabato a mano alzada (trazo de firma). */
export function Squiggle({ className, ...props }: DecorProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      aria-hidden
      fill="none"
      className={cn("stroke-current", className)}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 44C14 20 22 12 26 22C30 34 18 50 30 46C44 41 46 14 58 16C70 18 58 46 72 44C86 42 90 22 100 24C108 26 104 40 116 36" />
    </svg>
  );
}

/**
 * Insignia circular con texto que gira lento (se detiene con reduced motion).
 * El texto real va en `label` para lectores de pantalla.
 */
export function OnAirBadge({
  text,
  label,
  className,
  children,
}: {
  text: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative grid place-items-center rounded-full bg-blush text-rose-deep",
        className,
      )}
    >
      <svg viewBox="0 0 120 120" aria-hidden className="pop-spin absolute inset-0 size-full">
        <defs>
          <path id="onair-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0" />
        </defs>
        <text className="fill-current text-[12px] font-bold uppercase">
          <textPath href="#onair-circle" textLength="272" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span aria-hidden className="relative">
        {children}
      </span>
    </div>
  );
}
