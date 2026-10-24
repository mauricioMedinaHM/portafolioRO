"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";

/** Botón flotante de WhatsApp. No tapa los CTA del primer pantallazo. */
export function FloatingContact({ whatsapp }: { whatsapp: string | null }) {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > 0.8 * window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const contacto = document.getElementById("contacto");
    if (!contacto) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(contacto);
    return () => observer.disconnect();
  }, []);

  const show = Boolean(whatsapp) && scrolledPast && !contactVisible;

  return (
    <AnimatePresence>
      {show && whatsapp ? (
        <motion.a
          key="fab-whatsapp"
          href={whatsappLink(whatsapp, WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-sun-deep text-white shadow-[0_12px_30px_-10px_rgb(194_65_12/0.7)] ring-4 ring-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25 }}
          whileTap={{ scale: 0.94 }}
        >
          <MessageCircle className="size-6" aria-hidden />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
