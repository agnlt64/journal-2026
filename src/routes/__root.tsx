import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts
} from "@tanstack/react-router";
import appCss from "./globals.css?url";
import favicon from "@/public/favicon.svg";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Journal 2026" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        href: favicon,
      }
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="dark min-h-screen">
        <Sidebar />
        <Header />

        <main className="ml-24 pt-28 pb-8 px-6 relative z-10">
          <Outlet />
        </main>

        <Scripts />
      </body>
    </html>
  );
}