import {
  Flex,
  Switch,
  Text,
} from "@chakra-ui/react"

interface ScheduledFilterProps {
  showScheduled: boolean
  onChange: (showScheduled: boolean) => void
}

export function ScheduledFilter({ showScheduled, onChange }: ScheduledFilterProps) {
  return (
    <Flex gap={8} alignItems="center" justifyContent="center" px={3}>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color={showScheduled ? "gray.900" : "gray.500"}
        _dark={{
          color: showScheduled ? "gray.100" : "gray.500",
        }}
      >
        Scheduled
      </Text>
      <Switch.Root
        size="lg"
        checked={showScheduled}
        onCheckedChange={(e) => { onChange(e.checked); }}
        colorPalette="blue"
        css={{ transform: 'scaleX(-1)' }}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color={showScheduled ? "gray.500" : "gray.900"}
        _dark={{
          color: showScheduled ? "gray.500" : "gray.100",
        }}
      >
        Ongoing
      </Text>
    </Flex>
  )
}
