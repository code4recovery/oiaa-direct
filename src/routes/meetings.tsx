import { VStack, Text, Box, Heading } from "@chakra-ui/react"
import { useEffect, useState } from "react"

interface Meeting {
  id: string
  name: string
  startDateUTC: string
  conference_url?: string
}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])

  useEffect(() => {
    const apiUrl = 'https://central-query.apps.code4recovery.org/api/v1/meetings/next'
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`

    fetch(proxyUrl)
      .then(async res => {
        console.log('Response status:', res.status)
        const text = await res.text()
        console.log('Response body:', text)
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
    <VStack as="main" gap={4} align="stretch" p={4}>
      <Heading size="lg">Meetings</Heading>
      <VStack as="section" gap={4} align="stretch">
        {meetings.map(meeting => (
          <Box key={meeting.id} p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md">{meeting.name}</Heading>
            <Text>{new Date(meeting.startDateUTC).toLocaleString()}</Text>
          </Box>
        ))}
      </VStack>
    </VStack>
  )
}
