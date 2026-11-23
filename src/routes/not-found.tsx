import { NotFound } from "@/components/NotFound"

// Catch-all route: any address that matches no other route.
export default function NotFoundRoute() {
  return <NotFound what="page" />
}
