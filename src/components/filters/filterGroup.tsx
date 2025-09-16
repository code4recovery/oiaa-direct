import React from "react"

import type {
  Community,
  Feature,
  Format,
  Language,
  Type,
} from "@/meetingTypes"
import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  LANGUAGES,
  TYPE,
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
}: RenderFilterGroupsProps) {
  const groups: React.ReactNode[] = []

  if (showTimeFilter) {
    groups.push(
      isMobile ? (
        <FilterSection
          key="time"
          title="Day & Time"
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
      title: "Meeting Type",
      options: TYPE as Record<Type, string | string[]>,
      selected: filterParams.getAll("type") as Type[],
      onToggle: handleExclusiveToggle("type"),
    },
    {
      key: "formats",
      title: "Formats",
      options: FORMATS as Record<Format, string | string[]>,
      selected: filterParams.getAll("formats") as Format[],
      onToggle: handleToggle("formats"),
    },
    {
      key: "features",
      title: "Features",
      options: FEATURES as Record<Feature, string | string[]>,
      selected: filterParams.getAll("features") as Feature[],
      onToggle: handleToggle("features"),
    },
    {
      key: "communities",
      title: "Communities",
      options: COMMUNITIES as Record<Community, string | string[]>,
      selected: filterParams.getAll("communities") as Community[],
      onToggle: handleToggle("communities"),
    },
    {
      key: "languages",
      title: "Languages",
      options: LANGUAGES as Record<Language, string | string[]>,
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
