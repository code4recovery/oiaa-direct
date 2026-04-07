// @ts-nocheck
// TypeScript checking disabled for WordPress entry point
// This file uses createBrowserRouter with runtime basename from WordPress config

import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider, useLoaderData } from "react-router"

import { Provider } from "@/components/ui/provider"
import MeetingsFiltered, { clientLoader as meetingsClientLoader } from "@/routes/meetings-filtered"
import GroupInfo, { clientLoader as groupInfoClientLoader } from "@/routes/group-info"

// WordPress provides configuration via global variable
declare global {
  interface Window {
    OIAA_CONFIG?: {
      apiUrl?: string
      colorMode?: "light" | "dark" | "system"
      basePath?: string
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

const basePath = window.OIAA_CONFIG?.basePath || "/meetings"

// Create browser-based router with basename support
const router = createBrowserRouter([
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
