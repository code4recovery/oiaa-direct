import type { SetURLSearchParams } from "react-router"

import { FilterContainer } from "./FilterContainer"

export interface MobileFiltersProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  totalMeetings: number
  shownMeetings: number
}

export const MobileFilters = ({
  filterParams,
  sendFilterSelectionsToParent,
  totalMeetings,
  shownMeetings,
}: MobileFiltersProps) => {
  return (
    <FilterContainer
      filterParams={filterParams}
      sendFilterSelectionsToParent={sendFilterSelectionsToParent}
      variant="mobile"
      totalMeetings={totalMeetings}
      shownMeetings={shownMeetings}
      showSearch={true}
      showTimeFilter={true}
      showClearButton={true}
      collapsible={true}
    />
  )
}

export default MobileFilters