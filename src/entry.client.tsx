import "./i18n"

import * as Sentry from "@sentry/react"

import { HydratedRouter } from "react-router/dom"
import React from "react"
import ReactDOM from "react-dom/client"

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    sendDefaultPii: false,
    enableLogs: !import.meta.env.PROD,
  })
}

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>
)
