import { Result, Ok, Err } from "ts-results-es"

const fallbackVideoServices: Record<string, string[]> = {
  BlueJeans: ["bluejeans.com"],
  DialPad: ["meetings.dialpad.com"],
  Discord: ["discord.gg"],
  "Free Conference": ["freeconference.com"],
  FreeConferenceCall: ["freeconferencecall.com"],
  "Google Meet": ["meet.google.com"],
  GoTo: ["goto.com", "gotomeet.me", "gotomeeting.com"],
  Jitsi: ["meet.jit.si"],
  "Microsoft Teams": ["teams.live.com", "teams.microsoft.com"],
  Signal: ["signal.group"],
  Skype: ["skype.com"],
  "Virtual Reality": [
    "horizon.meta.com",
    "maps.secondlife.com",
    "slurl.com",
    "vrchat.com",
  ],
  WebEx: ["webex.com"],
  Zoho: ["zoho.com"],
  Zoom: ["zoom.us"],
}

function getVideoServiceMap(): Record<string, string[]> {
  // TODO: Replace this with actual fetch-once from central-query on initialization logic
  // For now, simply return the fallback version.
  return fallbackVideoServices
}

export function getServiceProviderNameFromUrl(
  url: string
): Result<string, Error> {
  if (!url) {
    return Err(new Error("URL is empty or undefined"))
  }

  try {
    const host = new URL(url).hostname
    const serviceMap = getVideoServiceMap()

    const match = Object.entries(serviceMap).find(([, domains]) =>
      domains.some((domain) => host.endsWith(domain))
    )

    return match ? Ok(match[0]) : Err(new Error("No matching provider found"))
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)))
  }
}
