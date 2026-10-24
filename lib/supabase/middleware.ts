import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const LOGIN_PATH = "/admin/login";

function isLoginPath(pathname: string) {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

/**
 * Refresca la sesión de Supabase y protege /admin/**.
 * - Sin env vars: manda al login (que muestra el aviso de configuración).
 * - Sin usuario: redirige a /admin/login?next=<ruta>.
 * - Con usuario en /admin/login: redirige a /admin.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { url, anonKey, ok } = getSupabaseEnv();

  const redirectToLogin = () => {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = "";
    if (!ok && pathname !== LOGIN_PATH) loginUrl.searchParams.set("setup", "1");
    if (pathname !== LOGIN_PATH && pathname !== "/admin") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  };

  if (!ok) {
    return isLoginPath(pathname)
      ? NextResponse.next()
      : redirectToLogin();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginPath(pathname)) {
    return redirectToLogin();
  }

  if (user && isLoginPath(pathname)) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}
