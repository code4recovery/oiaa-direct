import { hydrateRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { createRoutesFromElements, Route } from "react-router-dom"
import Root from "./root"
import Meetings from "./routes/meetings"

console.log("Entry client starting")

try {
  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" Component={Root}>
        <Route index Component={Meetings} />
        <Route path="favicon.ico" loader={() => new Response(null, { status: 204 })} />
      </Route>
    )
  )

  console.log("About to hydrate")
  hydrateRoot(
    root,
    <RouterProvider router={router} />
  )
  console.log("Hydration complete")
} catch (error) {
  console.error("Hydration error:", error)
}
