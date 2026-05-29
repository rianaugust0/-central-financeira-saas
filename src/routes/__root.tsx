import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  Outlet,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">Essa rota não existe ou foi movida.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em alguns segundos.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Central Financeira Inteligente" },
      { name: "description", content: "Controle financeiro premium com IA para empreendedores e famílias com renda variável." },
      { name: "theme-color", content: "#1a1f25" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const navigate = useRouter().navigate;

  const fetchData = useFinanceStore(s => s.fetchData);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isAuthRoute) {
        navigate({ to: '/login' });
      } else if (session && isAuthRoute) {
        navigate({ to: '/' });
      }
      
      if (session) {
        fetchData();
      }
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !isAuthRoute) {
        navigate({ to: '/login' });
      } else if (session && isAuthRoute) {
        navigate({ to: '/' });
      }

      if (session) {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthRoute, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthRoute ? (
        <div className="min-h-screen bg-background text-foreground">
          <Outlet />
        </div>
      ) : (
        <AppShell />
      )}
      <Toaster theme="dark" position="top-center" />
    </QueryClientProvider>
  );
}
