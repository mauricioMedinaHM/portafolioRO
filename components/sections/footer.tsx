import Link from "next/link";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-border px-5 py-10 text-center">
      <p className="text-sm text-subtle">
        © {new Date().getFullYear()} {name}
      </p>
      <Link
        href="/admin"
        className="mt-2 inline-flex min-h-12 items-center px-4 text-xs text-subtle underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-accent"
      >
        Admin
      </Link>
    </footer>
  );
}
