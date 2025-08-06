import {
  FaGlasses,
  FaVideo,
} from "react-icons/fa"

import {
  Button,
  Link,
} from "@chakra-ui/react"

import { getServiceProviderNameFromUrl } from "@/utils/videoServices"

interface JoinMeetingButtonProps{
  joinUrl: string
}

const JoinMeetingButton = ({ joinUrl }: JoinMeetingButtonProps) => {
  const result = getServiceProviderNameFromUrl(joinUrl)
  const label = result.isOk() ? `Join ${result.value} Meeting` : "Join Meeting"
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
