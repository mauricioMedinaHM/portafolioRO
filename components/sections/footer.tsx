import Link from "next/link";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-ink text-mist">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 border-t border-mist/40 px-5 py-8 sm:flex-row sm:items-center sm:justify-between md:px-16">
        <p className="text-[13px] tracking-wide">
          © {new Date().getFullYear()} {name}
        </p>
        <Link
          href="/admin"
          className="inline-flex min-h-12 items-center text-[13px] tracking-wide text-mist underline-offset-4 hover:text-paper hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
