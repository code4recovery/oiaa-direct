import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"

import {
  getApiUrl,
  getMeetings,
} from "./getData"

const BUILD_URL = "https://build-time.example.org/api/v1/meetings"
const WP_URL = "https://wordpress-setting.example.org/api/v1/meetings"

describe("getApiUrl", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CQ_URL", BUILD_URL)
  })

  afterEach(() => {
    delete window.OIAA_CONFIG
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  test("uses the WordPress setting when it is set", () => {
    window.OIAA_CONFIG = { apiUrl: WP_URL }
    expect(getApiUrl()).toBe(WP_URL)
  })

  test("returns undefined in WordPress when the setting is empty", () => {
    window.OIAA_CONFIG = { apiUrl: "" }
    expect(getApiUrl()).toBeUndefined()
  })

  test("returns undefined in WordPress when the setting is only spaces", () => {
    window.OIAA_CONFIG = { apiUrl: "  " }
    expect(getApiUrl()).toBeUndefined()
  })

  test("returns undefined in WordPress when apiUrl is missing", () => {
    window.OIAA_CONFIG = { basePath: "/meetings" }
    expect(getApiUrl()).toBeUndefined()
  })

  test("uses VITE_CQ_URL outside WordPress", () => {
    expect(getApiUrl()).toBe(BUILD_URL)
  })

  test("makes no request in WordPress when the setting is empty", async () => {
    window.OIAA_CONFIG = { apiUrl: "" }
    const fetchSpy = vi.spyOn(globalThis, "fetch")
    await expect(getMeetings()).rejects.toThrow("App not configured correctly")
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
