import type { RouteConfig } from "@react-router/dev/routes"
import { route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/meetings-filtered.tsx"),
  route("/group-info/:slug", "./routes/group-info.tsx"),
] satisfies RouteConfig
