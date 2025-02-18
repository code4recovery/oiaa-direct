import type { Meeting } from "@/meetings-utils"
import { hasCategoryValue } from "@/meetings-utils"

export async function getMeetings(searchParams: URLSearchParams): Promise<Meeting[]> {
  // Fetch all meetings
  const response = await fetch('https://central-query.apps.code4recovery.org/api/v1/meetings/next')
  if (!response.ok) {
    throw new Error('Failed to fetch meetings')
  }
  
  let meetings = await response.json() as Meeting[]
  
  // Apply filters based on URL parameters
  for (const [category, value] of searchParams.entries()) {
    switch(category) {
      case 'type':
      case 'formats':
      case 'features':
      case 'communities':
        meetings = meetings.filter(meeting => 
          hasCategoryValue(meeting, category, value)
        )
        break
      case 'search':
        meetings = meetings.filter(meeting => 
          meeting.name.toLowerCase().includes(value.toLowerCase())
        )
        break
    }
  }

  return meetings
} 