import { useNavigation } from "react-router"
import {
  Box,
  Container,
  Grid,
} from "@chakra-ui/react"

interface LayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function Layout({ children, sidebar }: LayoutProps) {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <Box width="100%" display="flex" justifyContent="center" minH="100vh">
      {isLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          height="2px"
          bg="blue.500"
          zIndex={9999}
          animation="pulse 1.5s ease-in-out infinite"
          css={{
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.5 },
            },
          }}
        />
      )}
      <Container maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} width="100%">
        <Box maxW="1200px" mx="auto" width="100%" position="relative">
          <Grid
            templateColumns={sidebar ? { base: "1fr", md: "1fr 320px" } : "1fr"}
            gap={8}
            py={8}
          >
            <Box>
              {children}
            </Box>
            {sidebar && (
              <Box
                position="sticky"
                top={8}
                maxH="calc(100vh - 4rem)"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'var(--chakra-colors-gray-300)',
                    borderRadius: '24px',
                  },
                  '.dark &::-webkit-scrollbar-thumb': {
                    background: 'var(--chakra-colors-gray-600)',
                  },
                }}
              >
                {sidebar}
              </Box>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
