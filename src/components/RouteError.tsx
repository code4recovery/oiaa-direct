import { useEffect } from "react"

import { useTranslation } from "react-i18next"
import {
  useRevalidator,
  useRouteError,
} from "react-router"

import { Layout } from "@/components/Layout"
import { BackToMeetings } from "@/components/NotFound"
import { logError } from "@/utils/logger"
import {
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react"

/**
 * The error page for both route tables (routes.ts via routes/layout.tsx, and entry-wordpress.tsx).
 * Shown when a loader throws (Central-Query down or answering 500) or a page throws while rendering.
 * The error goes to Sentry through logError.
 */
export function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()
  const revalidator = useRevalidator()

  useEffect(() => {
    logError(error, "route error")
  }, [error])

  return (
    <Layout>
      <Box
        p={4}
        borderRadius="md"
        bg="orange.50"
        color="orange.800"
        _dark={{ bg: "orange.900", color: "orange.100" }}
      >
        <Text>{t("page_load_failed")}</Text>
        <Flex gap={2} mt={3} flexWrap="wrap">
          <Button
            size="sm"
            variant="outline"
            colorPalette="orange"
            onClick={() => void revalidator.revalidate()}
            loading={revalidator.state === "loading"}
          >
            {t("retry")}
          </Button>
          <BackToMeetings />
        </Flex>
      </Box>
    </Layout>
  )
}
