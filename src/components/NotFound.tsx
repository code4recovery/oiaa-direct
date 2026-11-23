import { FaArrowLeft } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import { Link as RouterLink } from "react-router"

import { Layout } from "@/components/Layout"
import {
  Box,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react"

export function BackToMeetings() {
  const { t } = useTranslation()
  return (
    <RouterLink to="/">
      <Button size="sm" variant="outline" colorPalette="blue">
        <FaArrowLeft style={{ marginRight: "8px" }} />
        {t("back_to_meetings")}
      </Button>
    </RouterLink>
  )
}

/**
 * "Meeting not found" for a slug Central-Query doesn't have (deleted meeting, old or mistyped link),
 * "Page not found" for an address that matches no route.
 */
export function NotFound({ what }: { what: "meeting" | "page" }) {
  const { t } = useTranslation()
  return (
    <Layout>
      <Box textAlign="center" py={8}>
        <Heading size="lg" mb={3}>
          {t(what === "meeting" ? "meeting_not_found" : "page_not_found")}
        </Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }} mb={6}>
          {t(what === "meeting" ? "meeting_not_found_text" : "page_not_found_text")}
        </Text>
        <BackToMeetings />
      </Box>
    </Layout>
  )
}
