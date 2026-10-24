"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";

/** Botón flotante de WhatsApp. No tapa los CTA del primer pantallazo. */
export function FloatingContact({ whatsapp }: { whatsapp: string | null }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio < 0.55),
      { threshold: [0, 0.55, 1] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!whatsapp || !visible) return null;

  return (
    <motion.a
      href={whatsappLink(whatsapp, WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center border border-paper bg-ink text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <MessageCircle className="size-6" aria-hidden />
    </motion.a>
  );
}
