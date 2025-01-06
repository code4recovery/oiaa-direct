import { route } from "@react-router/dev/routes"
import type { RouteConfig } from "@react-router/dev/routes"

export default [
  route("/", "./routes/meetings.tsx"),
  route("/favicon.ico", "./routes/favicon.tsx")
] satisfies RouteConfig
