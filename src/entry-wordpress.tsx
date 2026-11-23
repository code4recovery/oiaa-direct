// @ts-nocheck
// TypeScript checking disabled for WordPress entry point
// This file uses createBrowserRouter with runtime basename from WordPress config

import "./i18n"
import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import * as Sentry from "@sentry/react"
import { createBrowserRouter, RouterProvider, useLoaderData } from "react-router"

import { NotConfigured } from "@/components/NotConfigured"
import { NotFound } from "@/components/NotFound"
import { RouteError } from "@/components/RouteError"
import { Provider } from "@/components/ui/provider"
import { getApiUrl } from "@/getData"
import MeetingsFiltered, { clientLoader as meetingsClientLoader } from "@/routes/meetings-filtered"
import GroupInfo, { clientLoader as groupInfoClientLoader } from "@/routes/group-info"
import { logError } from "@/utils/logger"

// WordPress provides configuration via global variable
declare global {
  interface Window {
    OIAA_CONFIG?: {
      apiUrl?: string
      colorMode?: "light" | "dark" | "system"
      basePath?: string
      language?: string
    }
  }
}

// The API URL from WordPress (window.OIAA_CONFIG.apiUrl) is read at call time by getApiUrl() in getData.ts.

// Wrapper components that properly handle loaderData
function MeetingsFilteredWrapper() {
  const loaderData = useLoaderData()
  // Pass loaderData in the format the component expects
  return <MeetingsFiltered loaderData={loaderData} />
}

function GroupInfoWrapper() {
  const loaderData = useLoaderData()
  // Pass loaderData in the format the component expects
  return <GroupInfo loaderData={loaderData} />
}

const basePath = window.OIAA_CONFIG?.basePath || "/meetings"

// Create browser-based router with basename support.
// Only called when an API URL is set: creating the router starts the route loaders.
const createRouter = () => createBrowserRouter([
  {
    // One error page for all routes: a loader that throws (API down) or a page that throws while rendering.
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: <MeetingsFilteredWrapper />,
        loader: async ({ request }) => {
          // Adapt clientLoader to work with browser router loader signature
          return meetingsClientLoader({ request, params: {}, serverLoader: async () => undefined })
        },
      },
      {
        path: "/group-info/:slug",
        element: <GroupInfoWrapper />,
        loader: async ({ params, request }) => {
          // Adapt clientLoader to work with browser router's loader signature
          return groupInfoClientLoader({ request, params: params, serverLoader: async () => undefined })
        },
      },
      {
        // Any other address under the meetings page, for example an old /meetings/<slug>/ link
        path: "*",
        element: <NotFound what="page" />,
      },
    ],
  },
], {
  basename: basePath,
})

/**
 * Initialize the OIAA Meetings app in WordPress
 * Mounts the React application to the specified container element
 */
function initWordPressMeetings() {
  const container = document.getElementById("oiaa-meetings-root")

  if (!container) {
    const errorMsg = "OIAA Meetings: Container element #oiaa-meetings-root not found"
    
    console.error(`❌ ${errorMsg}`)
    logError(new Error(errorMsg))
    return
  }

  // Get color mode from WordPress config
  const defaultColorMode = window.OIAA_CONFIG?.colorMode || "system"

  // No API URL in the plugin settings: show a message and make no request.
  const router = getApiUrl() ? createRouter() : undefined

  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider defaultTheme={defaultColorMode}>
        {router ? <RouterProvider router={router} /> : <NotConfigured />}
      </Provider>
    </React.StrictMode>
  )
}

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    sendDefaultPii: false,
    enableLogs: !import.meta.env.PROD,
  })
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWordPressMeetings)
} else {
  // DOM is already ready
  initWordPressMeetings()
}

// Export for manual initialization if needed
export { initWordPressMeetings }
