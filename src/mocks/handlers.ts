import fs from "fs"
import {
  http,
  HttpResponse,
} from "msw"

import type { Meeting } from "@/meetingTypes"

const data = fs.readFileSync("src/mocks/test-meeting-data.json", "utf-8")
const meetings = JSON.parse(data) as Meeting[]

export const handlers = [
  // Handle the exact URL used by the tests and application
  http.get(
    "https://central-query.apps.code4recovery.org/api/v1/meetings/next",
    () => {
      return HttpResponse.json(meetings)
    }
  ),
  // Handle URLs with query parameters (used by tests)
  http.get(
    "https://central-query.apps.code4recovery.org/api/v1/meetings/",
    () => {
      return HttpResponse.json(meetings)
    }
  ),
  // Handle the base URL without query params
  http.get(
    "https://central-query.apps.code4recovery.org/api/v1/meetings",
    () => {
      return HttpResponse.json(meetings)
    }
  ),
]
