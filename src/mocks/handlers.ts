import fs from 'fs'
import {
  http,
  HttpResponse,
} from 'msw'

import type { Meeting } from '@/meetings-utils'

const data = fs.readFileSync("src/mocks/central-exp.meeting.json")
const meetings = JSON.parse(data) as Meeting[]

export const handlers = [
  http.get(
    "https://central-query.apps.code4recovery.org/api/v1/meetings/next",
    () => {
      return HttpResponse.json(meetings)
    }
  ),
]
