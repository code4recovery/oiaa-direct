import type { RouteConfig } from "@react-router/dev/routes"
import { route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/meetings-filtered.tsx"),
  route("/meetings/:slug", "./routes/meeting-details.tsx"),
] satisfies RouteConfig
