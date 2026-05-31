import { useTranslation } from "react-i18next"
import { FaSearch } from "react-icons/fa"

import {
  Box,
  Input,
} from "@chakra-ui/react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isInvalid?: boolean
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  isInvalid = false,
}: SearchInputProps) => {
  const { t } = useTranslation()
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
        placeholder={placeholder ?? t("search_placeholder")}
        pl={10}
        variant="outline"
        bg={isInvalid ? "red.100" : "white"}
        _dark={{
          bg: isInvalid ? "red.300" : "whiteAlpha.100",
          borderColor: isInvalid ? "red.500" : "whiteAlpha.300",
          color: "white",
          _hover: {
            bg: isInvalid ? "red.400" : "whiteAlpha.200",
          },
          _focus: {
            bg: isInvalid ? "red.400" : "whiteAlpha.300",
            borderColor: isInvalid ? "red.500" : "blue.300",
          },
        }}
      />
    </Box>
  )
}
