import type { SetURLSearchParams } from "react-router"

import { FilterContainer } from "./FilterContainer"

interface FilterProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  sendQueryToParent?: (x: string) => void 
}

export function Filter({
  filterParams,
  sendFilterSelectionsToParent,
}: FilterProps) {
  return (
    <FilterContainer
      filterParams={filterParams}
      sendFilterSelectionsToParent={sendFilterSelectionsToParent}
      variant="desktop"
      showSearch={true}
      showTimeFilter={true}
      showClearButton={true}
      collapsible={false}
    />
  )
}
