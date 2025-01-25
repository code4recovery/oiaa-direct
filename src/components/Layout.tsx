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
    <Box width="100%" display="flex" justifyContent="center">
      <Container maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} width="100%">
        <Box maxW="1200px" mx="auto" width="100%">
          <Grid
            templateColumns={sidebar ? { base: "1fr", md: "1fr 320px" } : "1fr"}
            gap={8}
            py={8}
          >
            <Box>{children}</Box>
            {sidebar && <Box>{sidebar}</Box>}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
