import type { RouteConfig } from "@react-router/dev/routes"
import { route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/meetings-filtered.tsx"),
] satisfies RouteConfig
