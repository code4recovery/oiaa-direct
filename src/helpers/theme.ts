import { extendTheme } from "@chakra-ui/react"

const initialColorMode = import.meta.env.VITE_COLOR_MODE ?? "system"

export const theme = extendTheme({
  config: {
    initialColorMode,
    useSystemColorMode: initialColorMode === "system",
  },
})
