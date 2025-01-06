import { VStack, Heading, Box, Button, Text, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FaTimesCircle } from "react-icons/fa"
import type { Meeting } from "../components/meetings/types"
import { MeetingCard } from "../components/meetings/MeetingCard"
import { Layout } from "../components/layout/Layout"
import { SearchInput } from "../components/ui/SearchInput"
import { TypeFilter } from "../components/ui/TypeFilter"
import { MEETING_TYPES } from "../components/meetings/meetingTypes"

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const hasActiveFilters = searchQuery || selectedTypes.length > 0

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
  }

  useEffect(() => {
    const apiUrl = 'https://central-query.apps.code4recovery.org/api/v1/meetings/next'
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`

    fetch(proxyUrl)
      .then(async res => {
        const text = await res.text()
        if (!text) throw new Error('Empty response')
        return JSON.parse(text)
      })
      .then(data => setMeetings(data))
      .catch(error => console.error('Error fetching meetings:', error))
  }, [])

  const handleToggleType = (type: string) => {
    setSelectedTypes(current => 
      current.includes(type) 
        ? current.filter(t => t !== type)
        : [...current, type]
    )
  }

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = searchQuery === "" || 
      meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedTypes.length === 0 ||
      selectedTypes.some(type => meeting.types.includes(type))

    return matchesSearch && matchesType
  })

  return (
    <Layout
      sidebar={
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="lg"
          bg="white"
          mt={14}
          _dark={{
            bg: 'gray.800',
            borderColor: 'whiteAlpha.300'
          }}
        >
          <VStack gap={4} align="stretch">
            <Heading 
              size="md"
              color="inherit"
              _dark={{
                color: 'inherit'
              }}
            >
              Filters
            </Heading>
            <SearchInput 
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <Box>
              <Heading 
                size="sm" 
                mb={2}
                color="inherit"
                _dark={{
                  color: 'inherit'
                }}
              >
                Meeting Types
              </Heading>
              <TypeFilter
                types={MEETING_TYPES}
                selectedTypes={selectedTypes}
                onToggleType={handleToggleType}
              />
            </Box>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="gray"
                onClick={clearFilters}
                color="gray.600"
                _dark={{
                  color: 'gray.200',
                  _hover: { bg: 'whiteAlpha.200' }
                }}
              >
                <Flex align="center" gap={2}>
                  <FaTimesCircle />
                  <Text>Clear Filters</Text>
                </Flex>
              </Button>
            )}
          </VStack>
        </Box>
      }
    >
      <VStack gap={8} align="stretch">
        <Heading size="lg">
          Meetings
          {hasActiveFilters && (
            <Text as="span" fontSize="md" color="gray.500" ml={2}>
              ({filteredMeetings.length} results)
            </Text>
          )}
        </Heading>
        <VStack gap={6} align="stretch">
          {filteredMeetings.map(meeting => (
            <MeetingCard key={meeting.slug} meeting={meeting} />
          ))}
        </VStack>
      </VStack>
    </Layout>
  )
}
