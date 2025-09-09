import React from "react"

import {
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"

import {
  Badge,
  Box,
  Collapsible,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react"

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: number
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  badge,
}) => (
  <Box
    borderRadius="md"
    borderWidth="1px"
    borderColor="gray.200"
    mb={2}
    bg="white"
  >
    <Flex
      align="center"
      justify="space-between"
      px={4}
      py={2}
      cursor="pointer"
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
    >
      <Flex align="center" gap={2}>
        <Text fontWeight="semibold">{title}</Text>
        {typeof badge === "number" && badge > 0 && (
          <Badge colorScheme="blue" borderRadius="full">
            {badge}
          </Badge>
        )}
      </Flex>
      <IconButton
        aria-label={isOpen ? "Collapse section" : "Expand section"}
        size="sm"
        variant="ghost"
        tabIndex={-1}
        pointerEvents="none"
      >
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </IconButton>
    </Flex>
    <Collapsible.Root open={isOpen}>
      <Collapsible.Content>
        <Box px={4} pb={4}>
          {children}
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  </Box>
)
