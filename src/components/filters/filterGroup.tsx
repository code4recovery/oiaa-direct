import type {
  CategoryKey,
  Community,
  Feature,
  Format,
  Language,
  Type,
} from "@/meetingTypes"

import { CategoryFilter } from "./CategoryFilter"
import type { FacetOptions } from "@/hooks/useFacets"
import { FilterSection } from "./FilterSection"
import React from "react"
import { TimeFilter } from "./TimeFilter"
import { useTranslation } from "react-i18next"

interface CategoryFilterEntry {
  key: CategoryKey
  title: string
  options: Record<string, string>
  selected: string[]
  onToggle: (x: string) => void
}

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

  const translateOptions = (
    category: string,
    options: Record<string, string>
  ): Record<string, string> =>
    Object.fromEntries(
      Object.entries(options).map(([code, desc]) => [
        code,
        t(`${category}.${code}`, { defaultValue: desc }),
      ])
    )

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

  const categories: CategoryFilterEntry[] = [
    {
      key: "type",
      title: t("filter_meeting_type"),
      options: translateOptions("types", facetOptions.types),
      selected: filterParams.getAll("type") as Type[],
      onToggle: handleExclusiveToggle("type"),
    },
    {
      key: "formats",
      title: t("filter_formats"),
      options: translateOptions("formats", facetOptions.formats),
      selected: filterParams.getAll("formats") as Format[],
      onToggle: handleToggle("formats"),
    },
    {
      key: "features",
      title: t("filter_features"),
      options: translateOptions("features", facetOptions.features),
      selected: filterParams.getAll("features") as Feature[],
      onToggle: handleToggle("features"),
    },
    {
      key: "communities",
      title: t("filter_communities"),
      options: translateOptions("communities", facetOptions.communities),
      selected: filterParams.getAll("communities") as Community[],
      onToggle: handleToggle("communities"),
    },
    {
      key: "languages",
      title: t("filter_languages"),
      options: translateOptions("languages", facetOptions.languages),
      selected: filterParams.getAll("languages") as Language[],
      onToggle: handleToggle("languages"),
    },
  ]

  categories.forEach(({ key, title, options, selected, onToggle }) => {
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
            options={options}
            selected={selected}
            onToggle={onToggle}
          />
        </FilterSection>
      ) : (
        <CategoryFilter
          key={key}
          displayName={title}
          options={options}
          selected={selected}
          onToggle={onToggle}
        />
      )
    )
  })

  return groups
}
