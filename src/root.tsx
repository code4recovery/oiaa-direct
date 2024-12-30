import "./index.css"

import { StrictMode } from "react"
import { Outlet, Scripts, ScrollRestoration } from "react-router"

import { Provider } from "@/components/ui/provider"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <StrictMode>
      <Provider>
        <Outlet />
      </Provider>
    </StrictMode>
  )
}
