import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Mail,
  Menu,
  MessageCircle,
  Play,
  Plus,
  QrCode,
  Share2,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  menu: Menu,
  x: X,
  play: Play,
  share: Share2,
  qr: QrCode,
  download: Download,
  copy: Copy,
  external: ExternalLink,
  mail: Mail,
  whatsapp: MessageCircle,
  plus: Plus,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Lucide = iconMap[name];
  return <Lucide aria-hidden className={cn("size-5", className)} />;
}
