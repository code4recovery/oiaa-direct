import {
  FaGlasses,
  FaVideo,
} from "react-icons/fa"

import {
  Button,
  Link,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

import { getServiceProviderNameFromUrl } from "@/utils/videoServices"

interface JoinMeetingButtonProps{
  joinUrl: string
}

const JoinMeetingButton = ({ joinUrl }: JoinMeetingButtonProps) => {
  const { t } = useTranslation()
  const result = getServiceProviderNameFromUrl(joinUrl)
  const label = result.isOk()
    ? t("join_service_meeting", { service: result.value })
    : t("join_meeting")
  const Icon = result.isOk() && result.value === "Virtual Reality" ? FaGlasses : FaVideo
  
  return (
    <Link
      href={joinUrl}
      target="_blank"
      rel="noopener noreferrer"
      _hover={{ textDecoration: "none" }}
    >
      <Button
        bg="blue.700"
        color="white"
        size="md"
        width="full"
        _hover={{ bg: "blue.800" }}
      >
        <Icon style={{ marginRight: "8px" }} />
        {label}
      </Button>
    </Link>
  )
}

export default JoinMeetingButton
