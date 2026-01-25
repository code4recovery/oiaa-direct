import { FaPlus } from "react-icons/fa"

import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Meeting } from "@/meetingTypes"
import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  LANGUAGES,
  TYPE,
} from "@/meetingTypes"
import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

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

  meeting: Meeting

  maxVisible?: number

  size?: 'sm' | 'md'

  layout?: 'wrap' | 'scroll' | 'limited'

  forceMaxVisible?: number
}


const getCategoryItems = (meeting: Meeting) => {
  const items: {
    key: string
    value: string
    category: keyof typeof CATEGORY_COLORS
    fullName: string
  }[] = []


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


const CategoryBadge = ({ 
  item, 
  size = 'sm',
}: { 
  item: ReturnType<typeof getCategoryItems>[0]
  size?: 'sm' | 'md'
}) => {
  
  return (
    <Badge
      colorScheme={CATEGORY_COLORS[item.category]}
      variant="subtle"
      size={size}
      px={size === 'sm' ? 2 : 3}
      py={1}
      borderRadius="full"
      fontSize={size === 'sm' ? 'xs' : 'sm'}
      fontWeight="medium"
    >
      {item.fullName}
    </Badge>
  )
}


const OverflowIndicator = ({ 
  hiddenItems, 
  size = 'sm',
}: { 
  hiddenItems: ReturnType<typeof getCategoryItems>
  size?: 'sm' | 'md'
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
  forceMaxVisible,
}: MeetingCategoriesProps) => {
  const allItems = getCategoryItems(meeting)
  

  const responsiveMaxVisible = useBreakpointValue({
    base: 3,  
    sm: 4,    
    md: 6,    
    lg: 8,    
  })

  const effectiveMaxVisible = forceMaxVisible ?? maxVisible ?? responsiveMaxVisible ?? 3


  if (allItems.length === 0) {
    return null
  }


  if (layout === 'wrap') {
    return (
      <Flex wrap="wrap" gap={1}>
        {allItems.map((item) => (
          <CategoryBadge 
            key={item.key}
            item={item} 
            size={size}
          />
        ))}
      </Flex>
    )
  }


  if (layout === 'scroll') {
    return (
      <Box
        overflowX="auto"
        overflowY="hidden"
        pb={1} 
        css={{
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--chakra-colors-gray-300)',
            borderRadius: '4px',
          },
          '.dark &::-webkit-scrollbar-thumb': {
            background: 'var(--chakra-colors-gray-600)',
          },
        }}
      >
        <Flex gap={1} minW="fit-content">
          {allItems.map((item) => (
            <CategoryBadge 
              key={item.key}
              item={item} 
              size={size}
            />
          ))}
        </Flex>
      </Box>
    )
  }


  const visibleItems = allItems.slice(0, effectiveMaxVisible)
  const hiddenItems = allItems.slice(effectiveMaxVisible)

  return (
    <Flex align="center" gap={1} wrap="wrap">
      {visibleItems.map((item) => (
        <CategoryBadge 
          key={item.key}
          item={item} 
          size={size}
        />
      ))}
      {hiddenItems.length > 0 && (
        <OverflowIndicator 
          hiddenItems={hiddenItems}
          size={size}
        />
      )}
    </Flex>
  )
}

export default MeetingCategories