import "./index.css"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { Provider } from "@/components/ui/provider"
import { Outlet } from "react-router-dom"

export function HydrateFallback() {
  console.log("HydrateFallback rendering")
  return (
    <ChakraProvider value={defaultSystem}>
      <Provider>
        <div>Loading...</div>
      </Provider>
    </ChakraProvider>
  )
}

export default function Root() {
  console.log("Root rendering")
  return (
    <ChakraProvider value={defaultSystem}>
      <Provider>
        <Outlet />
      </Provider>
    </ChakraProvider>
  )
}
