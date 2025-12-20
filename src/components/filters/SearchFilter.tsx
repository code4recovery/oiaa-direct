import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Box,
  Text,
} from "@chakra-ui/react"

import { SearchInput } from "./SearchInput"

interface SearchFilterProps {
  initialValue?: string
  onQueryChange: (query: string) => void
  showMinCharWarning?: boolean
}

export function SearchFilter({
  initialValue = "",
  onQueryChange,
  showMinCharWarning = true,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const [showWarning, setShowWarning] = useState(false)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // Skip calling onQueryChange on initial mount to avoid triggering loader
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const delayDebounce = setTimeout(() => {
      onQueryChange(searchQuery)
    }, 300)

    if (showMinCharWarning) {
      setShowWarning(searchQuery.length > 0 && searchQuery.length < 3)
    }

    return () => {
      clearTimeout(delayDebounce)
    }
  },
   // eslint-disable-next-line react-hooks/exhaustive-deps
   [searchQuery, showMinCharWarning]) // Removed onQueryChange - only trigger when searchQuery changes
  
  return (
    <Box>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        isInvalid={showWarning}
      />
      {showWarning && (
        <Text fontSize="xs" color="red.500" mt={1}>
          Enter at least 3 characters.
        </Text>
      )}
    </Box>
  )
}
