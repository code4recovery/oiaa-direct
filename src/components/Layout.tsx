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
  return (
    <Box width="100%" display="flex" justifyContent="center" minH="100vh">
      <Container maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} width="100%">
        <Box maxW="1200px" mx="auto" width="100%" position="relative">
          <Grid
            templateColumns={sidebar ? { base: "1fr", md: "1fr 320px" } : "1fr"}
            gap={8}
            py={8}
          >
            <Box overflowY="auto">
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
