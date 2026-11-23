import type { RouteConfig } from "@react-router/dev/routes"
import { index, layout, route } from "@react-router/dev/routes"

export default [
  layout("./routes/layout.tsx", [
    index("./routes/meetings-filtered.tsx"),
    route("/group-info/:slug", "./routes/group-info.tsx"),
    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig
