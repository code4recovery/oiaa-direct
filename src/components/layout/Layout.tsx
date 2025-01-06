import { Box, Grid, GridItem } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export const Layout = ({ children, sidebar }: LayoutProps) => {
  return (
    <Box width="100%" px={4}>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "2fr 1fr"
        }}
        gap={8}
        maxW="1400px"
        mx="auto"
        width="100%"
      >
        <GridItem>{children}</GridItem>
        <GridItem
          display={{
            base: "none", // Hide on mobile
            lg: "block"   // Show on desktop
          }}
        >
          {sidebar}
        </GridItem>
      </Grid>
    </Box>
  )
} 