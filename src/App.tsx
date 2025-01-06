import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "@/components/ui/provider"
import Meetings from "./routes/meetings"

export function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Meetings />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  )
} 