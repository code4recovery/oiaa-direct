import {
  FaEnvelope,
  FaExternalLinkAlt,
  FaLink,
  FaVideo,
} from "react-icons/fa"

import { Tooltip } from "@/components/ui/tooltip"
import type { Meeting } from "@/meetingTypes"
import { getServiceProviderNameFromUrl } from "@/utils/videoServices"
import {
  Button,
  Flex,
  IconButton,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"

export interface MeetingActionsProps {
  meeting: Meeting
  layout?: 'horizontal' | 'vertical' | 'auto'
  mode?: 'full' | 'compact' | 'icon-only'
  size?: 'xs' | 'sm' | 'md'
  joinVariant?: 'solid' | 'outline' | 'ghost'
  secondaryVariant?: 'outline' | 'ghost'
  forceMode?: 'full' | 'compact' | 'icon-only'
}


const getVideoServiceInfo = (url: string) => {
  const result = getServiceProviderNameFromUrl(url)
  if (result.isOk()) {
    const serviceName = result.unwrap()
    return {
      name: serviceName,
      icon: FaVideo, 
    }
  }
  return {
    name: 'Join Meeting',
    icon: FaVideo,
  }
}


const JoinButton = ({
  meeting,
  mode,
  size = 'md',
  variant = 'solid',
}: {
  meeting: Meeting
  mode: 'full' | 'compact' | 'icon-only'
  size?: 'xs' | 'sm' | 'md'
  variant?: 'solid' | 'outline' | 'ghost'
}) => {
  if (!meeting.conference_url) return null

  const videoInfo = getVideoServiceInfo(meeting.conference_url)
  const IconComponent = videoInfo.icon

  const buttonProps = {
    colorScheme: 'blue',
    variant,
    size,
    minH: size === 'xs' ? '32px' : size === 'sm' ? '40px' : '44px',
    onClick: () => window.open(meeting.conference_url, '_blank', 'noopener,noreferrer'),
    color: variant === 'solid' ? 'white' : 'blue.600',
    _dark: { 
      color: variant === 'solid' ? 'white' : 'blue.300' 
    },
  }

  if (mode === 'icon-only') {
    return (
      <Tooltip content={`Join ${videoInfo.name}`}>
        <IconButton
          {...buttonProps}
          aria-label={`Join ${videoInfo.name}`}
        >
          <IconComponent />
        </IconButton>
      </Tooltip>
    )
  }

  const label = mode === 'compact' ? 'Join' : `Join ${videoInfo.name}`
  
  return (
    <Button {...buttonProps}>
      <IconComponent style={{ marginRight: mode === 'compact' ? '4px' : '8px' }} />
      {label}
    </Button>
  )
}


const EmailButton = ({
  email,
  mode,
  size = 'md',
  variant = 'outline',
}: {
  email: string
  mode: 'full' | 'compact' | 'icon-only'
  size?: 'xs' | 'sm' | 'md'
  variant?: 'outline' | 'ghost'
}) => {
  const buttonProps = {
    colorScheme: 'gray',
    variant,
    size,
    minH: size === 'xs' ? '32px' : size === 'sm' ? '40px' : '44px',
    onClick: () => window.location.href = `mailto:${email}`,
    color: 'gray.600',
    _dark: { 
      color: 'gray.300' 
    },
  }

  if (mode === 'icon-only') {
    return (
      <Tooltip content="Send Email">
        <IconButton
          {...buttonProps}
          aria-label="Send Email"
        >
          <FaEnvelope />
        </IconButton>
      </Tooltip>
    )
  }

  const label = mode === 'compact' ? 'Email' : 'Email Group'

  return (
    <Button {...buttonProps}>
      <FaEnvelope style={{ marginRight: mode === 'compact' ? '4px' : '8px' }} />
      {label}
    </Button>
  )
}

const WebsiteButton = ({
  url,
  mode,
  size = 'md', 
  variant = 'outline',
}: {
  url: string
  mode: 'full' | 'compact' | 'icon-only'
  size?: 'xs' | 'sm' | 'md'
  variant?: 'outline' | 'ghost'
}) => {
  const buttonProps = {
    colorScheme: 'gray',
    variant,
    size,
    minH: size === 'xs' ? '32px' : size === 'sm' ? '40px' : '44px',
    onClick: () => window.open(url, '_blank', 'noopener,noreferrer'),
    color: 'gray.600',
    _dark: { 
      color: 'gray.300' 
    },
  }

  if (mode === 'icon-only') {
    return (
      <Tooltip content="Visit Website">
        <IconButton
          {...buttonProps}
          aria-label="Visit Website"
        >
          <FaExternalLinkAlt />
        </IconButton>
      </Tooltip>
    )
  }

  const label = mode === 'compact' ? 'Website' : 'Visit Website'

  return (
    <Button {...buttonProps}>
      <FaLink style={{ marginRight: mode === 'compact' ? '4px' : '8px' }} />
      {label}
    </Button>
  )
}

export const MeetingActions = ({
  meeting,
  layout = 'auto',
  mode,
  size = 'sm',
  joinVariant = 'solid',
  secondaryVariant = 'outline',
  forceMode,
}: MeetingActionsProps) => {
  

  const responsiveMode = useBreakpointValue({
    base: 'icon-only' as const,
    sm: 'compact' as const,
    md: 'compact' as const,
    lg: 'full' as const,
  })

  const effectiveMode = forceMode ?? mode ?? responsiveMode ?? 'compact'


  const responsiveLayout = useBreakpointValue({
    base: 'horizontal' as const,
    sm: 'horizontal' as const,
    md: 'horizontal' as const,
  })

  const effectiveLayout = layout === 'auto' ? responsiveLayout ?? 'horizontal' : layout


  const hasJoin = Boolean(meeting.conference_url)
  const hasEmail = Boolean(meeting.groupEmail)
  const hasWebsite = Boolean(meeting.groupWebsite)


  if (!hasJoin && !hasEmail && !hasWebsite) {
    return null
  }

  const renderActions = () => {
    const actions = []

    if (hasJoin) {
      actions.push(
        <JoinButton
          key="join"
          meeting={meeting}
          mode={effectiveMode}
          size={size}
          variant={joinVariant}
        />
      )
    }

    if (hasEmail) {
      actions.push(
        <EmailButton
          key="email"
          email={meeting.groupEmail ?? ''}
          mode={effectiveMode}
          size={size}
          variant={secondaryVariant}
        />
      )
    }

    if (hasWebsite) {
      actions.push(
        <WebsiteButton
          key="website"
          url={meeting.groupWebsite ?? ''}
          mode={effectiveMode}
          size={size}
          variant={secondaryVariant}
        />
      )
    }

    return actions
  }

  const actions = renderActions()

  if (effectiveLayout === 'vertical') {
    return (
      <VStack gap={2} align="stretch">
        {actions}
      </VStack>
    )
  }

  return (
    <Flex 
      gap={2} 
      wrap="wrap" 
      align="center"
      justify={{ base: 'center', sm: 'flex-start' }}
    >
      {actions}
    </Flex>
  )
}

export default MeetingActions