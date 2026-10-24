"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { FolderKanban, LayoutGrid, LogOut, User } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Proyectos", icon: LayoutGrid, exact: true },
  { href: "/admin/categorias", label: "Categorías", icon: FolderKanban },
  { href: "/admin/perfil", label: "Perfil", icon: User },
];

/** Chrome del admin: topbar con salir + nav inferior mobile-first. */
export function AdminShell({
  email,
  children,
}: {
  email?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-5">
          <div className="min-w-0">
            <p className="font-display text-lg leading-tight text-foreground">
              Admin
            </p>
            {email ? (
              <p className="truncate text-xs text-subtle">{email}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await signOut();
              } catch {
                toast.error("No se pudo cerrar sesión");
              }
            }}
            className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-medium text-subtle transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          >
            <LogOut className="size-4" aria-hidden />
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pt-6 pb-28 sm:px-8">
        {children}
      </main>

      <nav
        aria-label="Navegación del admin"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto flex w-full max-w-5xl items-stretch justify-around">
          {navItems.map(({ href, label, icon: NavIcon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-16 min-w-20 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-accent",
                  active ? "text-accent-strong" : "text-subtle hover:text-foreground",
                )}
              >
                <NavIcon className="size-5" aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
