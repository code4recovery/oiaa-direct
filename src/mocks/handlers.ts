import fs from "fs"
import {
  http,
  HttpResponse,
} from "msw"

import type { Meeting } from "@/meetingTypes"

const data = fs.readFileSync("src/mocks/test-meeting-data.json", "utf-8")
const meetings = JSON.parse(data) as Meeting[]

export const handlers = [
  http.get(
    "https://central-query.apps.code4recovery.org/api/v1/meetings/next",
    () => {
      return HttpResponse.json(meetings)
    }
  ),
]
