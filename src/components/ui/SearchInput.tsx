import { Input, Box } from "@chakra-ui/react"
import { FaSearch } from "react-icons/fa"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search meetings..." 
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        pl={10}
        variant="outline"
        bg="gray.50"
        _hover={{
          bg: "gray.100"
        }}
        _focus={{
          bg: "white",
          borderColor: "blue.500"
        }}
      />
    </Box>
  )
} 