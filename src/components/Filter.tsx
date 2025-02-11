import { useState } from "react"

import { FaTimesCircle } from "react-icons/fa"
import type { SetURLSearchParams } from "react-router"

import { toggleArrayElement } from "@/meetings-utils"
import { COMMUNITIES, FEATURES, FORMATS, TYPE } from "@/meetingTypes"
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react"

import { CategoryFilter } from "./categoryFilter"
import { SearchInput } from "./SearchInput"

interface FilterProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: SetURLSearchParams
  sendQueryToParent: (x: string) => void
}

export function Filter({
  filterParams,
  sendFilterSelectionsToParent,
  sendQueryToParent,
}: FilterProps) {
  const [searchQueryEntry, setSearchQueryEntry] = useState<string>("")
  const activeTypes = filterParams.getAll("types").length > 0

  const hasActiveFilters = searchQueryEntry || activeTypes

  const clearFilters = () => {
    setSearchQueryEntry("")
    sendFilterSelectionsToParent({})
  }

  const handleToggleType = (type: string) => {
    sendFilterSelectionsToParent((prev) => {
      const newTypes = toggleArrayElement(filterParams.getAll("types"), type)
      prev.delete("types")
      newTypes.forEach((option) => {
        prev.append("types", option)
      })
      return prev
    })
  }

  const handleInputChange = (value: string) => {
    setSearchQueryEntry(value)
    if (value.length > 2) sendQueryToParent(value)
  }

  return (
    <>
      <Box
        p={4}
        borderRadius="lg"
        _dark={{
          borderColor: "whiteAlpha.200",
        }}
      >
        <VStack gap={4} align="stretch">
          <Heading size="md" color="inherit">
            Filters
          </Heading>
          <SearchInput value={searchQueryEntry} onChange={handleInputChange} />
          <Box>
            <Heading size="sm" mb={2} color="inherit">
              Languages
            </Heading>
          </Box>
          <CategoryFilter
            categoryName={"Meeting Type"}
            categoryData={TYPE}
            selectedTypes={filterParams.getAll("types")}
            onToggleType={handleToggleType}
          />
          <CategoryFilter
            categoryName={"Formats"}
            categoryData={FORMATS}
            selectedTypes={filterParams.getAll("types")}
            onToggleType={handleToggleType}
          />
          <CategoryFilter
            categoryName={"Features"}
            categoryData={FEATURES}
            selectedTypes={filterParams.getAll("types")}
            onToggleType={handleToggleType}
          />
          <CategoryFilter
            categoryName={"Communities"}
            categoryData={COMMUNITIES}
            selectedTypes={filterParams.getAll("types")}
            onToggleType={handleToggleType}
          />
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={clearFilters}
              color="gray.600"
              _dark={{
                color: "gray.200",
                _hover: { bg: "whiteAlpha.200" },
              }}
            >
              <Flex align="center" gap={2}>
                <FaTimesCircle />
                <Text>Clear Filters</Text>
              </Flex>
            </Button>
          )}
        </VStack>
      </Box>
    </>
  )
}
