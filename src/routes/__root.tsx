import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts
} from "@tanstack/react-router";
import appCss from "./globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "TanStack Start Starter" }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
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
      <body
        // className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark min-h-screen`}
      >
        <Outlet />
        <Scripts />
        {/* <Header />
        <Sidebar /> */}
        {/* <main className="ml-24 pt-28 pb-8 px-6 relative z-10">{children}</main> */}
      </body>
    </html>
  );
}