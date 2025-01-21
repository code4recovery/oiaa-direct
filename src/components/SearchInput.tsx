import { FaSearch } from "react-icons/fa"

import { Box, Input } from "@chakra-ui/react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search meetings...",
}: SearchInputProps) => {
  return (
    <Box position="relative">
      <Box
        position="absolute"
        left={3}
        top="50%"
        transform="translateY(-50%)"
        color="gray.400"
        zIndex={2}
      >
        <FaSearch />
      </Box>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        pl={10}
        variant="outline"
        bg="white"
        _dark={{
          bg: "whiteAlpha.100",
          borderColor: "whiteAlpha.300",
          color: "white",
          _hover: {
            bg: "whiteAlpha.200",
          },
          _focus: {
            bg: "whiteAlpha.300",
            borderColor: "blue.300",
          },
        }}
      />
    </Box>
  )
}
