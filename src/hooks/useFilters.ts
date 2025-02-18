import { useState, useCallback, useMemo } from "react"
import type { CategoryMap } from "@/meetingTypes"
import { toggleArrayElement } from "@/meetings-utils"

interface UseFiltersProps {
  filterParams: URLSearchParams
  setFilterParams: (params: URLSearchParams) => void
}

export function useFilters({ filterParams, setFilterParams }: UseFiltersProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleCategoryToggle = useCallback(<K extends keyof CategoryMap>(
    category: K,
    value: CategoryMap[K][number]
  ) => {
    setFilterParams(new URLSearchParams(params => {
      const current = params.getAll(category)
      const updated = toggleArrayElement(current, value)
      params.delete(category)
      updated.forEach(v => params.append(category, v))
      return params
    }))
  }, [setFilterParams])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setFilterParams(new URLSearchParams(params => {
      if (query) {
        params.set("nameQuery", query)
      } else {
        params.delete("nameQuery")
      }
      return params
    }))
  }, [setFilterParams])

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setFilterParams(new URLSearchParams())
  }, [setFilterParams])

  const hasActiveFilters = useMemo(() => {
    return filterParams.toString().length > 0
  }, [filterParams])

  return {
    searchQuery,
    handleCategoryToggle,
    handleSearch,
    clearFilters,
    hasActiveFilters,
  }
} 