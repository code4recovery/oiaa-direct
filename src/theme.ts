interface ThemeConfig {
  initialColorMode: 'light' | 'dark' | 'system'
  useSystemColorMode: boolean
}

export const theme = {
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  } as ThemeConfig
}

// We'll use these in our components directly
export const componentStyles = {
  button: {
    _dark: {
      color: 'white',
    }
  },
  input: {
    _dark: {
      bg: 'whiteAlpha.100',
      borderColor: 'whiteAlpha.300',
      _hover: {
        bg: 'whiteAlpha.200'
      },
      _focus: {
        bg: 'whiteAlpha.300',
        borderColor: 'blue.300'
      }
    }
  }
}