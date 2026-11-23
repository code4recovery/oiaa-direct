import {
  http,
  HttpResponse,
} from "msw"
import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"

import { server } from "@/mocks/server"
import { clientLoader as groupInfoLoader } from "@/routes/group-info"
import { clientLoader as meetingsLoader } from "@/routes/meetings-filtered"
import { logError } from "@/utils/logger"
import {
  ApiError,
  fetchData,
  isNotFound,
} from "@/utils/meetings-utils"

vi.mock("@/utils/logger", () => ({ logError: vi.fn() }))

const API = "https://central-query.apps.code4recovery.org/api/v1/meetings"

const answer404 = () => new HttpResponse("Sorry, can't find that!", { status: 404 })
const answer500 = () => new HttpResponse("Internal Server Error", { status: 500 })

// The loaders' first argument; only the fields they read.
const loaderArgs = (url: string, params = {}) =>
  ({ request: new Request(url), params }) as never

beforeEach(() => {
  vi.mocked(logError).mockClear()
})

describe("fetchData", () => {
  test("throws an ApiError with the status on 404", async () => {
    server.use(http.get(`${API}/no-such-meeting`, answer404))
    const error = await fetchData(`${API}/no-such-meeting`).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(404)
    expect(isNotFound(error)).toBe(true)
  })

  test("throws an ApiError with the status on 500", async () => {
    server.use(http.get(`${API}/facets`, answer500))
    const error = await fetchData(`${API}/facets`).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(500)
    expect(isNotFound(error)).toBe(false)
  })

  test("throws an ApiError without a status on a network error", async () => {
    server.use(http.get(`${API}/facets`, () => HttpResponse.error()))
    const error = await fetchData(`${API}/facets`).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBeUndefined()
  })

  test("throws an ApiError when the answer isn't JSON", async () => {
    server.use(http.get(`${API}/facets`, () => new HttpResponse("<html>", { status: 200 })))
    const error = await fetchData(`${API}/facets`).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(200)
  })

  test("leaves the query string out of the message", async () => {
    server.use(http.get(`${API}/`, answer500))
    const error = await fetchData(`${API}/?nameQuery=private`).catch((e: unknown) => e)
    expect((error as ApiError).message).not.toContain("private")
  })
})

describe("group-info loader", () => {
  test("returns found: false when the API answers 404 for the slug", async () => {
    server.use(
      http.get(`${API}/no-such-meeting`, answer404),
      http.get(`${API}/no-such-meeting/related-group-info`, answer404)
    )
    const result = await groupInfoLoader(
      loaderArgs("http://localhost/group-info/no-such-meeting", { slug: "no-such-meeting" })
    )
    expect(result).toEqual({ found: false })
  })

  test("throws on a 500, so the route's error page shows", async () => {
    server.use(
      http.get(`${API}/some-meeting`, answer500),
      http.get(`${API}/some-meeting/related-group-info`, answer500)
    )
    await expect(
      groupInfoLoader(loaderArgs("http://localhost/group-info/some-meeting", { slug: "some-meeting" }))
    ).rejects.toBeInstanceOf(ApiError)
  })

  test("returns the meeting and group when both calls succeed", async () => {
    const group = { groupInfo: { _id: "g1", name: "Group" }, groupMeetings: [] }
    server.use(
      http.get(`${API}/a-meeting`, () => HttpResponse.json({ slug: "a-meeting", name: "A" })),
      http.get(`${API}/a-meeting/related-group-info`, () => HttpResponse.json(group))
    )
    const result = await groupInfoLoader(
      loaderArgs("http://localhost/group-info/a-meeting", { slug: "a-meeting" })
    )
    expect(result).toMatchObject({ found: true, meeting: { slug: "a-meeting" }, group })
  })
})

describe("meetings list loader", () => {
  test("says the load failed instead of returning an empty list, and logs it", async () => {
    server.use(http.get(`${API}/`, answer500))
    const result = await meetingsLoader(loaderArgs("http://localhost/?nameQuery=down"))
    expect(result).toEqual({ meetings: [], loadFailed: true })
    expect(logError).toHaveBeenCalledOnce()
  })

  test("doesn't cache a failure: the next call (Retry) asks the API again", async () => {
    server.use(http.get(`${API}/`, answer500, { once: true }))
    const url = "http://localhost/?nameQuery=retry"
    const first = await meetingsLoader(loaderArgs(url))
    expect(first.loadFailed).toBe(true)
    const second = await meetingsLoader(loaderArgs(url))
    expect(second.loadFailed).toBe(false)
    expect(second.meetings).toHaveLength(3)
  })

  test("a 200 answer that isn't a list is a failure, and isn't cached", async () => {
    server.use(http.get(`${API}/`, () => HttpResponse.json({}), { once: true }))
    const url = "http://localhost/?nameQuery=not-a-list"
    expect(await meetingsLoader(loaderArgs(url))).toEqual({ meetings: [], loadFailed: true })
    const second = await meetingsLoader(loaderArgs(url))
    expect(second.loadFailed).toBe(false)
    expect(second.meetings).toHaveLength(3)
  })

  test("an empty answer is still 'no results', not a failure", async () => {
    server.use(http.get(`${API}/`, () => HttpResponse.json([])))
    const result = await meetingsLoader(loaderArgs("http://localhost/?nameQuery=nothing"))
    expect(result).toEqual({ meetings: [], loadFailed: false })
    expect(logError).not.toHaveBeenCalled()
  })
})
