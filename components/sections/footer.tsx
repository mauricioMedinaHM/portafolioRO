import { PopContainer } from "@/components/pop/heading";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <PopContainer>
        <div className="flex flex-col gap-2 border-t-2 border-seam pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] font-medium text-cocoa-2">
          © {new Date().getFullYear()} {name} · Salta, Argentina
        </p>
        <a
          href="#inicio"
          className="inline-flex min-h-11 items-center text-[13px] font-medium text-cocoa-2 underline-offset-4 hover:text-sun-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
        >
          Volver arriba
        </a>
        </div>
      </PopContainer>
    </footer>
  );
}
