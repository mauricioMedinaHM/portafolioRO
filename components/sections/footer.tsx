import { PopContainer } from "@/components/pop/heading";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-honeydew/55 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <PopContainer>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-0.5 pr-14 text-[13px] font-medium text-cocoa-2 sm:pr-0">
          <p>© {new Date().getFullYear()} {name} · Salta, Argentina</p>
          <a
            href="#inicio"
            className="inline-flex min-h-11 items-center underline-offset-4 hover:text-sun-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
          >
            Volver arriba
          </a>
        </div>
      </PopContainer>
    </footer>
  );
}
