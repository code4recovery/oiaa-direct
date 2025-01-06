import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Meetings from "./routes/meetings"
import type { SystemConfig } from "@chakra-ui/react"
import { useEffect } from 'react'

const config: SystemConfig = {
    cssVarsPrefix: 'chakra',
  }
  
  const system = {
    ...defaultSystem,
    _config: config,
    colorMode: 'light'
  }

export function App() {
    useEffect(() => {
        // Force light mode
        document.documentElement.setAttribute('data-color-mode', 'light')
      }, [])
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Meetings />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}