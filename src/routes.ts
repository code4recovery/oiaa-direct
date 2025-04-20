import type { RouteConfig } from "@react-router/dev/routes"
import { index, route } from "@react-router/dev/routes"

export default [
  index("./routes/meetings-filtered.tsx"),
  route("/group-info/:slug", "./routes/group-info.tsx"),
] satisfies RouteConfig
