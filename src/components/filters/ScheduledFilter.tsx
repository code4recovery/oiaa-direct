import {
  Button,
  Flex,
} from "@chakra-ui/react"

interface ScheduledFilterProps {
  showScheduled: boolean
  onChange: (showScheduled: boolean) => void
}

export function ScheduledFilter({ showScheduled, onChange }: ScheduledFilterProps) {
  return (
    <Flex gap={2}>
      <Button
        size="sm"
        onClick={() => { onChange(true) }}
        flex={1}
        bg={showScheduled ? "#3182ce" : "transparent"}
        color={showScheduled ? "white" : "gray.600"}
        borderWidth={showScheduled ? "0" : "1px"}
        borderColor="gray.300"
        _hover={{ opacity: 0.8 }}
        _dark={{
          color: showScheduled ? "white" : "gray.400",
          borderColor: "gray.600",
        }}
      >
        Scheduled
      </Button>
      <Button
        size="sm"
        onClick={() => { onChange(false) }}
        flex={1}
        bg={showScheduled ? "transparent" : "#3182ce"}
        color={showScheduled ? "gray.600" : "white"}
        borderWidth={showScheduled ? "1px" : "0"}
        borderColor="gray.300"
        _hover={{ opacity: 0.8 }}
        _dark={{
          color: showScheduled ? "gray.400" : "white",
          borderColor: "gray.600",
        }}
      >
        Unscheduled
      </Button>
    </Flex>
  )
}
