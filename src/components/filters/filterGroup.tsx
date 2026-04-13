import React from "react"

import { useTranslation } from "react-i18next"

import type { FacetOptions } from "@/hooks/useFacets"
import type {
  Community,
  Feature,
  Format,
  Language,
  Type,
} from "@/meetingTypes"

import { CategoryFilter } from "./CategoryFilter"
import { FilterSection } from "./FilterSection"
import { TimeFilter } from "./TimeFilter"

interface RenderFilterGroupsProps {
  filterParams: URLSearchParams
  selectedDay: string
  selectedTimeFrame: string
  handleTimeChange: (day: string, timeFrame: string) => void
  handleToggle: (category: string) => (chosen: string) => void
  handleExclusiveToggle: (category: string) => (chosen: string) => void
  showTimeFilter: boolean
  isMobile: boolean
  disclosureStates?: Record<string, { open: boolean; onToggle: () => void }>
  facetOptions: FacetOptions
}

export function renderFilterGroups({
  filterParams,
  selectedDay,
  selectedTimeFrame,
  handleTimeChange,
  handleToggle,
  handleExclusiveToggle,
  showTimeFilter,
  isMobile,
  disclosureStates,
  facetOptions,
}: RenderFilterGroupsProps) {
  return (
    <FilterGroupsInner
      filterParams={filterParams}
      selectedDay={selectedDay}
      selectedTimeFrame={selectedTimeFrame}
      handleTimeChange={handleTimeChange}
      handleToggle={handleToggle}
      handleExclusiveToggle={handleExclusiveToggle}
      showTimeFilter={showTimeFilter}
      isMobile={isMobile}
      disclosureStates={disclosureStates}
      facetOptions={facetOptions}
    />
  )
}

function FilterGroupsInner({
  filterParams,
  selectedDay,
  selectedTimeFrame,
  handleTimeChange,
  handleToggle,
  handleExclusiveToggle,
  showTimeFilter,
  isMobile,
  disclosureStates,
  facetOptions,
}: RenderFilterGroupsProps) {
  const { t } = useTranslation()
  const groups: React.ReactNode[] = []

  if (showTimeFilter) {
    groups.push(
      isMobile ? (
        <FilterSection
          key="time"
          title={t("filter_day_time")}
          isOpen={disclosureStates?.time.open ?? false}
          onToggle={
            disclosureStates?.time.onToggle ??
            (() => {
              /* no-op fallback */
            })
          }
        >
          <TimeFilter
            selectedDay={selectedDay}
            selectedTimeFrame={selectedTimeFrame}
            onDayChange={(day) => {
              handleTimeChange(day, selectedTimeFrame)
            }}
            onTimeFrameChange={(timeFrame) => {
              handleTimeChange(selectedDay, timeFrame)
            }}
            variant="mobile"
          />
        </FilterSection>
      ) : (
        <TimeFilter
          key="time"
          selectedDay={selectedDay}
          selectedTimeFrame={selectedTimeFrame}
          onDayChange={(day) => {
            handleTimeChange(day, selectedTimeFrame)
          }}
          onTimeFrameChange={(timeFrame) => {
            handleTimeChange(selectedDay, timeFrame)
          }}
          variant="desktop"
        />
      )
    )
  }

  const categories = [
    {
      key: "type",
      title: t("filter_meeting_type"),
      options: facetOptions.types,
      selected: filterParams.getAll("type") as Type[],
      onToggle: handleExclusiveToggle("type"),
    },
    {
      key: "formats",
      title: t("filter_formats"),
      options: facetOptions.formats,
      selected: filterParams.getAll("formats") as Format[],
      onToggle: handleToggle("formats"),
    },
    {
      key: "features",
      title: t("filter_features"),
      options: facetOptions.features,
      selected: filterParams.getAll("features") as Feature[],
      onToggle: handleToggle("features"),
    },
    {
      key: "communities",
      title: t("filter_communities"),
      options: facetOptions.communities,
      selected: filterParams.getAll("communities") as Community[],
      onToggle: handleToggle("communities"),
    },
    {
      key: "languages",
      title: t("filter_languages"),
      options: facetOptions.languages,
      selected: filterParams.getAll("languages") as Language[],
      onToggle: handleToggle("languages"),
    },
  ]

  categories.forEach(({ key, title, options, selected, onToggle }) => {
    let typedOptions: Record<string, string | string[]>
    switch (key) {
      case "type":
        typedOptions = options as Record<Type, string | string[]>
        break
      case "formats":
        typedOptions = options as Record<Format, string | string[]>
        break
      case "features":
        typedOptions = options as Record<Feature, string | string[]>
        break
      case "communities":
        typedOptions = options as Record<Community, string | string[]>
        break
      case "languages":
        typedOptions = options as Record<Language, string | string[]>
        break
      default:
        typedOptions = options
    }
    const selectedCount = selected.length
    groups.push(
      isMobile ? (
        <FilterSection
          key={key}
          title={title}
          isOpen={disclosureStates?.[key]?.open ?? false}
          onToggle={
            disclosureStates?.[key]?.onToggle ??
            (() => {
              /* no-op fallback */
            })
          }
          badge={selectedCount}
        >
          <CategoryFilter
            displayName=""
            options={typedOptions}
            selected={selected}
            onToggle={onToggle}
          />
        </FilterSection>
      ) : (
        <CategoryFilter
          key={key}
          displayName={title}
          options={typedOptions}
          selected={selected}
          onToggle={onToggle}
        />
      )
    )
  })

  return groups
}
