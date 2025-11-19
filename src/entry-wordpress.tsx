// @ts-nocheck
// TypeScript checking disabled for WordPress entry point
// This file uses hash router which has different type signatures than React Router v7's data router

import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { createHashRouter, RouterProvider, useLoaderData } from "react-router"

import { Provider } from "@/components/ui/provider"
import MeetingsFiltered, { clientLoader as meetingsClientLoader } from "@/routes/meetings-filtered"
import GroupInfo, { clientLoader as groupInfoClientLoader } from "@/routes/group-info"

// WordPress provides configuration via global variable
declare global {
  interface Window {
    OIAA_CONFIG?: {
      apiUrl?: string
      colorMode?: "light" | "dark" | "system"
    }
  }
}

// Override API URL from WordPress config if provided
if (window.OIAA_CONFIG?.apiUrl) {
  // Store in import.meta.env for compatibility with existing code
  // Note: This is a runtime override, not a build-time variable
  Object.defineProperty(import.meta.env, "VITE_CQ_URL", {
    value: window.OIAA_CONFIG.apiUrl,
    writable: false,
  })
}

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

// Create hash-based router with same routes as standard build
const router = createHashRouter([
  {
    path: "/",
    element: <MeetingsFilteredWrapper />,
    loader: async ({ request }) => {
      // Adapt clientLoader to work with hash router's loader signature
      return meetingsClientLoader({ request, params: {}, serverLoader: async () => undefined })
    },
  },
  {
    path: "/group-info/:slug",
    element: <GroupInfoWrapper />,
    loader: async ({ params }) => {
      // Adapt clientLoader to work with hash router's loader signature
      return groupInfoClientLoader({ request: new Request('/'), params: params, serverLoader: async () => undefined })
    },
  },
])

/**
 * Initialize the OIAA Meetings app in WordPress
 * Mounts the React application to the specified container element
 */
function initWordPressMeetings() {
  const container = document.getElementById("oiaa-meetings-root")

  if (!container) {
    console.error(
      "OIAA Meetings: Container element #oiaa-meetings-root not found"
    )
    return
  }

  // Get color mode from WordPress config
  const defaultColorMode = window.OIAA_CONFIG?.colorMode || "system"

  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider defaultTheme={defaultColorMode}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  )
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
