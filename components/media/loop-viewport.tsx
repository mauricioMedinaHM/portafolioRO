"use client";

import { useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

/** Franja alrededor del centro de la pantalla. Fuera de ella el video no se carga. */
const BAND = 0.3;

const slots = new Map<string, HTMLElement>();
let notifySlots: (() => void) | null = null;

const LoopContext = createContext<ReadonlySet<string>>(new Set());

export function LoopViewportProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ReadonlySet<string>>(() => new Set());
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    notifySlots = () => setRevision((value) => value + 1);
    return () => {
      notifySlots = null;
    };
  }, []);

  useEffect(() => {
    if (reduce) {
      setActive((prev) => (prev.size === 0 ? prev : new Set()));
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      if (document.hidden) {
        setActive((prev) => (prev.size === 0 ? prev : new Set()));
        return;
      }

      const height = window.innerHeight;
      const width = window.innerWidth;
      const mid = height / 2;
      const limit = height * BAND;
      const maxPlaying = window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
      const next = new Set(
        [...slots.entries()]
          .map(([id, el]) => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 8 || rect.height < 8) return null;
            // En los carruseles las tarjetas comparten altura: sólo cuenta la que se ve (más de la mitad) a lo ancho.
            const visibleX = Math.min(rect.right, width) - Math.max(rect.left, 0);
            if (visibleX < rect.width / 2) return null;
            const distY = Math.abs(rect.top + rect.height / 2 - mid);
            if (distY >= limit) return null;
            // Desempate horizontal entre tarjetas de la misma fila.
            const dist = distY + Math.abs(rect.left + rect.width / 2 - width / 2) / 4;
            return { id, dist };
          })
          .filter((item): item is { id: string; dist: number } => item !== null)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, maxPlaying)
          .map((item) => item.id),
      );

      setActive((prev) => {
        if (prev.size === next.size && [...next].every((id) => prev.has(id))) return prev;
        return next;
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    schedule();
    // En captura: también el scroll horizontal de los carruseles (no burbujea hasta window).
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [reduce, revision]);

  return <LoopContext.Provider value={active}>{children}</LoopContext.Provider>;
}

export function useLoopSlot(nodeRef: RefObject<HTMLElement | null>) {
  const id = useId();
  const active = useContext(LoopContext);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    slots.set(id, node);
    notifySlots?.();
    return () => {
      slots.delete(id);
      notifySlots?.();
    };
  }, [id, nodeRef]);

  return active.has(id);
}
