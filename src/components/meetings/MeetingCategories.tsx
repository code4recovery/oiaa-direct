import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FaPlus } from "react-icons/fa"

import { Tooltip } from "@/components/ui/tooltip"
import type { Meeting } from "@/meetingTypes"
import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  LANGUAGES,
  TYPE,
} from "@/meetingTypes"

const DESCRIPTIONS: Record<string, string> = {
  ...TYPE,
  ...FORMATS,
  ...FEATURES,
  ...COMMUNITIES,
  ...LANGUAGES,
}

const CATEGORY_COLORS = {
  features: "purple",
  formats: "blue",
  languages: "green",
  communities: "orange",
  type: "cyan",
} as const

export interface MeetingCategoriesProps {
  /** Meeting data containing all categories */
  meeting: Meeting
  /** Maximum number of badges to show before overflow */
  maxVisible?: number
  /** Badge size */
  size?: 'sm' | 'md'
  /** Layout mode */
  layout?: 'wrap' | 'scroll' | 'limited'
  /** Show category names or just abbreviations */
  showFullNames?: boolean
  /** Override responsive maxVisible behavior */
  forceMaxVisible?: number
}

/**
 * Gets all category items from a meeting with their metadata
 */
const getCategoryItems = (meeting: Meeting) => {
  const items: Array<{
    key: string
    value: string
    category: keyof typeof CATEGORY_COLORS
    fullName: string
  }> = []

  // Process each category type
  const categories = ["type", "formats", "features", "communities", "languages"] as const
  
  categories.forEach((category) => {
    const value = meeting[category]
    if (!value) return
    
    const items_array = Array.isArray(value) ? value : [value]
    items_array.forEach((item: string) => {
      items.push({
        key: `${category}-${item}`,
        value: item,
        category,
        fullName: DESCRIPTIONS[item] || item.toUpperCase(),
      })
    })
  })

  return items
}

/**
 * Smart badge component with tooltip
 */
const CategoryBadge = ({ 
  item, 
  size = 'sm',
  showFullName = false,
}: { 
  item: ReturnType<typeof getCategoryItems>[0]
  size?: 'sm' | 'md'
  showFullName?: boolean
}) => {
  const displayText = showFullName ? item.fullName : item.value.toUpperCase()
  
  return (
    <Tooltip content={item.fullName}>
      <Badge
        colorScheme={CATEGORY_COLORS[item.category]}
        variant="subtle"
        size={size}
        px={size === 'sm' ? 2 : 3}
        py={1}
        borderRadius="full"
        fontSize={size === 'sm' ? 'xs' : 'sm'}
        fontWeight="medium"
        cursor="help"
      >
        {displayText}
      </Badge>
    </Tooltip>
  )
}

/**
 * Overflow indicator with popover showing remaining badges
 */
const OverflowIndicator = ({ 
  hiddenItems, 
  size = 'sm',
  showFullNames = false,
}: { 
  hiddenItems: ReturnType<typeof getCategoryItems>
  size?: 'sm' | 'md'
  showFullNames?: boolean
}) => {
  return (
    <PopoverRoot positioning={{ placement: "top" }}>
      <PopoverTrigger asChild>
        <Button
          size={size === 'sm' ? 'xs' : 'sm'}
          variant="ghost"
          colorScheme="gray"
          px={2}
          py={1}
          h="auto"
          minH={size === 'sm' ? "24px" : "28px"}
          borderRadius="full"
          fontSize={size === 'sm' ? 'xs' : 'sm'}
          fontWeight="medium"
          _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
        >
          <FaPlus style={{ marginRight: "4px", fontSize: "10px" }} />
          {hiddenItems.length}
        </Button>
      </PopoverTrigger>
      <PopoverContent width="auto" maxW="300px">
        <PopoverBody p={3}>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Additional Categories:
          </Text>
          <Flex wrap="wrap" gap={1}>
            {hiddenItems.map((item) => (
              <CategoryBadge 
                key={item.key}
                item={item} 
                size={size}
                showFullName={showFullNames}
              />
            ))}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

export const MeetingCategories = ({
  meeting,
  maxVisible,
  size = 'sm',
  layout = 'limited',
  showFullNames = false,
  forceMaxVisible,
}: MeetingCategoriesProps) => {
  const allItems = getCategoryItems(meeting)
  
  // Responsive max visible badges
  const responsiveMaxVisible = useBreakpointValue({
    base: 3,  // Mobile: show only 3 badges
    sm: 4,    // Small tablet: 4 badges  
    md: 6,    // Desktop: 6 badges
    lg: 8,    // Large desktop: 8 badges
  })

  const effectiveMaxVisible = forceMaxVisible || maxVisible || responsiveMaxVisible || 3

  // Early return for no categories
  if (allItems.length === 0) {
    return null
  }

  // Layout: wrap - show all badges with wrapping
  if (layout === 'wrap') {
    return (
      <Flex wrap="wrap" gap={1}>
        {allItems.map((item) => (
          <CategoryBadge 
            key={item.key}
            item={item} 
            size={size}
            showFullName={showFullNames}
          />
        ))}
      </Flex>
    )
  }

  // Layout: scroll - horizontal scrolling container
  if (layout === 'scroll') {
    return (
      <Box
        overflowX="auto"
        overflowY="hidden"
        pb={1} // Space for scrollbar
        css={{
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '4px',
          },
        }}
      >
        <Flex gap={1} minW="fit-content">
          {allItems.map((item) => (
            <CategoryBadge 
              key={item.key}
              item={item} 
              size={size}
              showFullName={showFullNames}
            />
          ))}
        </Flex>
      </Box>
    )
  }

  // Layout: limited (default) - show limited badges with overflow indicator
  const visibleItems = allItems.slice(0, effectiveMaxVisible)
  const hiddenItems = allItems.slice(effectiveMaxVisible)

  return (
    <Flex align="center" gap={1} wrap="wrap">
      {visibleItems.map((item) => (
        <CategoryBadge 
          key={item.key}
          item={item} 
          size={size}
          showFullName={showFullNames}
        />
      ))}
      {hiddenItems.length > 0 && (
        <OverflowIndicator 
          hiddenItems={hiddenItems}
          size={size}
          showFullNames={showFullNames}
        />
      )}
    </Flex>
  )
}

export default MeetingCategories