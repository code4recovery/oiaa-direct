import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Box, Spinner } from "@chakra-ui/react"
import { Layout } from "@/components/Layout"
import { Filter } from "@/components/Filter"
import { MeetingCard } from "@/components/meeting/MeetingCard"
import { getMeetings } from "@/utils/getMeetings"
import type { Meeting } from "@/meetings-utils"

export default function MeetingsFiltered() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true)
      try {
        const data = await getMeetings(searchParams)
        setMeetings(data)
      } catch (error) {
        console.error('Failed to fetch meetings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [searchParams])

  return (
    <Layout
      sidebar={
        <Filter
          onFilterChange={setSearchParams}
        />
      }
    >
      {loading ? (
        <Box display="flex" justifyContent="center" p={8}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={4}>
          {meetings.map((meeting) => (
            <MeetingCard 
              key={meeting.slug} 
              meeting={meeting} 
            />
          ))}
        </Box>
      )}
    </Layout>
  )
}
