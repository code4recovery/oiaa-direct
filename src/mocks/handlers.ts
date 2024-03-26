import fs from "fs"
import { http, HttpResponse } from "msw"

const data = fs.readFileSync("src/mocks/central-exp.meeting.json")
const meetings = JSON.parse(data)

export const handlers = [
  http.get(
    "https://central-query.apps.code4recovery.org/api/v1/meetings/next",
    () => {
      return HttpResponse.json(meetings)
    }
  ),
]
