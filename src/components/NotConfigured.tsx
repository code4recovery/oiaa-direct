import { useTranslation } from "react-i18next"

import {
  Box,
  Text,
} from "@chakra-ui/react"

/**
 * Shown in WordPress when the plugin's "API URL" setting is empty.
 * The app makes no API request in that case.
 */
export function NotConfigured() {
  const { t } = useTranslation()
  return (
    <Box
      p={3}
      borderRadius="md"
      bg="orange.50"
      color="orange.800"
      _dark={{ bg: "orange.900", color: "orange.100" }}
    >
      <Text>{t("not_configured")}</Text>
    </Box>
  )
}
