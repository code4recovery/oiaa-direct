import { Box, Container, Flex } from "@chakra-ui/react"

interface LayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function Layout({ sidebar, children }: LayoutProps) {
  return (
    <Container maxW="container.xl" py={8}>
      <Flex gap={8} flexDirection="row-reverse">
        {/* Fixed Sidebar */}
        <Box
          position="sticky"
          top={8}
          height="calc(100vh - 100px)"
          overflowY="auto"
          width="300px"
          flexShrink={0}
          borderRadius="lg"
          boxShadow="sm"
          px={4}
          py={2}
          css={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.2) transparent",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
            },
            _dark: {
              scrollbarColor: "rgba(255,255,255,0.2) transparent",
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,0.2)",
              },
            },
          }}
        >
          {sidebar}
        </Box>

        {/* Scrollable Content */}
        <Box
          flex="1"
          overflowY="auto"
          maxHeight="calc(100vh - 100px)"
          pr={4}
          css={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.2) transparent",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
            },
            _dark: {
              scrollbarColor: "rgba(255,255,255,0.2) transparent",
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,0.2)",
              },
            },
          }}
        >
          {children}
        </Box>
      </Flex>
    </Container>
  )
}
