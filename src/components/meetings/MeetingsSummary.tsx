import { useTranslation } from "react-i18next"

import { getMeetingsSummary } from "@/utils/meetings-utils"
import {
  Box,
  Heading,
  Text,
} from "@chakra-ui/react"

export interface MeetingsSummaryProps {
  shownCount: number
  totalMeetings: number
}

export function MeetingsSummary({
  shownCount,
  totalMeetings,
}: MeetingsSummaryProps) {
  const { t } = useTranslation()
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg="white"
      _dark={{ bg: "gray.800" }}
      py={4}
      mb={4}
    >
      <Heading as="h2" size="lg">
        {t("meetings")}
        <Text
          as="span"
          fontSize="md"
          color="gray.500"
          _dark={{ color: "gray.400" }}
          ml={2}
          fontWeight="normal"
        >
          {getMeetingsSummary(t, totalMeetings, shownCount)}
        </Text>
      </Heading>
    </Box>
  )
}
