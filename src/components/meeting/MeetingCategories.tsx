import { Badge, HStack, Tooltip } from "@chakra-ui/react"
import { TYPE, FORMATS, FEATURES, COMMUNITIES, CATEGORY_COLORS } from "@/meetingTypes"
import type { Meeting } from "@/meetings-utils"

interface MeetingCategoriesProps {
  meeting: Meeting
}

export const MeetingCategories = ({ meeting }: MeetingCategoriesProps) => {
  const categories = ['features', 'formats', 'languages', 'communities', 'type'] as const

  const getCategoryLabel = (category: string, value: string): string => {
    const categoryMaps: Record<string, Record<string, string>> = {
      features: FEATURES,
      formats: FORMATS,
      communities: COMMUNITIES,
      type: TYPE,
    }
    
    if (category === 'languages') return value
    return categoryMaps[category]?.[value] || value
  }

  return (
    <HStack wrap="wrap" gap={2}>
      {categories.map((category) => 
        meeting[category]?.map((item) => (
          <Badge
            key={`${category}-${item}`}
            colorScheme={CATEGORY_COLORS[category]}
            variant="subtle"
            px={2}
            py={1}
            borderRadius="full"
          >
            {item}
          </Badge>
        ))
      )}
    </HStack>
  )
} 