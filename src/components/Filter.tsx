import { useState } from "react"

import { FaTimesCircle } from "react-icons/fa"
import type { SetURLSearchParams } from "react-router"

import { toggleArrayElement } from "@/meetings-utils"
import {
  COMMUNITIES,
  type Community,
  type Feature,
  FEATURES,
  type Format,
  FORMATS,
  type Type,
  TYPE,
} from "@/meetingTypes"
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react"

import { CategoryFilter } from "./categoryFilter"
import { SearchInput } from "./SearchInput"

interface FilterProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  sendQueryToParent: (x: string) => void
}

export function Filter({
  filterParams,
  sendFilterSelectionsToParent,
  sendQueryToParent,
}: FilterProps) {
  const [searchQueryEntry, setSearchQueryEntry] = useState<string>("")
  const activeTypes =
    filterParams.getAll("features").length > 0 ||
    filterParams.getAll("formats").length > 0 ||
    filterParams.getAll("type").length > 0 ||
    filterParams.getAll("communities").length > 0

  const hasActiveFilters = searchQueryEntry || activeTypes

  const clearFilters = () => {
    setSearchQueryEntry("")
    sendFilterSelectionsToParent({})
  }

  const handleToggle = (category: string) => (chosen: string) => {
    sendFilterSelectionsToParent((prev: URLSearchParams) => {
      const newOptions = toggleArrayElement(
        filterParams.getAll(category),
        chosen
      )
      prev.delete(category)
      newOptions.forEach((option) => {
        prev.append(category, option)
      })
      return prev
    })
  }

  const handleFormatToggle = (formatOption: string) => {
    handleToggle("formats")(formatOption)
  }

  const handleFeatureToggle = (featureOption: string) => {
    handleToggle("features")(featureOption)
  }

  const handleTypeToggle = (typeOption: string) => {
    handleToggle("type")(typeOption)
  }

  const handleCommunityToggle = (communityOption: string) => {
    handleToggle("communities")(communityOption)
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
          <CategoryFilter<Type>
            displayName={"Meeting Type"}
            options={TYPE}
            selected={filterParams.getAll("type") as Type[]}
            onToggle={handleTypeToggle}
          />
          <CategoryFilter<Format>
            displayName={"Formats"}
            options={FORMATS}
            selected={filterParams.getAll("formats") as Format[]}
            onToggle={handleFormatToggle}
          />
          <CategoryFilter<Feature>
            displayName={"Features"}
            options={FEATURES}
            selected={filterParams.getAll("features") as Feature[]}
            onToggle={handleFeatureToggle}
          />
          <CategoryFilter<Community>
            displayName={"Communities"}
            options={COMMUNITIES}
            selected={filterParams.getAll("communities") as Community[]}
            onToggle={handleCommunityToggle}
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
