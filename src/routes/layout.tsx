import { Outlet } from "react-router"

import { RouteError } from "@/components/RouteError"

// Pathless parent of every route, so one error page covers them all (entry-wordpress.tsx has the same).
// It sits inside root.tsx, so the error page keeps the Chakra provider and the page styles.
export function ErrorBoundary() {
  return <RouteError />
}

export default function RoutesLayout() {
  return <Outlet />
}
