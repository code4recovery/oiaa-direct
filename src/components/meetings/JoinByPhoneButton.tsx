import { FaPhoneAlt } from "react-icons/fa"

import {
  Box,
  Button,
  Link,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

import { telHref } from "@/utils/phone"

interface JoinByPhoneButtonProps {
  phone: string
}

const JoinByPhoneButton = ({ phone }: JoinByPhoneButtonProps) => {
  const { t } = useTranslation()
  const href = telHref(phone)
  if (!href) return null

  return (
    <Box as="span" display="inline-block" mr={2} verticalAlign="middle">
      <Link
        href={href}
        title={t("call_phone", { phone })}
        _hover={{ textDecoration: "none" }}
      >
        <Button
          bg="blue.700"
          color="white"
          size="md"
          width="full"
          _hover={{ bg: "blue.800" }}
        >
          <FaPhoneAlt style={{ marginRight: "8px" }} />
          {t("join_by_phone")}
        </Button>
      </Link>
    </Box>
  )
}

export default JoinByPhoneButton
