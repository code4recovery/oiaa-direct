import { useTranslation } from "react-i18next"

import type { Meeting } from "@/meetingTypes"
import {
  type StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"

export interface JoinDetailsProps extends StackProps {
  meeting: Meeting
  size?: "sm" | "md"
}

/**
 * The join notes (meeting ID, passcode), the phone number and the phone notes.
 * The notes are plain text typed by meeting contacts: shown as text, never as HTML.
 */
export const JoinDetails = ({ meeting, size = "sm", ...rest }: JoinDetailsProps) => {
  const { t } = useTranslation()
  // Some stored values are only spaces.
  const conference_url_notes = meeting.conference_url_notes?.trim()
  const conference_phone = meeting.conference_phone?.trim()
  const conference_phone_notes = meeting.conference_phone_notes?.trim()

  if (!conference_url_notes && !conference_phone && !conference_phone_notes) {
    return null
  }

  const textProps = {
    fontSize: size,
    color: "gray.600",
    _dark: { color: "gray.400" },
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  } as const

  return (
    <VStack align="stretch" gap={1} {...rest}>
      {conference_url_notes && <Text {...textProps}>{conference_url_notes}</Text>}
      {conference_phone && (
        <Text {...textProps}>
          {t("phone_label")} <bdi>{conference_phone}</bdi>
        </Text>
      )}
      {conference_phone_notes && <Text {...textProps}>{conference_phone_notes}</Text>}
    </VStack>
  )
}

export default JoinDetails
