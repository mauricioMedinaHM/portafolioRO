"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";

/** Botón flotante de WhatsApp (respeta safe-area-inset). */
export function FloatingContact({ whatsapp }: { whatsapp: string | null }) {
  const reduceMotion = useReducedMotion();
  if (!whatsapp) return null;

  return (
    <motion.a
      href={whatsappLink(whatsapp, WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed right-5 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-secondary text-white shadow-lift transition-colors hover:bg-secondary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 20 }}
      whileTap={reduceMotion ? undefined : { scale: 0.9 }}
    >
      <MessageCircle className="size-6" aria-hidden />
    </motion.a>
  );
}
