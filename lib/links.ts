/** Link de WhatsApp con mensaje precargado. `phone` en formato E.164. */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WHATSAPP_MESSAGE =
  "Hola Rosario, vi tu portafolio y me gustaría contactarte.";
