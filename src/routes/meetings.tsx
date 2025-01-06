import { VStack, Grid, Heading } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import type { Meeting } from "../components/meetings/types"
import { MeetingCard } from "../components/meetings/MeetingCard"

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])

  useEffect(() => {
    const apiUrl = 'https://central-query.apps.code4recovery.org/api/v1/meetings/next'
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`

    fetch(proxyUrl)
      .then(async res => {
        const text = await res.text()
        if (!text) throw new Error('Empty response')
        return JSON.parse(text)
      })
      .then(data => {
        console.log('Meetings data:', data)
        setMeetings(data)
      })
      .catch(error => console.error('Error fetching meetings:', error))
  }, [])

  return (
    <VStack as="main" gap={8} align="stretch" p={4}>
      <Heading size="lg">Meetings</Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)"
        }}
        gap={6}
      >
        {meetings.map(meeting => (
          <MeetingCard key={meeting.slug} meeting={meeting} />
        ))}
      </Grid>
    </VStack>
  )
}
