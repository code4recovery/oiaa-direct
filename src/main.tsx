import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"

import ErrorPage from "./error-page"
import { theme } from "./helpers"
import Index from "./routes"
import Meeting, { loader as meetingLoader } from "./routes/meeting"
import Root, { loader as rootLoader } from "./routes/root"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      id: "root",
      loader: rootLoader,
      children: [
        {
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <Index /> },
            {
              path: "meetings/:meetingId",
              element: <Meeting />,
              loader: meetingLoader,
              // action: contactAction,
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.VITE_BASE_URL }
)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
)
